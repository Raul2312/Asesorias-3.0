<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ejercicio;

class EjercicioController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'unidadId' => 'required|exists:ejeunidades,id',
            'nombre' => 'required|string|max:150',
            'contenido' => 'nullable|string'
        ]);

        $ejercicio = Ejercicio::create([
            'nombre' => $request->nombre,
            'id_eje_unidad' => $request->unidadId,
            'contenido' => $request->contenido
        ]);

        return response()->json([
            'success' => true,
            'ejercicio' => $ejercicio
        ]);
    }

   public function update(Request $request, $id)
{
    try {

        $ejercicio = Ejercicio::findOrFail($id);

        $request->validate([
            'contenido' => 'nullable|string'
        ]);

        $ejercicio->update([
            'contenido' => $request->contenido
        ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Guardado correctamente'
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'success' => false,
            'mensaje' => $e->getMessage()
        ], 500);
    }
}

    public function destroy($id)
    {
        Ejercicio::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

   public function show($id)
{
    $ejercicio = Ejercicio::findOrFail($id);

    $materia = $ejercicio->unidad->materia; // 🔥 para el aside

    $usuario_nivel = session('usuario_nivel', 'alumno');

    return view('ejercicio.show', compact('ejercicio', 'materia', 'usuario_nivel'));
}
    
}