<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\EsewaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Service API Routes
Route::apiResource('services', ServiceController::class);

// Category API Routes
Route::apiResource('categories', CategoryController::class);

// Trainer API Routes
Route::apiResource('trainers', TrainerController::class);

// Product API Routes
Route::apiResource('products', ProductController::class);

// Cart API Routes (Protected - requires authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart-clear', [CartController::class, 'clear']);

    // Order API Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);



    Route::post('/esewa/pay', [EsewaController::class, 'pay']);
    Route::get('/esewa/success', [EsewaController::class, 'success']);
    Route::get('/esewa/failure', [EsewaController::class, 'failure']);


    // Admin Order Routes
    Route::get('/admin/orders', [OrderController::class, 'getAllOrders']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Contact Messages Routes
    Route::post('/contact-messages', [ContactMessageController::class, 'store']);
});

// Admin Contact Messages Routes (Protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/{id}', [ContactMessageController::class, 'show']);
    Route::put('/contact-messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
    Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);
});

