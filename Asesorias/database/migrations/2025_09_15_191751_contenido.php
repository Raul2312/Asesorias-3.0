<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contenido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_subtema')->constrained('subtemas')->onDelete('cascade');
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->string('titulo', 200);
            $table->longText('contenido');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('contenido');
    }
};
