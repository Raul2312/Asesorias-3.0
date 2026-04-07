<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenMateria extends Model
{
    use HasFactory;

    protected $table = 'imagenes_materia';
    protected $fillable = ['id_materia', 'ruta', 'id_user'];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia');
    }
}
