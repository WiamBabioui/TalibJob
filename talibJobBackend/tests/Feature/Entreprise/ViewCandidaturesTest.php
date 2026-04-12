<?php
namespace Tests\Feature\Entreprise;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
class ViewCandidaturesTest extends TestCase
{
    use RefreshDatabase;
    public function test_view_candidatures()
    {
        $response = $this->getJson("/api/candidatures");

        $response->assertStatus(200);
    }
}