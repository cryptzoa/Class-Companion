<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * Get all published materials for mahasiswa.
     */
    public function materials(Request $request)
    {
        $limit = $request->query('limit', 10);
        
        $materials = Material::published()
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get()
            ->map(function ($material) {
                // Determine file type
                $type = 'link';
                if ($material->file_path) {
                    $extension = pathinfo($material->file_path, PATHINFO_EXTENSION);
                    if (in_array(strtolower($extension), ['pdf'])) {
                        $type = 'pdf';
                    } elseif (in_array(strtolower($extension), ['ppt', 'pptx'])) {
                        $type = 'ppt';
                    } elseif (in_array(strtolower($extension), ['mp4', 'mkv', 'webm'])) {
                        $type = 'video';
                    } else {
                        $type = 'other';
                    }
                } elseif ($material->link) {
                    // Check for video links
                    if (str_contains($material->link, 'youtube.com') || str_contains($material->link, 'youtu.be')) {
                        $type = 'video';
                    }
                }

                return [
                    'id' => $material->id,
                    'title' => $material->title,
                    'description' => $material->description,
                    'file_url' => $material->file_path ? asset('storage/' . $material->file_path) : null,
                    'link' => $material->link,
                    'created_at' => $material->created_at->format('Y-m-d H:i:s'),
                    'file_type' => $type,
                    // 'session_title' => ... (Skipping complex relation for now to prioritize stability)
                ];
            });

        return response()->json([
            'data' => $materials
        ]);
    }

    /**
     * Get all attendance sessions.
     */
    public function sessions(Request $request)
    {
        $limit = $request->query('limit', 10);

        $sessions = AttendanceSession::with('material')
            ->orderBy('session_date', 'desc')
            ->take($limit)
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'week_name' => $session->week_name,
                    'session_date' => $session->session_date->format('Y-m-d'),
                    'material' => $session->material ? [
                        'id' => $session->material->id,
                        'title' => $session->material->title,
                        'file_url' => $session->material->file_path ? asset('storage/' . $session->material->file_path) : null,
                        'link' => $session->material->link,
                    ] : null,
                    'attendance_open' => $session->isAttendanceOpen(),
                    'remaining_minutes' => $session->remaining_minutes,
                ];
            });

        return response()->json([
            'data' => $sessions
        ]);
    }

    /**
     * Get a single session detail.
     */
    public function show(AttendanceSession $session)
    {
        return response()->json([
            'data' => [
                'id' => $session->id,
                'week_name' => $session->week_name,
                'session_date' => $session->session_date->format('Y-m-d'),
                'material' => $session->material ? [
                    'id' => $session->material->id,
                    'title' => $session->material->title,
                    'description' => $session->material->description,
                    'file_url' => $session->material->file_path ? asset('storage/' . $session->material->file_path) : null,
                    'link' => $session->material->link,
                ] : null,
                'attendance_open' => $session->isAttendanceOpen(),
                'remaining_minutes' => $session->remaining_minutes,
            ]
        ]);
    }
}
