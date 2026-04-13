<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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
        $userId = $user ? $user->id : $request->id_users;

        $request->validate([
            'nombre'   => 'required|string|max:255',
            'cat'      => 'nullable|string',
            'sem'      => 'nullable|integer',
            'iconName' => 'nullable|string',
        ]);

        $prefix = strtoupper(substr($request->nombre, 0, 3));
        $count = Materia::where('codigo_materia', 'like', $prefix . '%')->count();
        $codigo = $prefix . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        $materia = Materia::create([
            'nombre'         => $request->nombre,
            'codigo_materia' => $codigo,
            'id_users'       => $userId,
            'cat'            => $request->cat ?? 'programacion',
            'sem'            => $request->sem ?? 1,
            'iconName'       => $request->iconName ?? 'code-2',
            'estatus'        => 1
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materia creada correctamente',
            'data' => $materia
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR MATERIA (CON VALIDACIÓN DE DUEÑO)
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json(['success' => false, 'message' => 'Materia no encontrada'], 404);
        }

        // Validar que el usuario sea el creador
        $userId = auth()->user() ? auth()->user()->id : $request->id_users;
        if ($materia->id_users != $userId) {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para editar esta materia.'], 403);
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
    | ELIMINAR MATERIA (CON VALIDACIÓN DE DUEÑO)
    |--------------------------------------------------------------------------
    */
    public function destroy(Request $request, $id)
    {
        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json(['success' => false, 'message' => 'Materia no encontrada'], 404);
        }

        // Validar que el usuario sea el creador
        $userId = auth()->user() ? auth()->user()->id : $request->id_users;
        if ($materia->id_users != $userId) {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para eliminar esta materia.'], 403);
        }

        $materia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materia eliminada'
        ]);
    }
}