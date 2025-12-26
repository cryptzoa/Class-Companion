<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;

class Settings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Pengaturan';
    protected static ?string $title = 'Pengaturan Sistem';
    protected static string $view = 'filament.pages.settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'geofencing_enabled' => Setting::getBool('geofencing_enabled', true),
            'campus_latitude' => Setting::get('campus_latitude', '-6.200000'),
            'campus_longitude' => Setting::get('campus_longitude', '106.816666'),
            'max_distance_meters' => Setting::get('max_distance_meters', '100'),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Pengaturan Geo-fencing')
                    ->description('Konfigurasi validasi lokasi untuk absensi')
                    ->schema([
                        Forms\Components\Toggle::make('geofencing_enabled')
                            ->label('Aktifkan Geo-fencing')
                            ->helperText('Jika dinonaktifkan, validasi lokasi akan dilewati'),
                        Forms\Components\TextInput::make('campus_latitude')
                            ->label('Latitude Kampus')
                            ->required()
                            ->numeric()
                            ->step(0.000001),
                        Forms\Components\TextInput::make('campus_longitude')
                            ->label('Longitude Kampus')
                            ->required()
                            ->numeric()
                            ->step(0.000001),
                        Forms\Components\TextInput::make('max_distance_meters')
                            ->label('Radius Maksimal (meter)')
                            ->required()
                            ->numeric()
                            ->minValue(10)
                            ->maxValue(10000)
                            ->helperText('Jarak maksimal mahasiswa dari titik kampus'),
                    ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('geofencing_enabled', $data['geofencing_enabled'] ? 'true' : 'false');
        Setting::set('campus_latitude', $data['campus_latitude']);
        Setting::set('campus_longitude', $data['campus_longitude']);
        Setting::set('max_distance_meters', $data['max_distance_meters']);

        Notification::make()
            ->title('Pengaturan berhasil disimpan')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan')
                ->submit('save'),
        ];
    }
}
