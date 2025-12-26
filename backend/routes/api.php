<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\AttendanceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no auth required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [App\Http\Controllers\Api\PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [App\Http\Controllers\Api\PasswordResetController::class, 'reset']);

// Protected routes (requires authentication + active account)
Route::middleware(['auth:sanctum', 'user.active'])->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Materials
    Route::get('/materials', [SessionController::class, 'materials']);

    // Attendance Sessions
    Route::get('/sessions', [SessionController::class, 'sessions']);
    Route::get('/sessions/{session}', [SessionController::class, 'show']);

    // Attendance
    Route::post('/sessions/{session}/attend', [AttendanceController::class, 'attend']);
    Route::get('/my-attendances', [AttendanceController::class, 'myAttendances']);
    Route::get('/attendance-settings', [AttendanceController::class, 'settings']);
});
