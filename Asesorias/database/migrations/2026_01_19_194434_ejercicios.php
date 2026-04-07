<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ejercicios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150); // Nombre del ejercicio
            $table->foreignId('id_eje_unidad')->constrained('ejeunidades')->onDelete('cascade');
            $table->text('contenido')->nullable(); // Aquí puedes poner la descripción, enunciado o contenido del ejercicio
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('ejercicios');
    }
};
