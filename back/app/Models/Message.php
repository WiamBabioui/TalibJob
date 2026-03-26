<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table   = 'Message';
    public $timestamps = false;

    protected $fillable = [
        'idEtudiant', 'idEntreprise', 'expediteur',
        'sujet', 'message', 'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'idEntreprise');
    }
}
