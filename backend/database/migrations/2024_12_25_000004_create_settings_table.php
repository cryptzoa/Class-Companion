<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'geofencing_enabled', 'value' => 'true', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'campus_latitude', 'value' => '-6.200000', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'campus_longitude', 'value' => '106.816666', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'max_distance_meters', 'value' => '100', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
