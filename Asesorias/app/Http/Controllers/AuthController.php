<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | REGISTRO
    |--------------------------------------------------------------------------
    */
    public function register(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'ap_paterno' => 'required|string|max:100',
            'ap_materno' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'nivel' => 'required|in:alumno,docente',
        ]);

        // 🔐 PIN docente
        $PIN_DOCENTE = env('DOCENTE_PIN', 'ITSNCG2026');

        if ($request->nivel === 'docente' && $request->pin_docente !== $PIN_DOCENTE) {
            return response()->json([
                'success' => false,
                'message' => 'PIN de docente incorrecto'
            ], 403);
        }

        $user = User::create([
            'nombre' => $request->nombre,
            'ap_paterno' => $request->ap_paterno,
            'ap_materno' => $request->ap_materno,
            'email' => $request->email,
            'nivel' => $request->nivel,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado correctamente',
            'data' => $user
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $credentials = $request->only('email', 'password');

        try {

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales inválidas'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Login exitoso',
                'data' => [
                    'token' => $token,
                    'user' => auth()->user()
                ]
            ]);

        } catch (JWTException $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al generar el token'
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | USUARIO ACTUAL
    |--------------------------------------------------------------------------
    */
    public function me()
    {
        return response()->json([
            'success' => true,
            'data' => auth()->user()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada correctamente'
            ]);

        } catch (JWTException $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión'
            ], 500);
        }
    }
}