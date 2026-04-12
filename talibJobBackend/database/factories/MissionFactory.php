<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MissionFactory extends Factory
{
    public function definition()
    {
        return [
            'titre' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'statut' => 'active'
        ];
    }
}