<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     * Ensure the authenticated user has been approved by Dosen.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->is_active) {
            return response()->json([
                'message' => 'Akun belum diverifikasi oleh Dosen'
            ], 403);
        }

        return $next($request);
    }
}
