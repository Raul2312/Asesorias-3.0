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
use App\Http\Controllers\TemasController;


/*
|--------------------------------------------------------------------------
| 🔓 RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/

// Autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


// -------------------------------------------------------------------------
// CONSULTAS PÚBLICAS
// -------------------------------------------------------------------------

// Materias
Route::get('/materias', [MateriaController::class, 'index']);
Route::get('/materias/{codigo}', [MateriaController::class, 'show']);
Route::get('/materias/{materia}/imagenes', [ImagenMateriaController::class, 'index']);

// Descripción de materia
Route::get(
    '/descripcion-materia/{id_materia}',
    [DescripcionMateriaController::class, 'show']
);

// Unidades
Route::get(
    '/unidades/materia/{materiaId}',
    [UnidadController::class, 'indexPorMateria']
);

// Temas de una unidad
Route::get(
    '/unidades/{unidadId}/temas',
    [TemasController::class, 'index']
);

// Subtema individual
Route::get(
    '/subtemas/{id}',
    [SubtemaController::class, 'show']
);

// Ejercicios
Route::get(
    '/ejercicios/{id}',
    [EjercicioController::class, 'show']
);


/*
|--------------------------------------------------------------------------
| 🔐 RUTAS AUTENTICADAS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:api'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | 👤 USUARIO / PERFIL
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/perfil', [PerfilController::class, 'index']);

    Route::post('/perfil', [PerfilController::class, 'actualizar']);


    /*
    |--------------------------------------------------------------------------
    | 📚 DESCRIPCIÓN DE MATERIA
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/descripcion-materia',
        [DescripcionMateriaController::class, 'store']
    );


    /*
    |--------------------------------------------------------------------------
    | 🖼️ IMÁGENES DE MATERIAS
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/materias/imagen',
        [ImagenMateriaController::class, 'store']
    );


    /*
    |--------------------------------------------------------------------------
    | 📖 UNIDADES
    |--------------------------------------------------------------------------
    */

    // Crear unidad
    Route::post(
        '/materias/{materia}/unidades',
        [UnidadController::class, 'store']
    );

    // Crear unidad usando ID de materia
    Route::post(
        '/unidades/{materiaId}',
        [UnidadController::class, 'store']
    );

    // Editar unidad
    Route::put(
        '/unidades/{id}',
        [UnidadController::class, 'update']
    );

    // Eliminar unidad
    Route::delete(
        '/unidades/{id}',
        [UnidadController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | 📌 EJES DE UNIDAD
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/materias/{materia}/eje-unidades',
        [EjeUnidadController::class, 'store']
    );

    Route::put(
        '/eje-unidades/{id}',
        [EjeUnidadController::class, 'update']
    );

    Route::delete(
        '/eje-unidades/{id}',
        [EjeUnidadController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | 📝 SUBTEMAS - FUNCIONES GENERALES
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/subtemas/descripcion',
        [SubtemaController::class, 'guardarDescripcion']
    );


    /*
    |--------------------------------------------------------------------------
    | 📐 EJES DE SUBTEMAS
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/eje-subtemas/{id}',
        [EjeSubtemaController::class, 'show']
    );

    Route::post(
        '/eje-subtemas',
        [EjeSubtemaController::class, 'store']
    );

    Route::put(
        '/eje-subtemas/{id}',
        [EjeSubtemaController::class, 'update']
    );

    Route::delete(
        '/eje-subtemas/{id}',
        [EjeSubtemaController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | 🧮 EJERCICIOS
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/ejercicios',
        [EjercicioController::class, 'store']
    );

    Route::put(
        '/ejercicios/{id}',
        [EjercicioController::class, 'update']
    );

    Route::delete(
        '/ejercicios/{id}',
        [EjercicioController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | 👨‍🏫 RUTAS EXCLUSIVAS PARA DOCENTES
    |--------------------------------------------------------------------------
    */

    Route::middleware('rol:docente')->group(function () {

        Route::post(
        '/subtemas/{subtema}/imagen',
        [MultimediaController::class, 'guardarImagen']
        );
        /*
        |--------------------------------------------------------------------------
        | 📚 MATERIAS
        |--------------------------------------------------------------------------
        */

        Route::post(
            '/materias',
            [MateriaController::class, 'store']
        );

        Route::put(
            '/materias/{id}',
            [MateriaController::class, 'update']
        );

        Route::delete(
            '/materias/{id}',
            [MateriaController::class, 'destroy']
        );


        /*
        |--------------------------------------------------------------------------
        | 📌 TEMAS
        |--------------------------------------------------------------------------
        */

        // Crear tema
        Route::post(
            '/temas',
            [TemasController::class, 'store']
        );

        // Editar tema
        Route::put(
            '/temas/{id}',
            [TemasController::class, 'update']
        );

        // Eliminar tema
        Route::delete(
            '/temas/{id}',
            [TemasController::class, 'destroy']
        );


        /*
        |--------------------------------------------------------------------------
        | 📑 SUBTEMAS
        |--------------------------------------------------------------------------
        */

        // Crear subtema
        Route::post(
            '/subtemas',
            [SubtemaController::class, 'store']
        );

        // Editar subtema
        Route::put(
            '/subtemas/{id}',
            [SubtemaController::class, 'update']
        );

        // Eliminar subtema
        Route::delete(
            '/subtemas/{id}',
            [SubtemaController::class, 'destroy']
        );


        /*
        |--------------------------------------------------------------------------
        | 🖼️ MULTIMEDIA DE SUBTEMAS
        |--------------------------------------------------------------------------
        */

        // Subir imagen dentro del contenido de un subtema
        Route::post(
            '/subtemas/{subtema}/imagen',
            [MultimediaController::class, 'guardarImagen']
        );

    });

});