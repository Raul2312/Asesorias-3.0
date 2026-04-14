<?php

namespace App\Http\Controllers;

use App\Models\Tema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TemasController extends Controller
{
    public function index($unidadId): JsonResponse
    {
        // Cargamos temas y sus subtemas usando Eager Loading
        $temas = Tema::where('unidad_id', $unidadId)
                    ->with('subtemas')
                    ->orderBy('orden', 'asc')
                    ->get();

        return response()->json([
            'success' => true,
            'data'    => $temas
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['nombre' => 'required|string', 'unidad_id' => 'required']);
        
        $tema = Tema::create([
            'nombre'    => $request->nombre,
            'unidad_id' => $request->unidad_id
        ]);

        return response()->json(['success' => true, 'data' => $tema], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $tema = Tema::findOrFail($id);
        $tema->update($request->only('nombre'));
        return response()->json(['success' => true, 'data' => $tema]);
    }

    public function destroy($id): JsonResponse
    {
        Tema::destroy($id);
        return response()->json(['success' => true]);
    }
}