<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('evaluaciones', function (Blueprint $table) {
            $table->id();
            $table->string('url', 255)->nullable();
            $table->string('nombre', 150);
            $table->foreignId('id_grupo')->constrained('grupos')->onDelete('cascade');
            $table->foreignId('id_unidad')->constrained('unidades')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('evaluaciones');
    }
};
