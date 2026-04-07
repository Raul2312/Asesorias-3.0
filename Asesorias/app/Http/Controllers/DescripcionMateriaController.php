<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DescripcionMateria;

class DescripcionMateriaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_materia' => 'required|integer',
            'descripcion' => 'nullable|string'
        ]);

        // Verificar si ya existe descripción
        $descripcion = DescripcionMateria::updateOrCreate(
            ['id_materia' => $request->id_materia],
            [
                'id_user' => auth()->id() ?? session('usuario_id'), // quien la edita
                'descripcion' => $request->descripcion
            ]
        );

        return response()->json([
            'success' => true,
            'mensaje' => 'Descripción guardada correctamente',
            'descripcion' => $descripcion
        ]);
    }
}
