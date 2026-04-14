<?php

namespace App\Http\Controllers;

use App\Models\Subtema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubtemaController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate(['nombre' => 'required', 'tema_id' => 'required']);

        $subtema = Subtema::create([
            'nombre'      => $request->nombre,
            'descripcion' => $request->descripcion,
            'tema_id'     => $request->tema_id,
            'contenido'   => [] // Inicia como un array vacío (JSON)
        ]);

        return response()->json(['success' => true, 'data' => $subtema], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $subtema = Subtema::findOrFail($id);
        
        // Esto permite actualizar nombre/desc o el contenido (JSON) del editor
        $subtema->update($request->all());

        return response()->json(['success' => true, 'data' => $subtema]);
    }

    public function destroy($id): JsonResponse
    {
        Subtema::destroy($id);
        return response()->json(['success' => true]);
    }
}