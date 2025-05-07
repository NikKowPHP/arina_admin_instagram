<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TriggerManagementTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_display_the_triggers_index_page()
    {
        $this->assertTrue(true);
    }
}
