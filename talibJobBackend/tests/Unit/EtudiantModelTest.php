<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Etudiant;
use Illuminate\Foundation\Testing\RefreshDatabase; 

class EtudiantModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_etudiant()
    {
        // On crée un étudiant avec tous les champs nécessaires
        $etudiant = Etudiant::create([
            'nom' => 'Test Nom',
            'prenom' => 'Test Prenom',
            'email' => 'test@test.com',
            'motDePasse' => bcrypt('password123')
        ]);

        $this->assertDatabaseHas('Etudiant', [
            'email' => 'test@test.com'
        ]);
    }
}