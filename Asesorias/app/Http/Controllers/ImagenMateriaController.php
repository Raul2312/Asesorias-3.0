<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImagenMateria;

class ImagenMateriaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_materia' => 'required|integer',
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'index' => 'required|integer|min:0|max:1' // solo 2 imágenes
        ]);

        $archivo = $request->file('imagen');
        $nombreArchivo = time().'_'.$archivo->getClientOriginalName();
        $ruta = $archivo->move(public_path('img/materias'), $nombreArchivo);

        $index = $request->index;

        // Buscar si ya hay imagen en esa posición
        $imagenExistente = ImagenMateria::where('id_materia', $request->id_materia)
            ->orderBy('id', 'asc')
            ->skip($index)
            ->first();

        if ($imagenExistente) {
            // Reemplazar
            $imagenExistente->ruta = 'img/materias/'.$nombreArchivo;
            $imagenExistente->save();
            $imagen = $imagenExistente;
        } else {
            // Crear nueva
            $imagen = ImagenMateria::create([
                'id_materia' => $request->id_materia,
                'ruta' => 'img/materias/'.$nombreArchivo,
                'id_user' => session('usuario_id')
            ]);
        }

        return response()->json([
            'success' => true,
            'mensaje' => 'Imagen guardada correctamente',
            'imagen' => $imagen
        ]);
    }

    public function index($materia)
    {
        return ImagenMateria::where('id_materia', $materia)
            ->orderBy('id', 'asc')
            ->take(2) // solo 2
            ->get();
    }
}
