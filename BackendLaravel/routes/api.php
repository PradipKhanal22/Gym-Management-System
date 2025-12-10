<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Service API Routes
Route::apiResource('services', ServiceController::class);

// Category API Routes
Route::apiResource('categories', CategoryController::class);

// Trainer API Routes
Route::apiResource('trainers', TrainerController::class);

// Product API Routes
Route::apiResource('products', ProductController::class);
