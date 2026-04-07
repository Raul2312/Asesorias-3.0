<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RolMiddleware
{
    public function handle(Request $request, Closure $next, $rol)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado'
            ], 401);
        }

        if ($user->nivel !== $rol) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos'
            ], 403);
        }

        return $next($request);
    }
}