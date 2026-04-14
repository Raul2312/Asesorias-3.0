<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subtema extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'contenido', 'tema_id'];

    // Convertimos automáticamente el JSON de la DB a un array de PHP
    protected $casts = [
        'contenido' => 'array'
    ];
}