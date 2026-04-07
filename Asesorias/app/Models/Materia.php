<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $table = 'materias';

    protected $fillable = [
        'nombre',
        'codigo_materia',
        'id_users'
    ];

    public function docente()
    {
        return $this->belongsTo(User::class, 'id_users');
    }

    // Relación con Unidades
    public function unidades()
    {
        return $this->hasMany(Unidad::class, 'id_materia')->orderBy('orden');
    }
    
    public function ejeunidades()
    {
        return $this->hasMany(EjeUnidad::class, 'id_materia');
    }

    public function descripcion()
    {
        return $this->hasOne(\App\Models\DescripcionMateria::class, 'id_materia');
    }

    // app/Models/Materia.php
    public function imagenes()
    {
        return $this->hasMany(ImagenMateria::class, 'id_materia');
    }




}
