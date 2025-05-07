<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

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

                        if ($mediaId == env('TARGET_INSTAGRAM_POST_ID') && strpos($commentText, strtolower(env('TRIGGER_KEYWORD'))) !== false) {
                            // Send DM
                            $this->sendDm($commenterId);
                        }
                    }
                }
            }
        }

        return Response::make('Event received', 200);
    }

    private function sendDm($recipientId)
    {
        $accessToken = env('INSTAGRAM_PAGE_ACCESS_TOKEN');
        $mediaUrl = env('MEDIA_URL');
        $descriptionText = env('DESCRIPTION_TEXT');
        $telegramPostUrl = env('TELEGRAM_POST_URL');

        $messagePayload = [
            'recipient' => [
                'id' => $recipientId,
            ],
            'message' => [],
        ];

        if ($mediaUrl) {
            $mediaType = 'image';
            if (strtolower(substr($mediaUrl, -3)) === 'mp4' || strtolower(substr($mediaUrl, -3)) === 'mov') {
                $mediaType = 'video';
            } elseif (strtolower(substr($mediaUrl, -3)) === 'mp3' || strtolower(substr($mediaUrl, -3)) === 'wav') {
                $mediaType = 'audio';
            }

            $messagePayload['message']['attachment'] = [
                'type' => $mediaType,
                'payload' => [
                    'url' => $mediaUrl,
                    'is_reusable' => true,
                ],
            ];
        }

        $textMessage = $descriptionText;
        if ($telegramPostUrl) {
            $textMessage .= "\n\nFind more details here: " . $telegramPostUrl;
        }

        $messagePayload['message']['text'] = $textMessage;

        $client = new \GuzzleHttp\Client();
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
