<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;
use App\Models\PostTrigger;
use App\Jobs\SendInstagramDmJob;

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
            Log::info('Webhook verification successful.');
            return Response::make($challenge, 200);
        }

        Log::error('Webhook verification failed: Invalid mode or token.');
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
        Log::info('Webhook handle method called.');
        // Verify signature
        $signature = $request->header('X-Hub-Signature-256');
        if (!$signature) {
            Log::error('Missing signature');
            return Response::make('Missing signature', 400);
        }

        $expectedSignature = 'sha256=' . hash_hmac('sha256', $request->getContent(), env('FACEBOOK_APP_SECRET'));
        if (!hash_equals($expectedSignature, $signature)) {
            Log::error('Invalid signature');
            return Response::make('Invalid signature', 403);
        }
        Log::info('Signature verification successful.');

        // Process payload
        $data = $request->json()->all();
        Log::info('Received webhook payload: ' . json_encode($data));

        if ($data['object'] === 'instagram') {
            Log::info('Processing Instagram object.');
            foreach ($data['entry'] as $entry) {
                foreach ($entry['changes'] as $change) {
                    Log::info('Processing change: ' . json_encode($change));
                    if ($change['field'] === 'comments') {
                        $value = $change['value'];
                        $mediaId = $value['media']['id'];
                        $commentText = strtolower($value['text']);
                        $commenterId = $value['from']['id'];

                        Log::info("Comment received on media ID {$mediaId} from user ID {$commenterId}: '{$commentText}'");

                        // Query PostTrigger model
                        $triggers = PostTrigger::where('instagram_post_id', $mediaId)
                                            ->where('is_active', true)
                                            ->get();

                        Log::info("Found " . $triggers->count() . " active triggers for media ID {$mediaId}.");

                        foreach ($triggers as $trigger) {
                            // Ensure keyword matching is case-insensitive
                            if (str_contains($commentText, strtolower($trigger->keyword))) {
                                Log::info("Keyword '{$trigger->keyword}' matched for trigger ID {$trigger->id}.");
                                // Keyword matched for this trigger
                                SendInstagramDmJob::dispatch($commenterId, $trigger);
                                Log::info("Dispatched SendInstagramDmJob for recipient ID {$commenterId} and trigger ID {$trigger->id}.");
                                // Decide if multiple keyword matches on one comment should send multiple DMs or break;
                                break; // Sending one DM per comment for the first matched trigger
                            } else {
                                Log::info("Keyword '{$trigger->keyword}' did not match for trigger ID {$trigger->id}.");
                            }
                        }
                    }
                    // Add handling for other fields like 'messaging' for story replies if needed later
                }
            }
        } else {
            Log::info('Received non-instagram object: ' . $data['object']);
        }

        return Response::make('Event received', 200);
    }
}
