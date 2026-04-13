<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DescripcionMateria;
use Illuminate\Support\Facades\Auth;

class DescripcionMateriaController extends Controller
{
    /**
     * Muestra la descripción de una materia específica.
     * Esto es lo que React llama al cargar (GET).
     */
    public function show($id_materia)
    {
        try {
            $descripcion = DescripcionMateria::where('id_materia', $id_materia)->first();

            if (!$descripcion) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay descripción para esta materia.',
                    'data' => ['descripcion' => 'Materia sin descripción técnica.']
                ], 200); // Retornamos 200 para que React no de error de consola
            }

            return response()->json([
                'success' => true,
                'data' => $descripcion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Guarda o actualiza la descripción.
     * Esto es lo que el profesor llama al darle al "check" (POST).
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_materia' => 'required|integer',
            'descripcion' => 'nullable|string'
        ]);

        try {
            // Usamos updateOrCreate para que si ya existe la descripción, solo la actualice
            $descripcion = DescripcionMateria::updateOrCreate(
                ['id_materia' => $request->id_materia],
                [
                    'id_user' => auth()->id() ?? 1, // Si no hay auth para pruebas, pone ID 1
                    'descripcion' => $request->descripcion
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Descripción guardada correctamente',
                'data' => $descripcion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar en BD',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}