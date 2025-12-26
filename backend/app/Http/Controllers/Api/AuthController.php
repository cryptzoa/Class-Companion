<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new mahasiswa account.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'nim' => 'required|integer|unique:users,nim',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nim' => $validated['nim'],
            'password' => Hash::make($validated['password']),
            'role' => 'mahasiswa',
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan tunggu verifikasi dari Dosen.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'nim' => $user->nim,
                'is_active' => $user->is_active,
            ]
        ], 201);
    }

    /**
     * Login user and return Sanctum token.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'nim' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('nim', $validated['nim'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'nim' => ['NIM atau password salah.'],
            ]);
        }

        // Check if account is active (Gatekeeper)
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun belum diverifikasi oleh Dosen. Silakan tunggu approval.'
            ], 403);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'nim' => $user->nim,
                    'role' => $user->role,
                    'is_active' => $user->is_active,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    /**
     * Get current authenticated user.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'nim' => $user->nim,
                'role' => $user->role,
                'is_active' => $user->is_active,
            ]
        ]);
    }
}
