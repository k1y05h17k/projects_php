<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1')->name('login'); // 10 req/min
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:api')->group(function () {
        Route::get('/me',     [AuthController::class, 'me']);
        Route::post('/logout',[AuthController::class, 'logout']);
        Route::post('/refresh',[AuthController::class, 'refresh']);
    });
});

// Acessos de users requer token
Route::middleware('auth:api')->prefix('users')->group(function () {
    Route::get('/',        [UserController::class, 'index']);
    Route::get('/{id}',    [UserController::class, 'show']);
    Route::post('/',       [UserController::class, 'store']);
    Route::put('/{id}',    [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});
