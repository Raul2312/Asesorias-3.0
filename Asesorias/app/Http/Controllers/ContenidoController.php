<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contenido;
use App\Models\Subtema;

class ContenidoController extends Controller
{
    // Mostrar contenido
    public function show(Contenido $contenido)
    {
        $usuario_nivel = session('usuario_nivel', 'alumno');
        return view('contenidos.show', compact('contenido', 'usuario_nivel'));
    }

    // Crear nuevo contenido dentro de un subtema
    public function store(Request $request)
{
    $request->validate([
        'id_subtema' => 'required|exists:subtemas,id',
        'titulo' => 'required|string|max:200',
        'contenido' => 'required|string',
    ]);

    $contenido = Contenido::create([
        'id_subtema' => $request->id_subtema,
        'id_user' => session('usuario_id'), // ⚡ así funciona con tu sistema
        'titulo' => $request->titulo,
        'contenido' => $request->contenido,
    ]);

    return response()->json([
        'success' => true,
        'contenido' => $contenido,
        'mensaje' => 'Contenido creado correctamente',
    ]);
}


    // Actualizar contenido existente
    public function update(Request $request, Contenido $contenido)
    {
        $usuario_nivel = session('usuario_nivel', 'alumno');

        if ($usuario_nivel !== 'docente') {
            return response()->json([
                'success' => false,
                'mensaje' => 'No tienes permisos para editar este contenido.'
            ], 403);
        }

        $request->validate([
            'titulo' => 'required|string|max:200',
            'contenido' => 'required|string'
        ]);

        $contenido->update([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'id_user' => session('usuario_id') // siempre actualizar con el usuario que edita
        ]);

        return response()->json([
            'success' => true,
            'contenido' => $contenido,
            'mensaje' => 'Contenido actualizado correctamente'
        ]);
    }

    // Eliminar contenido
    public function destroy(Contenido $contenido)
    {
        $usuario_nivel = session('usuario_nivel', 'alumno');

        if ($usuario_nivel !== 'docente') {
            return response()->json([
                'success' => false,
                'mensaje' => 'No tienes permisos para eliminar este contenido.'
            ], 403);
        }

        $contenido->delete();

        return response()->json([
            'success' => true,
            'mensaje' => 'Contenido eliminado correctamente'
        ]);
    }
}
