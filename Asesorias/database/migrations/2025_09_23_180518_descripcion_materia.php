<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('descripcion_materia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_materia')
                  ->constrained('materias')
                  ->onDelete('cascade');
            $table->foreignId('id_user')
                  ->constrained('users')
                  ->onDelete('cascade'); // docente que creó la descripción
            $table->longText('descripcion')->nullable(); // contenido editable WYSIWYG
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('descripcion_materia');
    }
};
