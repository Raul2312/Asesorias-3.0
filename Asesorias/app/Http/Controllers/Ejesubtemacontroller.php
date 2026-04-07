<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EjeSubtema;

class EjeSubtemaController extends Controller
{
    public function show($subtemaId)
    {
        $subtema = EjeSubtema::with(['unidad.materia', 'contenidos'])
            ->find($subtemaId);

        if (!$subtema) {
            return response()->json([
                'success' => false,
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subtema
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_unidad' => 'required|exists:ejeunidades,id',
            'nombre' => 'required|string|max:150',
        ]);

        $subtema = EjeSubtema::create([
            'id_unidad' => $request->id_unidad,
            'nombre' => $request->nombre,
        ]);

        return response()->json([
            'success' => true,
            'data' => $subtema
        ], 201);
    }

    public function update(Request $request, $subtemaId)
    {
        $subtema = EjeSubtema::find($subtemaId);

        if (!$subtema) {
            return response()->json([
                'success' => false,
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        $subtema->update([
            'nombre' => $request->nombre
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subtema actualizado',
            'data' => $subtema
        ]);
    }

    public function destroy($subtemaId)
    {
        $subtema = EjeSubtema::find($subtemaId);

        if (!$subtema) {
            return response()->json([
                'success' => false,
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        $subtema->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subtema eliminado'
        ]);
    }
}