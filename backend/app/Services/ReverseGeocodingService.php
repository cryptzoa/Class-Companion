<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReverseGeocodingService
{
    /**
     * Convert coordinates to human-readable address using OpenStreetMap Nominatim.
     */
    public function getAddress(float $lat, float $lng): ?string
    {
        try {
            $url = "https://nominatim.openstreetmap.org/reverse";
            
            $response = Http::timeout(5) // 5 seconds timeout
                ->withHeaders([
                    'User-Agent' => 'ClassCompanion/1.0 (rayhan@classcompanion.com)'
                ])->get($url, [
                    'format' => 'json',
                    'lat' => $lat,
                    'lon' => $lng,
                    'zoom' => 18,
                    'addressdetails' => 1,
                ]);

            /** @var \Illuminate\Http\Client\Response $response */
            if ($response->successful()) {
                $displayName = $response->json('display_name');
                return $displayName ? (string) $displayName : null;
            }

            Log::warning('Reverse geocoding failed', [
                'lat' => $lat,
                'lng' => $lng,
                'response' => $response->body()
            ]);

            // Fallback: Return coordinates
            return "Lat: {$lat}, Lng: {$lng}";
        } catch (\Exception $e) {
            Log::error('Reverse geocoding error', [
                'lat' => $lat,
                'lng' => $lng,
                'error' => $e->getMessage()
            ]);

            // Fallback: Return coordinates on error
            return "Lat: {$lat}, Lng: {$lng}";
        }
    }

    /**
     * Calculate distance between two coordinates using Haversine formula.
     */
    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000; // meters

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lng1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lng2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos($latFrom) * cos($latTo) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
