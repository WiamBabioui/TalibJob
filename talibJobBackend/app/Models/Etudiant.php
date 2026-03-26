<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Etudiant extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'Etudiant';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'motDePasse',
        'telephone',
        'cv',
        'competences',
        'photoProfil',
        'statut',
        'dernierLogin',
        'dateInscription',
        'dateModification'
    ];

    protected $hidden = [
        'motDePasse',
        'tokenVerification',
        'tokenResetPassword'
    ];

    protected $casts = [
        'emailVerifie' => 'boolean',
        'dernierLogin' => 'datetime'
    ];

    public function getAuthPassword()
    {
        return $this->motDePasse;
    }

    // Relations

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'idEtudiant');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'idEtudiant');
    }

    // Accessor compétences

    public function getCompetencesArrayAttribute()
    {
        if (!$this->competences) return [];

        return array_values(
            array_filter(
                array_map('trim', explode(',', $this->competences))
            )
        );
    }

    // Progression profil

    public function getProgressionAttribute()
    {
        $score = 0;

        if ($this->photoProfil) $score += 25;
        if ($this->cv) $score += 25;
        if ($this->competences) $score += 25;
        if ($this->telephone) $score += 25;

        return $score;
    }
}