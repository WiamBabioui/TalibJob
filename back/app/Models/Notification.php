<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table   = 'Notification';
    public $timestamps = false;

    protected $fillable = [
        'typeUtilisateur', 'idUtilisateur',
        'titre', 'message', 'type', 'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];
}
