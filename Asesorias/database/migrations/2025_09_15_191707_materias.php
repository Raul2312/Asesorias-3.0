<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_users')->constrained('users')->onDelete('cascade');
            $table->string('codigo_materia', 50)->unique();
            $table->string('nombre', 150);
            $table->boolean('estatus')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('materias');
    }
};
