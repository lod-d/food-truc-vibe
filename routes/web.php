<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TruckAdminController;
use App\Http\Controllers\TruckController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/connexion', [AuthController::class, 'login']);
    Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/inscription', [AuthController::class, 'register']);
});
Route::post('/deconnexion', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Truck registration (auth required)
Route::middleware('auth')->group(function () {
    Route::get('/enregistrer', [TruckController::class, 'create'])->name('trucks.create');
    Route::post('/trucks', [TruckController::class, 'store'])->name('trucks.store');
});

// Admin panel (auth required)
Route::middleware('auth')->prefix('mon-truck')->name('admin.')->group(function () {
    Route::get('/', [TruckAdminController::class, 'index'])->name('index');
    Route::post('/{truck}/revendiquer', [TruckAdminController::class, 'claim'])->name('claim');
    Route::get('/{truck}/editer', [TruckAdminController::class, 'edit'])->name('edit');
    Route::put('/{truck}', [TruckAdminController::class, 'update'])->name('update');
    Route::delete('/{truck}', [TruckAdminController::class, 'destroy'])->name('destroy');
});
