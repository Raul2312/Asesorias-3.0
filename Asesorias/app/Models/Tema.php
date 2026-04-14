<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'unidad_id', 'orden'];

    // Relación para que res.data.data.map funcione con subtemas
    public function subtemas()
    {
        return $this->hasMany(Subtema::class, 'tema_id');
    }
}