<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Multimedia extends Model
{
    use HasFactory;

    protected $table = 'multimedia';
    protected $fillable = ['nombre', 'ruta', 'tipo', 'tamano', 'id_contenido'];

    public function contenido()
    {
        return $this->belongsTo(Contenido::class, 'id_contenido');
    }
}
