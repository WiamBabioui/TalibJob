<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Entreprise;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EntrepriseModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_entreprise()
    {
        $entreprise = Entreprise::create([
            "nom" => "Test Company",
            "email" => "test@company.com",
            "motDePasse" => bcrypt("123456")
        ]);

        $this->assertDatabaseHas("Entreprise",[
            "email"=>"test@company.com"
        ]);
    }
}