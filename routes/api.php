<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InstagramWebhookController;

Route::get('/webhook/instagram', [InstagramWebhookController::class, 'verify']);
Route::post('/webhook/instagram', [InstagramWebhookController::class, 'handle']);
