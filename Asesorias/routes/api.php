<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\UnidadController;
use App\Http\Controllers\EjeUnidadController;
use App\Http\Controllers\SubtemaController;
use App\Http\Controllers\EjeSubtemaController;
use App\Http\Controllers\DescripcionMateriaController;
use App\Http\Controllers\ImagenMateriaController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\EjercicioController;
use App\Http\Controllers\MultimediaController;
use App\Http\Controllers\TemasController; // Importación correcta

/*
|--------------------------------------------------------------------------
| 🔓 RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/materias', [MateriaController::class, 'index']);
Route::get('/materias/{codigo}', [MateriaController::class, 'show']);
Route::get('/subtemas/{id}', [SubtemaController::class, 'show']);
Route::get('/ejercicios/{id}', [EjercicioController::class, 'show']);
Route::get('/materias/{materia}/imagenes', [ImagenMateriaController::class, 'index']);

// --- CORRECCIÓN RUTAS DE TEMAS ---
// Cambiamos {unidad} por {unidadId} para que coincida con tu controlador
Route::get('/unidades/{unidadId}/temas', [TemasController::class, 'index']); 
Route::post('/temas', [TemasController::class, 'store']);
Route::put('/temas/{id}', [TemasController::class, 'update']);
Route::delete('/temas/{id}', [TemasController::class, 'destroy']);

// --- CORRECCIÓN RUTAS DE SUBTEMAS ---
// Usamos {id} para que el controlador lo reciba correctamente
Route::post('/subtemas', [SubtemaController::class, 'store']);
Route::put('/subtemas/{id}', [SubtemaController::class, 'update']);
Route::delete('/subtemas/{id}', [SubtemaController::class, 'destroy']);

Route::get('/descripcion-materia/{id_materia}', [DescripcionMateriaController::class, 'show']);
Route::post('/descripcion-materia', [DescripcionMateriaController::class, 'store']);

Route::get('/unidades/materia/{materiaId}', [UnidadController::class, 'indexPorMateria']);
Route::put('/unidades/{id}', [UnidadController::class, 'update']);
Route::delete('/unidades/{id}', [UnidadController::class, 'destroy']);
Route::post('/unidades/{materiaId}', [UnidadController::class, 'store']);

/*
|--------------------------------------------------------------------------
| 🔐 RUTAS PROTEGIDAS (JWT)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:api'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [PerfilController::class, 'index']);
    Route::post('/perfil', [PerfilController::class, 'actualizar']);

    Route::post('/descripcion-materia', [DescripcionMateriaController::class, 'store']);
    Route::post('/materias/imagen', [ImagenMateriaController::class, 'store']);

    Route::post('/subtemas/descripcion', [SubtemaController::class, 'guardarDescripcion']);

    Route::get('/eje-subtemas/{id}', [EjeSubtemaController::class, 'show']);
    Route::post('/eje-subtemas', [EjeSubtemaController::class, 'store']);
    Route::put('/eje-subtemas/{id}', [EjeSubtemaController::class, 'update']);
    Route::delete('/eje-subtemas/{id}', [EjeSubtemaController::class, 'destroy']);

    Route::post('/materias/{materia}/unidades', [UnidadController::class, 'store']);
    
    Route::post('/materias/{materia}/eje-unidades', [EjeUnidadController::class, 'store']);
    Route::put('/eje-unidades/{id}', [EjeUnidadController::class, 'update']);
    Route::delete('/eje-unidades/{id}', [EjeUnidadController::class, 'destroy']);

    Route::post('/ejercicios', [EjercicioController::class, 'store']);
    Route::put('/ejercicios/{id}', [EjercicioController::class, 'update']);
    Route::delete('/ejercicios/{id}', [EjercicioController::class, 'destroy']);
    
    Route::post('/subtemas/{subtema}/imagen', [MultimediaController::class, 'guardarImagen']);

    Route::middleware('rol:docente')->group(function () {
        Route::post('/materias', [MateriaController::class, 'store']);
        Route::put('/materias/{id}', [MateriaController::class, 'update']);
        Route::delete('/materias/{id}', [MateriaController::class, 'destroy']);
    });
});