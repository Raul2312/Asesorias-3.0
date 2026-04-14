<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class TemaController extends Controller
{
    /**
     * Obtener todos los temas de una unidad específica.
     */
    public function getTemasByUnidad($unidad_id): JsonResponse
    {
        // Buscamos los temas y los ordenamos por el campo 'orden'
        $temas = Tema::where('unidad_id', $unidad_id)
                     ->orderBy('orden', 'asc')
                     ->get();

        return response()->json([
            'success' => true,
            'data'    => $temas
        ], 200);
    }

    /**
     * Guardar un nuevo tema vinculado a una unidad.
     */
    public function store(Request $request, $unidad_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre'    => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'orden'     => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $tema = Tema::create([
                'nombre'    => $request->nombre,
                'contenido' => $request->contenido,
                'orden'     => $request->orden ?? 1,
                'unidad_id' => $unidad_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tema creado con éxito',
                'data'    => $tema
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el tema: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un tema existente.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $tema = Tema::find($id);

        if (!$tema) {
            return response()->json(['success' => false, 'message' => 'Tema no encontrado'], 404);
        }

        $tema->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tema actualizado',
            'data'    => $tema
        ]);
    }

    /**
     * Eliminar un tema.
     */
    public function destroy($id): JsonResponse
    {
        $tema = Tema::find($id);

        if (!$tema) {
            return response()->json(['success' => false, 'message' => 'Tema no encontrado'], 404);
        }

        $tema->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tema eliminado correctamente'
        ]);
    }
}