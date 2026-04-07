<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('grupos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_materia')->constrained('materias')->onDelete('cascade');
            $table->foreignId('id_users')->constrained('users')->onDelete('cascade');
            $table->string('nombre', 100);
            $table->boolean('estatus')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('grupos');
    }
};
