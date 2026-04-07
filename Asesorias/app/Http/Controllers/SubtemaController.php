<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subtema;
use App\Models\Contenido;

class SubtemaController extends Controller
{
    // Mostrar subtema
    public function show($subtemaId)
    {
        $subtema = Subtema::with(['unidad.materia', 'contenidos'])->findOrFail($subtemaId);
        $usuario_nivel = session('usuario_nivel', 'alumno'); 
        $materia = $subtema->unidad->materia ?? null;

        if ($subtema->contenidos()->count() === 0 && $usuario_nivel === 'docente') {
            Contenido::create([
                'id_subtema' => $subtema->id,
                'id_user' => session('usuario_id'),
                'titulo' => 'Descripción',
                'contenido' => ''
            ]);
        }

        return view('subtema.show', compact('subtema', 'usuario_nivel', 'materia'));
    }

    // Crear subtema
    public function store(Request $request)
    {
        $usuario_nivel = session('usuario_nivel', 'alumno');
        if ($usuario_nivel !== 'docente') {
            return response()->json(['success'=>false,'mensaje'=>'No tienes permisos'],403);
        }

        $request->validate([
            'id_unidad' => 'required|exists:unidades,id',
            'nombre' => 'required|string|max:150',
        ]);

        $subtema = Subtema::create([
            'id_unidad' => $request->id_unidad,
            'nombre' => $request->nombre,
        ]);

        return response()->json([
            'success' => true,
            'subtema' => [
                'id' => $subtema->id,
                'nombre' => $subtema->nombre,
                'id_unidad' => $subtema->id_unidad
            ],
            'mensaje' => 'Subtema creado correctamente'
        ]);
    }

    // Actualizar subtema
    public function update(Request $request, $subtemaId)
    {
        $usuario_nivel = session('usuario_nivel', 'alumno');
        if ($usuario_nivel !== 'docente') {
            return response()->json(['success'=>false,'mensaje'=>'No tienes permisos'],403);
        }

        $request->validate([
            'nombre' => 'required|string|max:150',
        ]);

        $subtema = Subtema::findOrFail($subtemaId);
        $subtema->update([
            'nombre' => $request->nombre
        ]);

        return response()->json([
            'success' => true,
            'subtema' => [
                'id' => $subtema->id,
                'nombre' => $subtema->nombre,
                'id_unidad' => $subtema->id_unidad
            ],
            'mensaje' => 'Subtema actualizado correctamente'
        ]);
    }

    // Guardar descripción
    public function guardarDescripcion(Request $request)
    {
        $usuario_nivel = session('usuario_nivel', 'alumno');
        if ($usuario_nivel !== 'docente') {
            return response()->json(['success'=>false,'mensaje'=>'No tienes permisos'],403);
        }

        $request->validate([
            'id_subtema' => 'required|exists:subtemas,id',
            'descripcion' => 'required|string'
        ]);

        $subtema = Subtema::findOrFail($request->id_subtema);
        $contenido = $subtema->contenidos()->first();

        if ($contenido) {
            $contenido->update([
                'contenido' => $request->descripcion,
                'id_user' => session('usuario_id')
            ]);
        } else {
            Contenido::create([
                'id_subtema' => $subtema->id,
                'id_user' => session('usuario_id'),
                'titulo' => 'Descripción',
                'contenido' => $request->descripcion
            ]);
        }

        return response()->json(['success' => true]);
    }

    // Eliminar subtema
    public function destroy($subtemaId)
    {
        try {
            $subtema = Subtema::findOrFail($subtemaId);
            $subtema->delete();

            return response()->json([
                'success' => true,
                'mensaje' => 'Subtema eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Error al eliminar subtema: '.$e->getMessage()
            ], 500);
        }
    }
}
