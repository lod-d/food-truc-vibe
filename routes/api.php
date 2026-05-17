<?php

use App\Http\Controllers\CuisineController;
use App\Http\Controllers\TruckController;
use Illuminate\Support\Facades\Route;

Route::get('/trucks/check-name', [TruckController::class, 'checkName'])->middleware('throttle:30,1');
Route::get('/trucks/{id}', [TruckController::class, 'show']);
Route::get('/trucks', [TruckController::class, 'index'])->middleware('throttle:60,1');
Route::get('/cuisines', [CuisineController::class, 'index']);
