<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si sigue la convención plural)
    protected $table = 'materias';

    /**
     * Los atributos que se pueden asignar masivamente.
     * Es CRUCIAL que estos nombres coincidan con los que envías en el JSON desde React.
     */
    protected $fillable = [
        'nombre',
        'codigo_materia',
        'cat',
        'sem',
        'iconName',
        'id_users', // Sincronizado con tu clave foránea
        'estatus'   // Por si manejas bajas lógicas (activo/inactivo)
    ];

    /**
     * Relación con el usuario (Docente)
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_users');
    }
}