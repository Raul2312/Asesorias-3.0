<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ejercicio;

class EjercicioController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'unidadId' => 'required|exists:ejeunidades,id',
            'nombre' => 'required|string|max:150',
            'contenido' => 'nullable|string'
        ]);

        $ejercicio = Ejercicio::create([
            'nombre' => $request->nombre,
            'id_eje_unidad' => $request->unidadId,
            'contenido' => $request->contenido
        ]);

        return response()->json([
            'success' => true,
            'data' => $ejercicio
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $ejercicio = Ejercicio::find($id);

        if (!$ejercicio) {
            return response()->json([
                'success' => false,
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        $request->validate([
            'contenido' => 'nullable|string'
        ]);

        $ejercicio->update([
            'contenido' => $request->contenido
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Guardado correctamente',
            'data' => $ejercicio
        ]);
    }

    public function destroy($id)
    {
        $ejercicio = Ejercicio::find($id);

        if (!$ejercicio) {
            return response()->json([
                'success' => false,
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        $ejercicio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ejercicio eliminado'
        ]);
    }

    public function show($id)
    {
        $ejercicio = Ejercicio::with('unidad.materia')->find($id);

        if (!$ejercicio) {
            return response()->json([
                'success' => false,
                'message' => 'Ejercicio no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ejercicio
        ]);
    }
}