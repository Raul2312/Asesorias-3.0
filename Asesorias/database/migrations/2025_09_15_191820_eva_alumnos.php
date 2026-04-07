<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('evaluaciones_alumnos', function (Blueprint $table) {
            $table->id();
            $table->decimal('calificacion', 5, 2)->nullable();
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_evaluacion')->constrained('evaluaciones')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('evaluaciones_alumnos');
    }
};
