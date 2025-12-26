<?php

namespace Tests\Unit;

use App\Services\ReverseGeocodingService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ReverseGeocodingServiceTest extends TestCase
{
    public function test_returns_address_when_api_successful(): void
    {
        Http::fake([
            'nominatim.openstreetmap.org/*' => Http::response([
                'display_name' => 'Jl. Raya Kampus No. 123'
            ], 200),
        ]);

        $service = new ReverseGeocodingService();
        $address = $service->getAddress(-6.2, 106.8);

        $this->assertEquals('Jl. Raya Kampus No. 123', $address);
    }

    public function test_returns_coordinates_fallback_when_api_fails(): void
    {
        Http::fake([
            'nominatim.openstreetmap.org/*' => Http::response(null, 500),
        ]);

        $service = new ReverseGeocodingService();
        $address = $service->getAddress(-6.2, 106.8);

        $this->assertEquals('Lat: -6.2, Lng: 106.8', $address);
    }

    public function test_returns_coordinates_fallback_when_exception_occurs(): void
    {
        // No fake defined will cause exception if not handled, 
        // OR we can explicitly throw exception if we want closer simulation
        // but Http::fake prevents real requests. 
        // To simulate exception we can do nothing in fake or use Sequence.
        // Let's rely on the previous test for fallback logic.
        // But let's test the specific timeout/connection error simulation
        
         Http::fake(function ($request) {
            throw new \Exception('Connection timeout');
        });

        $service = new ReverseGeocodingService();
        $address = $service->getAddress(-6.2, 106.8);

        $this->assertEquals('Lat: -6.2, Lng: 106.8', $address);
    }
}
