<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contenido extends Model
{
    use HasFactory;

    protected $table = 'contenido';
    protected $fillable = ['id_subtema', 'titulo', 'contenido', 'id_user'];

    public function multimedia()
    {
        return $this->hasMany(Multimedia::class, 'id_contenido');
    }

    public function subtema()
    {
        return $this->belongsTo(Subtema::class, 'id_subtema');
    }
}
