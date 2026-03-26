<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mission extends Model
{
    use HasFactory;

    protected $table      = 'Mission';
    public    $timestamps = false;

    protected $fillable = [
        'idEntreprise', 'titre', 'description', 'type',
        'competencesRequises', 'duree', 'remuneration', 'lieu',
        'dateDebut', 'dateFin', 'statut', 'nombreCandidatures',
        'vues', 'datePublication', 'dateCreation', 'dateModification',
    ];

    protected $casts = [
        'dateDebut'        => 'date',
        'dateFin'          => 'date',
        'datePublication'  => 'datetime',
        'dateCreation'     => 'datetime',
        'dateModification' => 'datetime',
        'remuneration'     => 'decimal:2',
    ];

    // Relations
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'idEntreprise');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'idMission');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('statut', 'active');
    }

    public function scopeSearch($query, string $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('titre',                'like', "%{$keyword}%")
              ->orWhere('description',         'like', "%{$keyword}%")
              ->orWhere('lieu',                'like', "%{$keyword}%")
              ->orWhere('competencesRequises', 'like', "%{$keyword}%");
        });
    }
}
