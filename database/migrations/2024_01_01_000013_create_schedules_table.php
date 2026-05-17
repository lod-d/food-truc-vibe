<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('location_id')->constrained('locations')->cascadeOnDelete();
            $table->tinyInteger('day_of_week')->nullable();
            $table->time('opens_at');
            $table->time('closes_at');
            $table->date('specific_date')->nullable();
            $table->boolean('is_recurring')->default(true);
            $table->boolean('is_cancelled')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
