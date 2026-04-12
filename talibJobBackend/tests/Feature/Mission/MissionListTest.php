<?php
namespace Tests\Feature\Mission;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
class MissionListTest extends TestCase
{
    use RefreshDatabase;
    public function test_get_missions()
    {
        $response = $this->getJson("/api/missions");

        $response->assertStatus(200);
    }
}