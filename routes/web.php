<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TruckAdminController;
use App\Http\Controllers\TruckController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Auth
Route::middleware(['guest', 'throttle:5,1'])->group(function () {
    Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/connexion', [AuthController::class, 'login']);
    Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/inscription', [AuthController::class, 'register']);
});
Route::post('/deconnexion', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Email verification
Route::middleware('auth')->group(function () {
    Route::get('/email/verify', fn() => inertia('Auth/VerifyEmail'))->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return redirect()->route('home')->with('success', 'Email vérifié avec succès !');
    })->middleware('signed')->name('verification.verify');
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return back()->with('success', 'Lien de vérification renvoyé.');
    })->middleware('throttle:6,1')->name('verification.send');
});

// Truck registration (auth + verified required)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/enregistrer', [TruckController::class, 'create'])->name('trucks.create');
    Route::post('/trucks', [TruckController::class, 'store'])->name('trucks.store');
});

// Admin panel (auth + verified required)
Route::middleware(['auth', 'verified'])->prefix('mon-truck')->name('admin.')->group(function () {
    Route::get('/', [TruckAdminController::class, 'index'])->name('index');
    Route::post('/{truck}/revendiquer', [TruckAdminController::class, 'claim'])->name('claim');
    Route::get('/{truck}/editer', [TruckAdminController::class, 'edit'])->name('edit');
    Route::put('/{truck}', [TruckAdminController::class, 'update'])->name('update');
    Route::delete('/{truck}', [TruckAdminController::class, 'destroy'])->name('destroy');
});
