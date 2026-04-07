<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EjeUnidad;

class EjeUnidadController extends Controller
{
    public function store(Request $request, $materiaId)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'titulo' => 'nullable|string|max:255',
            'numero_unidad' => 'required|integer|min:1',
        ]);

        $unidad = EjeUnidad::create([
            'nombre' => $request->nombre,
            'titulo' => $request->titulo,
            'id_materia' => $materiaId,
            'numero_unidad' => $request->numero_unidad,
            'orden' => $request->numero_unidad,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Unidad creada correctamente',
            'data' => $unidad
        ], 201);
    }

    public function update(Request $request, $unidadId)
    {
        $unidad = EjeUnidad::find($unidadId);

        if (!$unidad) {
            return response()->json([
                'success' => false,
                'message' => 'Unidad no encontrada'
            ], 404);
        }

        $unidad->update([
            'nombre' => $request->nombre,
            'titulo' => $request->titulo,
            'numero_unidad' => $request->numero_unidad,
            'orden' => $request->numero_unidad,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Unidad actualizada',
            'data' => $unidad
        ]);
    }

    public function destroy($unidadId)
    {
        $unidad = EjeUnidad::find($unidadId);

        if (!$unidad) {
            return response()->json([
                'success' => false,
                'message' => 'Unidad no encontrada'
            ], 404);
        }

        $unidad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unidad eliminada'
        ]);
    }
}