<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EjeSubtema extends Model
{
    protected $table = 'ejesubtemas';

    protected $fillable = [
        'id_unidad',
        'nombre'
    ];

    public function unidad()
    {
        return $this->belongsTo(EjeUnidad::class, 'id_unidad');
    }

    public function contenidos()
    {
        return $this->hasMany(Contenido::class, 'id_subtema');
    }
}

