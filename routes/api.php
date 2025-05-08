<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InstagramWebhookController;

Route::get('/webhook/instagram', [InstagramWebhookController::class, 'verify']);
Route::post('/webhook/instagram', [InstagramWebhookController::class, 'handle']);

// Facebook webhook
Route::get('/webhook/facebook', function (Request $request) {
    $verifyToken = env('FACEBOOK_VERIFY_TOKEN');
    $challenge = $request->input('hub_challenge');
    $mode = $request->input('hub_mode');
    $token = $request->input('hub_verify_token');

    if ($mode === 'subscribe' && $token === $verifyToken) {
        return response($challenge, 200);
    } else {
        return response('Verification failed', 403);
    }
});

Route::post('/webhook/facebook', function (Request $request) {
    // Handle incoming Facebook webhook events here
    // You will need to parse the request body and process the events
    Log::info('Facebook webhook received', ['payload' => $request->all()]);
    return response('Event received', 200);
});
