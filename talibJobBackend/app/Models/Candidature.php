<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    protected $table   = 'Candidature';
    public $timestamps = false;

    protected $fillable = [
        'idEtudiant', 'idMission', 'statut',
        'lettreMotivation', 'cvPersonnalise',
        'dateReponse', 'commentaireEntreprise',
    ];

    protected $casts = [
        'dateEnvoi'   => 'datetime',
        'dateReponse' => 'datetime',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant');
    }

    public function mission()
    {
        return $this->belongsTo(Mission::class, 'idMission');
    }

    // Couleur Bootstrap selon le statut
    public function getBadgeColorAttribute(): string
    {
        return match($this->statut) {
            'acceptee'   => 'success',
            'refusee'    => 'danger',
            'vue'        => 'info',
            'retiree'    => 'secondary',
            default      => 'warning',
        };
    }

    // Label lisible
    public function getStatutLabelAttribute(): string
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'vue'        => 'Vue',
            'acceptee'   => 'Acceptée',
            'refusee'    => 'Refusée',
            'retiree'    => 'Retirée',
            default      => 'Inconnu',
        };
    }
}
