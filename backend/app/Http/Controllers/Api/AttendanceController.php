<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\Setting;
use App\Services\ReverseGeocodingService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected ReverseGeocodingService $geocodingService;

    public function __construct(ReverseGeocodingService $geocodingService)
    {
        $this->geocodingService = $geocodingService;
    }

    /**
     * Submit attendance for a session.
     */
    public function attend(Request $request, AttendanceSession $session)
    {
        $user = $request->user();

        // Check if already attended
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->where('attendance_session_id', $session->id)
            ->first();

        if ($existingAttendance) {
            return response()->json([
                'message' => 'Anda sudah melakukan absensi untuk sesi ini'
            ], 400);
        }

        // Check if attendance is open (15-minute window)
        if (!$session->isAttendanceOpen()) {
            if (!$session->attendance_open_at) {
                return response()->json([
                    'message' => 'Absensi belum dibuka oleh Dosen'
                ], 400);
            }
            return response()->json([
                'message' => 'Waktu absensi sudah habis (maksimal 15 menit)'
            ], 400);
        }

        // Validate request
        $validated = $request->validate([
            'selfie' => 'required|image|max:5120',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'face_detected' => 'required|in:true,false,1,0',
        ]);
        
        // Convert face_detected string to boolean
        $validated['face_detected'] = filter_var($validated['face_detected'], FILTER_VALIDATE_BOOLEAN);

        // Check geo-fencing if enabled
        if (Setting::getBool('geofencing_enabled', true)) {
            $campusLat = Setting::getFloat('campus_latitude');
            $campusLng = Setting::getFloat('campus_longitude');
            $maxDistance = Setting::getFloat('max_distance_meters', 100);

            $distance = $this->geocodingService->calculateDistance(
                $validated['latitude'],
                $validated['longitude'],
                $campusLat,
                $campusLng
            );

            if ($distance > $maxDistance) {
                return response()->json([
                    'message' => 'Lokasi Anda di luar jangkauan kampus (' . round($distance) . 'm dari lokasi, maksimal ' . $maxDistance . 'm)'
                ], 400);
            }
        }

        // Store selfie
        $selfiePath = $request->file('selfie')->store('selfies', 'public');

        // Address initially null or placeholder
        $address = "Menunggu verifikasi lokasi...";

        // Create attendance
        $attendance = Attendance::create([
            'user_id' => $user->id,
            'attendance_session_id' => $session->id,
            'selfie_path' => $selfiePath,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address' => $address,
            'face_detected' => $validated['face_detected'],
            'submitted_at' => now(),
        ]);

        // Dispatch background job to fetch address from API
        \App\Jobs\ProcessAttendanceAddress::dispatch(
            $attendance->id,
            $validated['latitude'],
            $validated['longitude']
        );

        return response()->json([
            'message' => 'Absensi berhasil',
            'data' => [
                'id' => $attendance->id,
                'week_name' => $session->week_name,
                'submitted_at' => $attendance->submitted_at->format('Y-m-d H:i:s'),
                'address' => $attendance->address,
            ]
        ], 201);
    }

    /**
     * Get attendance history for current user.
     */
    public function myAttendances(Request $request)
    {
        $attendances = Attendance::with('attendanceSession')
            ->where('user_id', $request->user()->id)
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'session' => [
                        'id' => $attendance->attendanceSession->id,
                        'week_name' => $attendance->attendanceSession->week_name,
                        'date' => $attendance->attendanceSession->session_date->format('Y-m-d'),
                    ],
                    'submitted_at' => $attendance->submitted_at->format('Y-m-d H:i:s'),
                    'address' => $attendance->address,
                ];
            });

        return response()->json([
            'data' => $attendances
        ]);
    }

    /**
     * Get geo-fencing settings for frontend.
     */
    public function settings()
    {
        return response()->json([
            'data' => [
                'geofencing_enabled' => Setting::getBool('geofencing_enabled', true),
                'campus_latitude' => Setting::getFloat('campus_latitude'),
                'campus_longitude' => Setting::getFloat('campus_longitude'),
                'max_distance_meters' => Setting::getFloat('max_distance_meters', 100),
            ]
        ]);
    }
}
