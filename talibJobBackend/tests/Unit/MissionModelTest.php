<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Mission;
use App\Models\Entreprise;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MissionModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_mission_creation()
    {
        // 1. Créer une entreprise d'abord
        $entreprise = Entreprise::create([
            'nom' => 'Tech Innov',
            'email' => 'contact@tech.com',
            'motDePasse' => bcrypt('password')
        ]);

        // 2. Créer la mission liée à cette entreprise
        $mission = Mission::create([
            'titre' => 'Mission Test',
            'description' => 'Description de test',
            'statut' => 'active',
            'idEntreprise' => $entreprise->id
        ]);

        $this->assertEquals('Mission Test', $mission->titre);
        $this->assertDatabaseHas('Mission', ['titre' => 'Mission Test']);
    }
}