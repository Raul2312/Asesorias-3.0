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

/*
|--------------------------------------------------------------------------
| 🔓 RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Materias
Route::get('/materias', [MateriaController::class, 'index']);
Route::get('/materias/{codigo}', [MateriaController::class, 'show']);

// Subtemas (ver contenido)
Route::get('/subtemas/{id}', [SubtemaController::class, 'show']);

// Ejercicios
Route::get('/ejercicios/{id}', [EjercicioController::class, 'show']);

// Imágenes de materia
Route::get('/materias/{materia}/imagenes', [ImagenMateriaController::class, 'index']);


/*
|--------------------------------------------------------------------------
| 🔐 RUTAS PROTEGIDAS (JWT)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:api'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | 👤 Usuario
    |--------------------------------------------------------------------------
    */
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | 👤 Perfil
    |--------------------------------------------------------------------------
    */
    Route::get('/perfil', [PerfilController::class, 'index']);
    Route::post('/perfil', [PerfilController::class, 'actualizar']);

    /*
    |--------------------------------------------------------------------------
    | 📚 Descripción de materia
    |--------------------------------------------------------------------------
    */
    Route::post('/descripcion-materia', [DescripcionMateriaController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | 🖼️ Imágenes de materia
    |--------------------------------------------------------------------------
    */
    Route::post('/materias/imagen', [ImagenMateriaController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | 📘 Subtemas
    |--------------------------------------------------------------------------
    */
    Route::post('/subtemas', [SubtemaController::class, 'store']);
    Route::put('/subtemas/{id}', [SubtemaController::class, 'update']);
    Route::delete('/subtemas/{id}', [SubtemaController::class, 'destroy']);
    Route::post('/subtemas/descripcion', [SubtemaController::class, 'guardarDescripcion']);

    /*
    |--------------------------------------------------------------------------
    | 📘 Eje Subtemas
    |--------------------------------------------------------------------------
    */
    Route::get('/eje-subtemas/{id}', [EjeSubtemaController::class, 'show']);
    Route::post('/eje-subtemas', [EjeSubtemaController::class, 'store']);
    Route::put('/eje-subtemas/{id}', [EjeSubtemaController::class, 'update']);
    Route::delete('/eje-subtemas/{id}', [EjeSubtemaController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 📊 Unidades
    |--------------------------------------------------------------------------
    */
    Route::post('/materias/{materia}/unidades', [UnidadController::class, 'store']);
    Route::put('/unidades/{id}', [UnidadController::class, 'update']);
    Route::delete('/unidades/{id}', [UnidadController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 📊 Eje Unidades
    |--------------------------------------------------------------------------
    */
    Route::post('/materias/{materia}/eje-unidades', [EjeUnidadController::class, 'store']);
    Route::put('/eje-unidades/{id}', [EjeUnidadController::class, 'update']);
    Route::delete('/eje-unidades/{id}', [EjeUnidadController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 🧠 Ejercicios
    |--------------------------------------------------------------------------
    */
    Route::post('/ejercicios', [EjercicioController::class, 'store']);
    Route::put('/ejercicios/{id}', [EjercicioController::class, 'update']);
    Route::delete('/ejercicios/{id}', [EjercicioController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | 🖼️ Multimedia (subtemas)
    |--------------------------------------------------------------------------
    */
    Route::post('/subtemas/{subtema}/imagen', [MultimediaController::class, 'guardarImagen']);


    /*
    |--------------------------------------------------------------------------
    | 🔒 SOLO DOCENTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('rol:docente')->group(function () {

        // Materias
        Route::post('/materias', [MateriaController::class, 'store']);
        Route::put('/materias/{id}', [MateriaController::class, 'update']);
        Route::delete('/materias/{id}', [MateriaController::class, 'destroy']);

    });
});