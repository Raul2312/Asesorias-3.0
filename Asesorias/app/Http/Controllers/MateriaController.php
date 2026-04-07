<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materia;

class MateriaController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LISTAR MATERIAS
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        $materias = Materia::all();

        return response()->json([
            'success' => true,
            'data' => $materias
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MOSTRAR MATERIA COMPLETA
    |--------------------------------------------------------------------------
    */
    public function show($codigo)
    {
        $materia = Materia::with([
            'unidades.subtemas.contenidos',
            'ejeunidades.subtemas.contenidos',
            'descripcion',
            'imagenes'
        ])
        ->where('codigo_materia', $codigo)
        ->first();

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada'
            ], 404);
        }

        // 🔥 Manejo de imágenes (igual que tu lógica)
        $imagenes = $materia->imagenes ?? collect();

        if ($imagenes->count() < 2) {
            $faltantes = 2 - $imagenes->count();
            for ($i = 0; $i < $faltantes; $i++) {
                $imagenes->push(null);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'materia' => $materia,
                'imagenes' => $imagenes
            ]
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR MATERIA (DOCENTE)
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->nivel !== 'docente') {
            return response()->json([
                'success' => false,
                'message' => 'Solo docentes pueden crear materias'
            ], 403);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        // 🔥 generar código automático
        $prefix = strtoupper(substr($request->nombre, 0, 3));

        $count = Materia::where('codigo_materia', 'like', $prefix . '%')->count();

        $codigo = $prefix . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        $materia = Materia::create([
            'nombre' => $request->nombre,
            'codigo_materia' => $codigo,
            'id_users' => $user->id // 🔥 ya no session
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materia creada correctamente',
            'data' => $materia
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR MATERIA
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada'
            ], 404);
        }

        $materia->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Materia actualizada',
            'data' => $materia
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR MATERIA
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json([
                'success' => false,
                'message' => 'Materia no encontrada'
            ], 404);
        }

        $materia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materia eliminada'
        ]);
    }
}