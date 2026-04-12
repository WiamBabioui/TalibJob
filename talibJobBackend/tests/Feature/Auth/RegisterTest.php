<?php
namespace Tests\Feature\Auth;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;
    public function test_register_etudiant()
{
    $response = $this->postJson('/api/etudiant/register', [
        "nom" => "Salami",
        "prenom" => "Youssef",
        "email" => "test_" . time() . "@test.com",
        "motDePasse" => "password123", // Corrigé : motDePasse
        "motDePasse_confirmation" => "password123", // Corrigé : confirmation
    ]);

    $response->assertStatus(201);
}
}