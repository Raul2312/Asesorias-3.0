<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Materia;
use App\Models\User;

class MateriaSeeder extends Seeder
{
    public function run(): void
    {
        // Buscamos al primer docente o usuario para asignarle las materias
        $user = User::where('nivel', 'docente')->first() ?: User::first();

        if (!$user) {
            $this->command->info('No hay usuarios en la base de datos. Crea uno primero.');
            return;
        }

        $materias = [
            [
                'nombre' => 'Programación Web Fullstack',
                'codigo_materia' => 'PW-2026',
                'cat' => 'programacion',
                'sem' => 5,
                'iconName' => 'code-2',
                'id_users' => $user->id
            ],
            [
                'nombre' => 'Cálculo Multivariado',
                'codigo_materia' => 'MAT-300',
                'cat' => 'matematicas',
                'sem' => 3,
                'iconName' => 'sigma',
                'id_users' => $user->id
            ],
            [
                'nombre' => 'Arquitectura de Redes',
                'codigo_materia' => 'RED-105',
                'cat' => 'redes',
                'sem' => 6,
                'iconName' => 'network',
                'id_users' => $user->id
            ],
            [
                'nombre' => 'Sistemas Embebidos (Arduino/ESP32)',
                'codigo_materia' => 'EMB-402',
                'cat' => 'electronica',
                'sem' => 7,
                'iconName' => 'cpu',
                'id_users' => $user->id
            ],
            [
                'nombre' => 'Gestión de Proyectos TI',
                'codigo_materia' => 'GST-900',
                'cat' => 'gestion',
                'sem' => 9,
                'iconName' => 'briefcase',
                'id_users' => $user->id
            ]
        ];

        foreach ($materias as $materia) {
            Materia::create($materia);
        }

        $this->command->info('Materias de prueba creadas con éxito.');
    }
}