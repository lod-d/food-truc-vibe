<?php

use App\Http\Controllers\CuisineController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TruckController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/enregistrer', [TruckController::class, 'create'])->name('trucks.create');
Route::post('/trucks', [TruckController::class, 'store'])->name('trucks.store');

Route::prefix('api')->group(function () {
    Route::get('/trucks', [TruckController::class, 'index']);
    Route::get('/trucks/{id}', [TruckController::class, 'show']);
    Route::get('/cuisines', [CuisineController::class, 'index']);
});
