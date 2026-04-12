<?php
namespace Tests\Feature\Etudiant;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase; // Import manquant

class EtudiantProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_profile()
    {
        $response = $this->getJson("/api/etudiant/profile");
        $response->assertStatus(200);
    }
}