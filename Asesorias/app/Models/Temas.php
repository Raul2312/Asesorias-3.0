<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tema extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     * @var string
     */
    protected $table = 'temas';

    /**
     * Atributos asignables de forma masiva (Mass Assignment).
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'contenido',
        'orden',
        'unidad_id',
    ];

    /**
     * Relación Inversa: Un Tema pertenece a una Unidad.
     * * @return BelongsTo
     */
    public function unidad(): BelongsTo
    {
        return $this->belongsTo(Unidad::class, 'unidad_id');
    }
}