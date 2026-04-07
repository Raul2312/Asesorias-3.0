<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DescripcionMateria extends Model
{
    use HasFactory;

    protected $table = 'descripcion_materia'; // nombre de la tabla

    protected $fillable = [
        'id_materia',
        'id_user',
        'descripcion'
    ];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
