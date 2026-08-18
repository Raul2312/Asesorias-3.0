<?php

namespace App\Http\Controllers;

use App\Models\Subtema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MultimediaController extends Controller
{
    /**
     * Subir imagen de un subtema
     */
    public function guardarImagen(Request $request, Subtema $subtema): JsonResponse
    {
        $request->validate([
            'imagen' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:5120'
            ],
        ]);

        try {

            $archivo = $request->file('imagen');

            // Guardar imagen
            $path = $archivo->store(
                'uploads/subtemas',
                'public'
            );

            // URL pública
            $url = asset('storage/' . $path);

            return response()->json([
                'success' => true,
                'message' => 'Imagen subida correctamente',

                'data' => [
                    'url' => $url,
                    'path' => $path,
                    'nombre' => $archivo->getClientOriginalName(),
                    'tipo' => $archivo->getMimeType(),
                    'tamano' => $archivo->getSize(),
                ]

            ], 201);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'No se pudo subir la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}