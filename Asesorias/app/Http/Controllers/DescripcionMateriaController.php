<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DescripcionMateria;

class DescripcionMateriaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_materia' => 'required|integer|exists:materias,id',
            'descripcion' => 'nullable|string'
        ]);

        $descripcion = DescripcionMateria::updateOrCreate(
            ['id_materia' => $request->id_materia],
            [
                'id_user' => auth()->id(), // 🔥 sin session
                'descripcion' => $request->descripcion
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Descripción guardada correctamente',
            'data' => $descripcion
        ]);
    }
}