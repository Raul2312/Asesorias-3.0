<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('temas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Nombre del tema específico
            $table->text('contenido')->nullable(); // Aquí puedes guardar texto o JSON
            $table->integer('orden')->default(1); // Para organizar la secuencia
            
            // Relación con Unidades
            $table->foreignId('unidad_id')
                  ->constrained('unidades')
                  ->onDelete('cascade'); // Si borras la unidad, se borran sus temas
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('temas');
    }
};