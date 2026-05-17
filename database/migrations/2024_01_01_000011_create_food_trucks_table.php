<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('food_trucks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cuisine_id')->constrained('cuisines')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('photo_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_trucks');
    }
};
