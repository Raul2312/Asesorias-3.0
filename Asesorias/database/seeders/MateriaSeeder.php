<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Materia;

class MateriaSeeder extends Seeder
{
    public function run(): void
    {
        Materia::updateOrCreate(
            ['codigo_materia' => 'BD101'],
            [
                'nombre' => 'Base de Datos',
                'id_users' => 1, // 👈 fijo para pruebas
                'estatus' => 1
            ]
        );
    }
}
