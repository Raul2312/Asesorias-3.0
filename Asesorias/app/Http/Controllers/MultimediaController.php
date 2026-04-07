<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subtema;
use App\Models\Multimedia;

class MultimediaController extends Controller
{
    public function guardarImagen(Request $request, Subtema $subtema)
    {
        $request->validate([
            'imagen' => 'required|image|max:2048',
        ]);

        $contenido = $subtema->contenidos()->first();

        $path = $request->file('imagen')->store('uploads/subtemas', 'public');

        $multimedia = Multimedia::create([
            'nombre' => $request->file('imagen')->getClientOriginalName(),
            'ruta' => 'storage/' . $path,
            'tipo' => 'imagen',
            'tamano' => $request->file('imagen')->getSize(),
            'id_contenido' => $contenido->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $multimedia
        ]);
    }
}