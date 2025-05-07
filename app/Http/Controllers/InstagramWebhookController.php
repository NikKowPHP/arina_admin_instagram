<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\PostTrigger;

class InstagramWebhookController extends Controller
{
    /**
     * Handle webhook verification requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request)
    {
        $mode = $request->query('hub.mode');
        $token = $request->query('hub.verify_token');
        $challenge = $request->query('hub.challenge');

        if ($mode === 'subscribe' && $token === env('INSTAGRAM_WEBHOOK_VERIFY_TOKEN')) {
            return Response::make($challenge, 200);
        }

        return Response::make('Forbidden', 403);
    }

    /**
     * Handle incoming webhook events.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request)
    {
        // Verify signature
        $signature = $request->header('X-Hub-Signature-256');
        if (!$signature) {
            \Log::error('Missing signature');
            return Response::make('Missing signature', 400);
        }

        $expectedSignature = 'sha256=' . hash_hmac('sha256', $request->getContent(), env('FACEBOOK_APP_SECRET'));
        if (!hash_equals($expectedSignature, $signature)) {
            \Log::error('Invalid signature');
            return Response::make('Invalid signature', 403);
        }

        // Process payload
        $data = $request->json()->all();

        if ($data['object'] === 'instagram') {
            foreach ($data['entry'] as $entry) {
                foreach ($entry['changes'] as $change) {
                    if ($change['field'] === 'comments') {
                        $value = $change['value'];
                        $mediaId = $value['media']['id'];
                        $commentText = strtolower($value['text']);
                        $commenterId = $value['from']['id'];

                        // Query PostTrigger model
                        $triggers = PostTrigger::where('instagram_post_id', $mediaId)
                                            ->where('is_active', true)
                                            ->get();

                        foreach ($triggers as $trigger) {
                            // Ensure keyword matching is case-insensitive
                            if (str_contains($commentText, strtolower($trigger->keyword))) {
                                // Keyword matched for this trigger
                                $this->sendConfiguredDm($commenterId, $trigger);
                                // Decide if multiple keyword matches on one comment should send multiple DMs or break;
                                break; // Sending one DM per comment for the first matched trigger
                            }
                        }
                    }
                    // Add handling for other fields like 'messaging' for story replies if needed later
                }
            }
        }

        return Response::make('Event received', 200);
    }

    /**
     * Send a configured DM based on a PostTrigger.
     *
     * @param string $recipientId
     * @param PostTrigger $trigger
     * @return void
     */
    private function sendConfiguredDm(string $recipientId, PostTrigger $trigger)
    {
        $accessToken = env('INSTAGRAM_PAGE_ACCESS_TOKEN');
        $dmContent = $trigger->dm_message; // Already an array due to model cast

        $mediaUrl = $dmContent['media_url'] ?? null;
        $mediaType = $dmContent['media_type'] ?? 'image'; // Default or derive
        $descriptionText = $dmContent['description_text'] ?? '';
        $ctaText = $dmContent['cta_text'] ?? 'Learn More';
        $ctaUrl = $dmContent['cta_url'] ?? null; // This will be the Telegram URL

        $messagePayload = [
            'recipient' => [
                'id' => $recipientId,
            ],
            'message' => [],
        ];

        // Construct message payload - consider Generic Template if media_url is present
        if ($mediaUrl && $ctaUrl) {
            // Using Generic Template for rich content with CTA button
            $messagePayload['message']['attachment'] = [
                'type' => 'template',
                'payload' => [
                    'template_type' => 'generic',
                    'elements' => [
                        [
                            'title' => $descriptionText ?: 'DM from Bot', // Use description as title, fallback if empty
                            'image_url' => $mediaUrl,
                            'buttons' => [
                                [
                                    'type' => 'web_url',
                                    'url' => $ctaUrl,
                                    'title' => $ctaText,
                                ]
                            ],
                        ]
                    ],
                ],
            ];
        } elseif ($descriptionText || $ctaUrl) {
            // Sending a text message, potentially with an embedded link or button
            $textMessage = $descriptionText;
            if ($ctaUrl && !$mediaUrl) { // Add embedded link if no media and CTA URL exists
                 $textMessage .= "\n\n" . ($ctaText ?: 'Link') . ": " . $ctaUrl;
            }

            $messagePayload['message']['text'] = $textMessage;

            // Optionally add a web_url button even without media
            if ($ctaUrl && !$mediaUrl) {
                 $messagePayload['message']['quick_replies'] = [ // Using quick_replies for a button-like feel in text messages
                     [
                         'content_type' => 'text',
                         'title' => $ctaText,
                         'payload' => 'CTA_PAYLOAD', // Can be any string, not used for web_url
                         'image_url' => null, // No image for text quick reply
                     ]
                 ];
                 // Note: quick_replies are not standard buttons, they disappear after click.
                 // For persistent buttons, a different template type might be needed or a simple text message with the URL.
                 // Let's stick to a simple text message with embedded link for now if no media.
                 unset($messagePayload['message']['quick_replies']); // Remove quick replies for now
                 $textMessage = $descriptionText;
                 if ($ctaUrl) {
                     $textMessage .= "\n\n" . ($ctaText ?: 'Link') . ": " . $ctaUrl;
                 }
                 $messagePayload['message']['text'] = $textMessage;
            }


        } else {
            // No rich content, send a basic text message (shouldn't happen if keyword matches, but as a fallback)
             $messagePayload['message']['text'] = "Keyword matched, but no DM content configured.";
        }


        $client = new \GuzzleHttp\Client();
        // Use the correct Graph API endpoint for sending messages
        $graphApiUrl = 'https://graph.facebook.com/v19.0/me/messages?access_token=' . $accessToken;

        try {
            $response = $client->post($graphApiUrl, [
                'headers' => ['Content-Type' => 'application/json'],
                'body' => json_encode($messagePayload),
            ]);

            $body = $response->getBody();
            \Log::info('DM sent successfully: ' . $body);
        } catch (\Exception $e) {
            \Log::error('Error sending DM: ' . $e->getMessage());
        }
    }
}
