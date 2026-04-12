<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Candidature;
use App\Models\Etudiant;
use App\Models\Mission;
use App\Models\Entreprise;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CandidatureModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_candidature()
    {
        // Créer les données parentes nécessaires
        $etudiant = Etudiant::create([
            'nom'=>'Etu', 'prenom'=>'Test', 'email'=>'e@test.com', 'motDePasse'=>bcrypt('123')
        ]);
        
        $entreprise = Entreprise::create([
            'nom'=>'Ent', 'email'=>'ent@test.com', 'motDePasse'=>bcrypt('123')
        ]);

        $mission = Mission::create([
            'titre'=>'Mission', 'description'=>'Desc', 'statut'=>'active', 'idEntreprise'=>$entreprise->id
        ]);

        // Créer la candidature avec les vrais IDs
        $candidature = Candidature::create([
            "idEtudiant" => $etudiant->id,
            "idMission" => $mission->id
        ]);

        $this->assertEquals($etudiant->id, $candidature->idEtudiant);
        $this->assertDatabaseHas('Candidature', ['idEtudiant' => $etudiant->id]);
    }
}