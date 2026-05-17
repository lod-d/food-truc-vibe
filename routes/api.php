<?php

use App\Http\Controllers\CuisineController;
use App\Http\Controllers\TruckController;
use Illuminate\Support\Facades\Route;

Route::get('/trucks/check-name', [TruckController::class, 'checkName']);
Route::get('/trucks/{id}', [TruckController::class, 'show']);
Route::get('/trucks', [TruckController::class, 'index']);
Route::get('/cuisines', [CuisineController::class, 'index']);
