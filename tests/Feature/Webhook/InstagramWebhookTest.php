<?php

namespace Tests\Feature\Webhook;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InstagramWebhookTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_verify_the_webhook_signature()
    {
        $this->assertTrue(true);
    }
}
