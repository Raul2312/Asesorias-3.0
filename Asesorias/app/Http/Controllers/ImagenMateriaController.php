<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImagenMateria;

class ImagenMateriaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_materia' => 'required|integer|exists:materias,id',
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'index' => 'required|integer|min:0|max:1'
        ]);

        $archivo = $request->file('imagen');
        $nombreArchivo = time().'_'.$archivo->getClientOriginalName();
        $archivo->move(public_path('img/materias'), $nombreArchivo);

        $imagenExistente = ImagenMateria::where('id_materia', $request->id_materia)
            ->orderBy('id', 'asc')
            ->skip($request->index)
            ->first();

        if ($imagenExistente) {
            $imagenExistente->update([
                'ruta' => 'img/materias/'.$nombreArchivo
            ]);
            $imagen = $imagenExistente;
        } else {
            $imagen = ImagenMateria::create([
                'id_materia' => $request->id_materia,
                'ruta' => 'img/materias/'.$nombreArchivo,
                'id_user' => auth()->id()
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $imagen
        ]);
    }

    public function index($materia)
    {
        $imagenes = ImagenMateria::where('id_materia', $materia)
            ->orderBy('id', 'asc')
            ->take(2)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $imagenes
        ]);
    }
}