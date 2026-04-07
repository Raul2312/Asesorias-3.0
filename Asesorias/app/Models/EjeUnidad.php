<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EjeUnidad extends Model
{
    protected $table = 'ejeunidades';

    protected $fillable = [
        'nombre',
        'titulo',
        'id_materia',
        'numero_unidad',
        'orden'
    ];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia');
    }

    public function subtemas()
    {
        return $this->hasMany(EjeSubtema::class, 'id_unidad');
    }

    public function ejercicios()
    {
        return $this->hasMany(Ejercicio::class, 'id_eje_unidad');
    }
}


