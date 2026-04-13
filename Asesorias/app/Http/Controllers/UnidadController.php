<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Unidad;

class UnidadController extends Controller
{
    public function store(Request $request, $materiaId)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'titulo' => 'nullable|string|max:255',
            'numero_unidad' => 'required|integer|min:1',
        ]);

        $unidad = Unidad::create([
            'nombre' => $request->nombre,
            'titulo' => $request->titulo,
            'id_materia' => $materiaId,
            'numero_unidad' => $request->numero_unidad,
            'orden' => $request->numero_unidad,
        ]);

        return response()->json([
            'success' => true,
            'data' => $unidad
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $unidad = Unidad::find($id);

        if (!$unidad) {
            return response()->json([
                'success'=>false,
                'message'=>'Unidad no encontrada'
            ],404);
        }

        $unidad->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $unidad
        ]);
    }

    public function destroy($id)
    {
        $unidad = Unidad::find($id);

        if (!$unidad) {
            return response()->json([
                'success'=>false,
                'message'=>'Unidad no encontrada'
            ],404);
        }

        $unidad->delete();

        return response()->json([
            'success' => true
        ]);
    }
    public function indexPorMateria($materiaId) {
    return Unidad::where('id_materia', $materiaId)->orderBy('numero_unidad', 'asc')->get();
}
}