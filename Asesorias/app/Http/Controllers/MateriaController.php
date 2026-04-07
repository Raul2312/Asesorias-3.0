<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materia;
use Illuminate\Support\Str;

class MateriaController extends Controller
{
    public function index()
    {
        $materias = Materia::all();
        return view('inicio', compact('materias'));
    }

    public function show($codigo)
{
   $materia = Materia::with([
    'unidades.subtemas.contenidos',     // Temario
    'ejeunidades.subtemas.contenidos',  // Ejercicios
    'descripcion'
    ])
    ->where('codigo_materia', $codigo)
    ->first();


    if (!$materia) abort(404, 'Materia no encontrada');

    $usuario_nombre = session('usuario_nombre', 'Invitado');
    $usuario_id = session('usuario_id');
    $usuario_nivel = session('usuario_nivel', 'alumno'); // ⚡ nivel correcto

    // ⚡ Obtener imágenes de la materia
    $imagenes = $materia->imagenes ?? collect(); // si no tiene imágenes, colección vacía

    // ⚡ Asegurar que siempre haya 2 espacios para imágenes (para subir/cambiar)
    if ($imagenes->count() < 2) {
        $faltantes = 2 - $imagenes->count();
        for ($i = 0; $i < $faltantes; $i++) {
            $imagenes->push(null);
        }
    }

    return view('index', compact(
        'materia',
        'usuario_nombre',
        'usuario_id',
        'usuario_nivel',
        'imagenes'
    ));
}

    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
    ]);

    // Tomar las primeras 3 letras del nombre, mayúsculas
    $prefix = strtoupper(substr($request->nombre, 0, 3));

    // Contar cuántas materias existen con ese prefijo
    $count = Materia::where('codigo_materia', 'like', $prefix . '%')->count();

    // Generar el código con el contador +1, con 3 dígitos
    $codigo = $prefix . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

    // Guardar la materia
    $materia = Materia::create([
        'nombre' => $request->nombre,
        'codigo_materia' => $codigo,
        'id_users' => session('usuario_id'), // registrar el docente que la creó
    ]);

    // Respuesta JSON para AJAX
    if ($request->ajax()) {
        return response()->json([
            'success' => true,
            'mensaje' => 'Materia creada correctamente',
            'materia' => $materia
        ]);
    }

    return redirect()->back()->with('success', 'Materia creada correctamente');
}

}

