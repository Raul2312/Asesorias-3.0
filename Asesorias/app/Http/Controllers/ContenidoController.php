<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contenido;

class ContenidoController extends Controller
{
    // Mostrar contenido
    public function show(Contenido $contenido)
    {
        return response()->json([
            'success' => true,
            'data' => $contenido
        ]);
    }

    // Crear contenido
    public function store(Request $request)
    {
        $request->validate([
            'id_subtema' => 'required|exists:subtemas,id',
            'titulo' => 'required|string|max:200',
            'contenido' => 'required|string',
        ]);

        $contenido = Contenido::create([
            'id_subtema' => $request->id_subtema,
            'id_user' => auth()->id(), // 🔥 ahora con usuario autenticado
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contenido creado correctamente',
            'data' => $contenido
        ], 201);
    }

    // Actualizar contenido
    public function update(Request $request, Contenido $contenido)
    {
        $user = auth()->user();

        if ($user->nivel !== 'docente') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar'
            ], 403);
        }

        $request->validate([
            'titulo' => 'required|string|max:200',
            'contenido' => 'required|string'
        ]);

        $contenido->update([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'id_user' => $user->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contenido actualizado',
            'data' => $contenido
        ]);
    }

    // Eliminar contenido
    public function destroy(Contenido $contenido)
    {
        $user = auth()->user();

        if ($user->nivel !== 'docente') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar'
            ], 403);
        }

        $contenido->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contenido eliminado'
        ]);
    }
}