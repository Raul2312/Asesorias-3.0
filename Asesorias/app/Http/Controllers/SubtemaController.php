<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subtema;
use App\Models\Contenido;

class SubtemaController extends Controller
{
    public function show($id)
    {
        $subtema = Subtema::with(['unidad.materia', 'contenidos'])->find($id);

        if (!$subtema) {
            return response()->json([
                'success' => false,
                'message' => 'Subtema no encontrado'
            ], 404);
        }

        // 🔥 crear contenido automático si es docente
        if ($subtema->contenidos()->count() === 0 && auth()->user()->nivel === 'docente') {
            Contenido::create([
                'id_subtema' => $subtema->id,
                'id_user' => auth()->id(),
                'titulo' => 'Descripción',
                'contenido' => ''
            ]);

            $subtema->load('contenidos');
        }

        return response()->json([
            'success' => true,
            'data' => $subtema
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->nivel !== 'docente') {
            return response()->json(['success'=>false,'message'=>'No autorizado'],403);
        }

        $request->validate([
            'id_unidad' => 'required|exists:unidades,id',
            'nombre' => 'required|string|max:150',
        ]);

        $subtema = Subtema::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $subtema
        ], 201);
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->nivel !== 'docente') {
            return response()->json(['success'=>false,'message'=>'No autorizado'],403);
        }

        $subtema = Subtema::find($id);

        if (!$subtema) {
            return response()->json([
                'success'=>false,
                'message'=>'Subtema no encontrado'
            ],404);
        }

        $subtema->update($request->only('nombre'));

        return response()->json([
            'success' => true,
            'data' => $subtema
        ]);
    }

    public function guardarDescripcion(Request $request)
    {
        if (auth()->user()->nivel !== 'docente') {
            return response()->json(['success'=>false,'message'=>'No autorizado'],403);
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
                'id_user' => auth()->id()
            ]);
        } else {
            Contenido::create([
                'id_subtema' => $subtema->id,
                'id_user' => auth()->id(),
                'titulo' => 'Descripción',
                'contenido' => $request->descripcion
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Descripción guardada'
        ]);
    }

    public function destroy($id)
    {
        $subtema = Subtema::find($id);

        if (!$subtema) {
            return response()->json([
                'success'=>false,
                'message'=>'Subtema no encontrado'
            ],404);
        }

        $subtema->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subtema eliminado'
        ]);
    }
}