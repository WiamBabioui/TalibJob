<?php
namespace Tests\Feature\Entreprise;

use Tests\TestCase;
use App\Models\Entreprise;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateMissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_mission()
{
    $ent = \App\Models\Entreprise::create([
        'nom' => 'Tech', 'email' => 't_'.time().'@t.com', 'motDePasse' => \Hash::make('password123')
    ]);
    \Laravel\Sanctum\Sanctum::actingAs($ent, ['*']);

    $response = $this->postJson('/api/entreprise/missions', [
        "titre" => "Développeur PHP Laravel",
        "description" => "Description très longue de plus de vingt caractères pour la validation.",
        "statut" => "active",
        "lieu" => "Casablanca", // Corrigé : 'lieu' au lieu de 'localisation'
        "type" => "Stage",
        "idEntreprise" => $ent->id
    ]);

    $response->assertStatus(201);
}
}