<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Entreprise extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table   = 'Entreprise';
    public $timestamps = false;

    protected $fillable = [
        'nom', 'email', 'motDePasse', 'telephone',
        'adresse', 'secteur', 'description', 'siteWeb',
        'logo', 'siret', 'statut', 'dernierLogin',
    ];

    protected $hidden = [
        'motDePasse', 'tokenVerification', 'tokenResetPassword',
    ];

    protected $casts = [
        'emailVerifie' => 'boolean',
        'dernierLogin' => 'datetime',
    ];

    public function getAuthPassword(): string
    {
        return $this->motDePasse;
    }

    // ──────────────────────── Relations ────────────────────────

    public function missions()
    {
        return $this->hasMany(Mission::class, 'idEntreprise');
    }

    public function missionsActives()
    {
        return $this->hasMany(Mission::class, 'idEntreprise')
                    ->where('statut', 'active');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'idEntreprise');
    }
}
