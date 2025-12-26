<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_protected_routes_reject_unauthenticated_access(): void
    {
        $response = $this->getJson('/api/me');
        $response->assertStatus(401);

        $response = $this->getJson('/api/materials');
        $response->assertStatus(401);
    }

    public function test_idor_user_cannot_view_others_attendance(): void
    {
        // 1. Create two users
        $userA = User::factory()->create(['is_active' => true]);
        $userB = User::factory()->create(['is_active' => true]);

        // 2. User A has an attendance record
        $session = AttendanceSession::factory()->create();
        $attendanceA = Attendance::create([
            'user_id' => $userA->id,
            'attendance_session_id' => $session->id,
            'selfie_path' => 'test.jpg',
            'latitude' => 0,
            'longitude' => 0,
            'face_detected' => true,
            'submitted_at' => now(),
        ]);

        // 3. User B tries to view User A's attendance (assuming there is a detail endpoint, or just checking list filtering)
        // If /my-attendances only returns OWN data, then user B should not see user A's data.
        
        $tokenB = $userB->createToken('auth')->plainTextToken;
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $tokenB])
            ->getJson('/api/my-attendances');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data'); // Should be empty
            
        // If there was a direct ID access endpoint e.g. /attendances/{id}, we would test that too.
        // But currently valid API is only /my-attendances
    }

    public function test_sql_injection_resilience(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $token = $user->createToken('auth')->plainTextToken;

        // Try to inject SQL in a filter parameter if it exists, or login
        $response = $this->postJson('/api/login', [
            'nim' => "' OR 1=1 --", 
            'password' => 'password'
        ]);

        $response->assertStatus(422) // Should fail validation or 401
            ->assertJsonMissing(['token']);
    }

    public function test_malicious_file_upload_rejected(): void
    {
        Storage::fake('public');
        
        $user = User::factory()->create(['is_active' => true]);
        $token = $user->createToken('auth')->plainTextToken;
        $session = AttendanceSession::factory()->create([
            'attendance_open_at' => now(),
            'week_name' => 'Week X'
        ]);

        // Create a fake PHP file masquerading as image if validation is weak
        // But Laravel validation 'image' checks MIME.
        $file = UploadedFile::fake()->create('exploit.php', 100);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson("/api/sessions/{$session->id}/attend", [
                'latitude' => 0,
                'longitude' => 0,
                'face_detected' => 'true',
                'selfie' => $file
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['selfie']);
    }
}
