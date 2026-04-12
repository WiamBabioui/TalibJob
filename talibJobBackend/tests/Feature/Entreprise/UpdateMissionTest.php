<?php
namespace Tests\Feature\Entreprise;

use Tests\TestCase;

use Illuminate\Foundation\Testing\RefreshDatabase;
class UpdateMissionTest extends TestCase
{
    use RefreshDatabase;
    public function test_update_mission()
{
    $entreprise = \App\Models\Entreprise::create([
        'nom' => 'Ent', 'email' => 'up@test.com', 'motDePasse' => \Hash::make('password123')
    ]);
    
    $mission = \App\Models\Mission::create([
        'titre' => 'Ancien Titre',
        'description' => 'Description de la mission à modifier.',
        'idEntreprise' => $entreprise->id,
        'statut' => 'active' // Utilisation de 'active' ici
    ]);

    \Laravel\Sanctum\Sanctum::actingAs($entreprise, ['*']);

    $response = $this->putJson("/api/entreprise/missions/{$mission->id}", [
        "titre" => "Titre Mis à jour"
    ]);

    $response->assertStatus(200);
}
}