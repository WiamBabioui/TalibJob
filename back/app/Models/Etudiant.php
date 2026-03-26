<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Etudiant extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table      = 'Etudiant';  // Nom exact de la table SQL
    public $timestamps    = false;        // On gère dateInscription/dateModification manuellement

    protected $fillable = [
        'nom', 'prenom', 'email', 'motDePasse',
        'telephone', 'cv', 'competences', 'photoProfil',
        'statut', 'dernierLogin',
    ];

    protected $hidden = [
        'motDePasse', 'tokenVerification', 'tokenResetPassword',
    ];

    protected $casts = [
        'emailVerifie' => 'boolean',
        'dernierLogin' => 'datetime',
    ];

    // Sanctum utilise getAuthPassword() pour vérifier le mot de passe
    public function getAuthPassword(): string
    {
        return $this->motDePasse;
    }

    // ──────────────────────── Relations ────────────────────────

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'idEtudiant');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'idEtudiant');
    }

    // ──────────────────────── Accesseurs ────────────────────────

    // Retourne les compétences sous forme de tableau
    public function getCompetencesArrayAttribute(): array
    {
        if (!$this->competences) return [];
        return array_values(array_filter(array_map('trim', explode(',', $this->competences))));
    }

    // Calcule la progression du profil (0 à 100%)
    public function getProgressionAttribute(): int
    {
        $score = 0;
        if ($this->photoProfil)                              $score += 25;
        if ($this->cv)                                       $score += 25;
        if ($this->competences)                              $score += 25;
        if ($this->telephone)                                $score += 25;
        return $score;
    }
}
