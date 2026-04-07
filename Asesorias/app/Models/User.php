<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject; // 🔥 IMPORTANTE

class User extends Authenticatable implements JWTSubject
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

    /*
    |--------------------------------------------------------------------------
    | JWT METHODS (OBLIGATORIO)
    |--------------------------------------------------------------------------
    */

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /*
    |--------------------------------------------------------------------------
    | RELACIONES
    |--------------------------------------------------------------------------
    */

    // Relación con Materias
    public function materias()
    {
        return $this->hasMany(Materia::class, 'id_users');
    }
}