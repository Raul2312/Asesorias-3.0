<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{
    protected $table = 'ejercicios';

    protected $fillable = [
        'nombre',
        'id_eje_unidad',
        'contenido'
    ];

    public function unidad()
    {
        return $this->belongsTo(EjeUnidad::class, 'id_eje_unidad');
    }
}