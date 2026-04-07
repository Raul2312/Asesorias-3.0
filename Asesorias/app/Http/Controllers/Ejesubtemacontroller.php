<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EjeSubtema;
use App\Models\Contenido;

class EjesubtemaController extends Controller
{
    public function show($subtemaId)
    {
        $subtema = EjeSubtema::with(['unidad.materia', 'contenidos'])
            ->findOrFail($subtemaId);

        $usuario_nivel = session('usuario_nivel', 'alumno'); 
        $materia = $subtema->unidad->materia ?? null;

        return view('subtema.show', compact('subtema', 'usuario_nivel', 'materia'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_unidad' => 'required|exists:ejeunidades,id',
            'nombre' => 'required|string|max:150',
        ]);

        $subtema = EjeSubtema::create([
            'id_unidad' => $request->id_unidad,
            'nombre' => $request->nombre,
        ]);

        return response()->json(['success' => true, 'subtema' => $subtema]);
    }

    public function update(Request $request, $subtemaId)
    {
        $subtema = EjeSubtema::findOrFail($subtemaId);
        $subtema->update(['nombre' => $request->nombre]);

        return response()->json(['success' => true]);
    }

    public function destroy($subtemaId)
    {
        EjeSubtema::findOrFail($subtemaId)->delete();
        return response()->json(['success' => true]);
    }
}
