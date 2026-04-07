<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\UnidadController;
use App\Http\Controllers\EjeUnidadController;
use App\Http\Controllers\SubtemaController;
use App\Http\Controllers\DescripcionMateriaController;
use App\Http\Controllers\ImagenMateriaController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\EjercicioController;

/*
|--------------------------------------------------------------------------
| Rutas principales
|--------------------------------------------------------------------------
*/

// Inicio → login
Route::get('/', function () {
    return redirect()->route('login.form');
});

// Login / Registro
Route::get('/Login', fn() => view('login'))->name('login.form');
Route::post('/Login', [AuthController::class, 'login'])->name('login');
Route::post('/Register', [AuthController::class, 'register'])->name('register');
Route::get('/Logout', [AuthController::class, 'logout'])->name('logout');

// Dashboard
Route::get('/Inicio', [MateriaController::class, 'index'])->name('Inicio');


/*
|--------------------------------------------------------------------------
| Materias
|--------------------------------------------------------------------------
*/
Route::post('/materias', [MateriaController::class, 'store'])->name('materias.store');
Route::get('/materia/{codigo}', [MateriaController::class, 'show'])->name('materia.show');


/*
|--------------------------------------------------------------------------
| Unidades
|--------------------------------------------------------------------------
*/
Route::post('/materia/{materia}/unidad', [UnidadController::class, 'store'])->name('unidad.store');
Route::put('/unidad/{unidad}', [UnidadController::class, 'update'])->name('unidad.update');
Route::delete('/unidad/{unidad}', [UnidadController::class, 'destroy'])->name('unidad.destroy');


/*
|--------------------------------------------------------------------------
| Ejes de unidad (si los usas)
|--------------------------------------------------------------------------
*/
Route::post('/materia/{materia}/ejeunidad', [EjeUnidadController::class, 'store'])->name('ejeunidad.store');


/*
|--------------------------------------------------------------------------
| Subtemas
|--------------------------------------------------------------------------
*/
Route::post('/subtemas', [SubtemaController::class, 'store'])->name('subtemas.store');
Route::put('/subtemas/{subtema}', [SubtemaController::class,'update'])->name('subtemas.update');
Route::delete('/subtemas/{subtema}', [SubtemaController::class, 'destroy'])->name('subtemas.destroy');
Route::get('/subtema/{subtema}', [SubtemaController::class, 'show'])->name('subtemas.show');

// Descripción de subtema
Route::post('/subtema/descripcion', [SubtemaController::class, 'guardarDescripcion'])
    ->name('subtemas.descripcion.store');


/*
|--------------------------------------------------------------------------
| Descripción de materias
|--------------------------------------------------------------------------
*/
Route::post('/descripcion-materia', [DescripcionMateriaController::class, 'store'])->name('descripcion.store');
Route::get('/descripcion-materia/{materia}', [DescripcionMateriaController::class, 'show'])->name('descripcion.show');


/*
|--------------------------------------------------------------------------
| Imágenes
|--------------------------------------------------------------------------
*/
Route::post('/materia/imagen', [ImagenMateriaController::class, 'store'])->name('imagen.store');
Route::get('/materia/imagenes/{materia}', [ImagenMateriaController::class, 'index'])->name('imagen.index');


/*
|--------------------------------------------------------------------------
| Chatbot
|--------------------------------------------------------------------------
*/
Route::post('/chatbot/message', [ChatbotController::class, 'handleMessage'])->name('chatbot.message');


/*
|--------------------------------------------------------------------------
| Perfil
|--------------------------------------------------------------------------
*/
Route::get('/perfil', [PerfilController::class, 'index'])->name('perfil');
Route::post('/perfil/actualizar', [PerfilController::class, 'actualizar'])->name('perfil.actualizar');


/*
|--------------------------------------------------------------------------
| Ejercicios (si los usas)
|--------------------------------------------------------------------------
*/
Route::post('/ejercicios', [EjercicioController::class, 'store']);
Route::put('/ejercicios/{ejercicio}', [EjercicioController::class, 'update']);
Route::delete('/ejercicios/{ejercicio}', [EjercicioController::class, 'destroy']);

Route::post('/materia/{materia}/eje-unidad', [EjeUnidadController::class, 'store']);
Route::put('/eje-unidad/{id}', [EjeUnidadController::class, 'update']);
Route::delete('/eje-unidad/{id}', [EjeUnidadController::class, 'destroy']);
Route::get('/ejercicio/{id}', [EjercicioController::class, 'show']);