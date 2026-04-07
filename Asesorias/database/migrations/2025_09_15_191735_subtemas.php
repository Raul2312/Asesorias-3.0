<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('subtemas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150);
            $table->foreignId('id_unidad')->constrained('unidades')->onDelete('cascade');
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('subtemas');
    }
};
