<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AttendanceSessionResource\Pages;
use App\Models\AttendanceSession;
use App\Models\Material;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;

class AttendanceSessionResource extends Resource
{
    protected static ?string $model = AttendanceSession::class;
    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationLabel = 'Sesi Absensi';
    protected static ?string $modelLabel = 'Sesi Absensi';
    protected static ?string $pluralModelLabel = 'Sesi Absensi';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Sesi')
                    ->schema([
                        Forms\Components\TextInput::make('week_name')
                            ->label('Nama Sesi')
                            ->placeholder('e.g., Week 1, Week 2, UTS, UAS')
                            ->required()
                            ->maxLength(50),
                        Forms\Components\DatePicker::make('session_date')
                            ->label('Tanggal')
                            ->required()
                            ->default(now()),
                        Forms\Components\Select::make('material_id')
                            ->label('Materi (Opsional)')
                            ->relationship('material', 'title')
                            ->searchable()
                            ->preload()
                            ->placeholder('Pilih materi atau kosongkan'),
                    ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('week_name')
                    ->label('Sesi')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('session_date')
                    ->label('Tanggal')
                    ->date('d M Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('material.title')
                    ->label('Materi')
                    ->placeholder('-')
                    ->limit(30),
                Tables\Columns\TextColumn::make('attendance_open_at')
                    ->label('Absen Dibuka')
                    ->dateTime('H:i')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('attendances_count')
                    ->label('Hadir')
                    ->counts('attendances')
                    ->badge()
                    ->color('success'),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\Action::make('open_attendance')
                    ->label('Buka Absen')
                    ->icon('heroicon-o-clock')
                    ->color('success')
                    ->action(function (AttendanceSession $record): void {
                        $record->update(['attendance_open_at' => now()]);
                        Notification::make()
                            ->title('Absensi dibuka!')
                            ->body('Mahasiswa dapat melakukan absensi selama 15 menit.')
                            ->success()
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Buka Absensi?')
                    ->modalDescription('Mahasiswa akan dapat melakukan absensi selama 15 menit.'),
                Tables\Actions\Action::make('close_attendance')
                    ->label('Tutup Absen')
                    ->icon('heroicon-o-lock-closed')
                    ->color('danger')
                    ->action(function (AttendanceSession $record): void {
                        // Set to far past to ensure it's closed (setting null might be cleaner, 
                        // but setting to past keeps "history" that it WAS open.
                        // However, isAttendanceOpen() checks 15 min window.
                        // Setting to null effectively closes it.
                        $record->update(['attendance_open_at' => null]);
                        Notification::make()
                            ->title('Absensi ditutup!')
                            ->body('Sesi absensi telah diakhiri secara manual.')
                            ->danger()
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Tutup Absensi?')
                    ->modalDescription('Mahasiswa tidak akan bisa absen lagi untuk sesi ini.')
                    // Only show if it is currently open
                    ->visible(fn (AttendanceSession $record): bool => $record->isAttendanceOpen()),
                Tables\Actions\Action::make('view_attendances')
                    ->label('Lihat Absen')
                    ->icon('heroicon-o-users')
                    ->color('info')
                    ->url(fn (AttendanceSession $record): string => AttendanceResource::getUrl('index', ['tableFilters[attendance_session_id][value]' => $record->id])),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('session_date', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAttendanceSessions::route('/'),
            'create' => Pages\CreateAttendanceSession::route('/create'),
            'edit' => Pages\EditAttendanceSession::route('/{record}/edit'),
        ];
    }
}
