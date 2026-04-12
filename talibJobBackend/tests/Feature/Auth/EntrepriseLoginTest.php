<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\Entreprise;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EntrepriseLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_entreprise_login()
{
    $pass = "password123";
    \App\Models\Entreprise::create([
        'nom' => 'Entreprise', 
        'email' => 'rh_test@entreprise.ma',
        'motDePasse' => \Hash::make($pass)
    ]);

    $response = $this->postJson('/api/entreprise/login', [
        "email" => "rh_test@entreprise.ma",
        "motDePasse" => $pass // Corrigé : motDePasse
    ]);

    $response->assertStatus(200);
}
}