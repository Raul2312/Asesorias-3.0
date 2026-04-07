<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'ap_paterno',
        'ap_materno',
        'email',
        'nivel',
        'password',
        'foto_perfil'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relación con Materias
    public function materias()
    {
        return $this->hasMany(Materia::class, 'id_users');
    }
}
