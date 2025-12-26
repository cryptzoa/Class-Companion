<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class AttendanceSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'week_name',
        'session_date',
        'material_id',
        'attendance_open_at',
    ];

    protected function casts(): array
    {
        return [
            'session_date' => 'date',
            'attendance_open_at' => 'datetime',
        ];
    }

    /**
     * Get the material for this session (optional).
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * Get all attendances for this session.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Check if attendance is currently open (within 15 minutes).
     */
    public function isAttendanceOpen(): bool
    {
        if (!$this->attendance_open_at) {
            return false;
        }

        $openTime = Carbon::parse($this->attendance_open_at);
        $minutesPassed = now()->diffInMinutes($openTime, false);

        return $minutesPassed >= -15 && $minutesPassed <= 0;
    }

    /**
     * Get remaining minutes for attendance.
     */
    public function getRemainingMinutesAttribute(): ?int
    {
        if (!$this->attendance_open_at) {
            return null;
        }

        $openTime = Carbon::parse($this->attendance_open_at);
        $minutesPassed = now()->diffInMinutes($openTime, false);
        $remaining = 15 + $minutesPassed;

        return max(0, $remaining);
    }
}
