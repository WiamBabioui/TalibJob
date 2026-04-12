<?php
namespace Tests\Feature\Mission;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
class MissionSearchTest extends TestCase
{
    use RefreshDatabase;
    public function test_search_mission()
    {
        $response = $this->getJson("/api/missions?search=React");

        $response->assertStatus(200);
    }
}