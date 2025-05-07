<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use App\Models\PostTrigger;
use GuzzleHttp\Client;

class SendInstagramDmJob implements ShouldQueue
{
    use Queueable;

    protected $recipientId;
    protected $trigger;

    /**
     * Create a new job instance.
     */
    public function __construct(string $recipientId, PostTrigger $trigger)
    {
        $this->recipientId = $recipientId;
        $this->trigger = $trigger;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Attempting to send DM to recipient ID {$this->recipientId} for trigger ID {$this->trigger->id} via job.");
        $accessToken = env('INSTAGRAM_PAGE_ACCESS_TOKEN');
        $dmContent = $this->trigger->dm_message; // Already an array due to model cast

        Log::info('DM content details: ' . json_encode($dmContent));

        $mediaUrl = $dmContent['media_url'] ?? null;
        $mediaType = $dmContent['media_type'] ?? 'image'; // Default or derive
        $descriptionText = $dmContent['description_text'] ?? '';
        $ctaText = $dmContent['cta_text'] ?? 'Learn More';
        $ctaUrl = $dmContent['cta_url'] ?? null; // This will be the Telegram URL

        $messagePayload = [
            'recipient' => [
                'id' => $this->recipientId,
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


        Log::info('Constructed message payload: ' . json_encode($messagePayload));

        $client = new Client();
        // Use the correct Graph API endpoint for sending messages
        $graphApiUrl = 'https://graph.facebook.com/v19.0/me/messages?access_token=' . $accessToken;

        try {
            Log::info('Sending POST request to Graph API: ' . $graphApiUrl);
            $response = $client->post($graphApiUrl, [
                'headers' => ['Content-Type' => 'application/json'],
                'body' => json_encode($messagePayload),
            ]);

            $body = $response->getBody();
            Log::info('DM sent successfully: ' . $body);
        } catch (\Exception $e) {
            Log::error('Error sending DM: ' . $e->getMessage());
        }
    }
}
