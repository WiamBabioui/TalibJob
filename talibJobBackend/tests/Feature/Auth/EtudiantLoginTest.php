<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\Etudiant;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EtudiantLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_etudiant()
{
    $pass = "password123";
    \App\Models\Etudiant::create([
        'nom' => 'Nom', 'prenom' => 'Prenom',
        'email' => 'youssef@etu.ma',
        'motDePasse' => \Hash::make($pass)
    ]);

    $response = $this->postJson('/api/etudiant/login', [
        "email" => "youssef@etu.ma",
        "motDePasse" => $pass // Corrigé : motDePasse
    ]);

    $response->assertStatus(200);
}
}