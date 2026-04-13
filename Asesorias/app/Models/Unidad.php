<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unidad extends Model
{
    use HasFactory;

    protected $table = 'unidades';
    protected $fillable = ['nombre', 'titulo', 'id_materia', 'numero_unidad', 'orden'];

    public function subtemas()
    {
        return $this->hasMany(Subtema::class, 'id_unidad');
    }
    public function materia()
{
    return $this->belongsTo(Materia::class, 'id_materia');
}

    

}

