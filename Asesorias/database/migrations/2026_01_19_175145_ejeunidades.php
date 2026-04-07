<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ejeunidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150); // Ej: "Unidad 1"
            $table->string('titulo', 255)->nullable(); // Ej: "Árboles de Expresión"
            $table->foreignId('id_materia')->constrained('materias')->onDelete('cascade');
            $table->integer('numero_unidad')->default(1); // Si quieres manejar el orden numérico
            $table->integer('orden')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('ejeunidades');
    }
};
