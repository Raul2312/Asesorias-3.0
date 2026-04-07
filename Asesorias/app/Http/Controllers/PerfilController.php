<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PerfilController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => auth()->user()
        ]);
    }

    public function actualizar(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'nombre' => 'required|string|max:100',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user->nombre = $request->nombre;

        if ($request->hasFile('foto')) {
            $ruta = $request->file('foto')->store('fotos_perfil', 'public');

            if ($user->foto_perfil && Storage::disk('public')->exists($user->foto_perfil)) {
                Storage::disk('public')->delete($user->foto_perfil);
            }

            $user->foto_perfil = $ruta;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado',
            'data' => [
                'nombre' => $user->nombre,
                'foto' => $user->foto_perfil
                    ? asset('storage/'.$user->foto_perfil)
                    : asset('img/default.jpeg')
            ]
        ]);
    }
}