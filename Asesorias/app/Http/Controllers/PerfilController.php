<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class PerfilController extends Controller
{
    public function index()
    {
        // Verificamos si hay sesión de usuario
        if (!session()->has('usuario_id')) {
            return redirect()->route('login.form');
        }

        $usuario = User::find(session('usuario_id'));

        return view('perfil', compact('usuario'));
    }

    public function actualizar(Request $request)
    {
        if (!session()->has('usuario_id')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'No estás autenticado'
            ]);
        }

        $usuario = User::find(session('usuario_id'));

        $request->validate([
            'nombre' => 'required|string|max:100',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Actualizar nombre
        $usuario->nombre = $request->nombre;

        // Subir foto si existe
        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            $ruta = $foto->store('fotos_perfil', 'public');

            // Borrar foto anterior si existe
            if ($usuario->foto_perfil && Storage::disk('public')->exists($usuario->foto_perfil)) {
                Storage::disk('public')->delete($usuario->foto_perfil);
            }

            $usuario->foto_perfil = $ruta;
        }

        $usuario->save();

        // Actualizar sesión
        // Después de guardar la foto en la DB
session([
    'usuario_nombre' => $usuario->nombre,
    'usuario_foto' => $usuario->foto_perfil ? asset('storage/' . $usuario->foto_perfil) : asset('img/default.jpeg')
]);


        return response()->json([
            'success' => true,
            'mensaje' => 'Perfil actualizado correctamente',
            'foto_perfil_url' => $usuario->foto_perfil ? asset('storage/' . $usuario->foto_perfil) : asset('img/default.jpeg')
        ]);
    }
}
