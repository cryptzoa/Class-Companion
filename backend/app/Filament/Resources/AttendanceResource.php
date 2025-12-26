<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AttendanceResource\Pages;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AttendanceResource extends Resource
{
    protected static ?string $model = Attendance::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';
    protected static ?string $navigationLabel = 'Rekap Absensi';
    protected static ?string $modelLabel = 'Absensi';
    protected static ?string $pluralModelLabel = 'Rekap Absensi';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Bukti Absensi')
                    ->schema([
                        Forms\Components\FileUpload::make('selfie_path')
                            ->label('Foto Selfie')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->disabled() // Read-only
                            ->dehydrated(false) // Don't save on edit
                            ->columnSpanFull(),
                    ]),
                Forms\Components\Section::make('Informasi Mahasiswa')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Mahasiswa')
                            ->relationship('user', 'name')
                            ->disabled(),
                        Forms\Components\Select::make('attendance_session_id')
                            ->label('Sesi')
                            ->relationship('attendanceSession', 'week_name')
                            ->disabled(),
                        Forms\Components\Textarea::make('address')
                            ->label('Lokasi')
                            ->disabled(),
                        Forms\Components\Toggle::make('face_detected')
                            ->label('Wajah Terdeteksi')
                            ->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.nim')
                    ->label('NIM')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('attendanceSession.week_name')
                    ->label('Sesi')
                    ->sortable(),
                Tables\Columns\TextColumn::make('address')
                    ->label('Lokasi')
                    ->limit(40)
                    ->wrap()
                    ->tooltip(fn (Attendance $record): ?string => $record->address),
                Tables\Columns\IconColumn::make('face_detected')
                    ->label('Wajah Valid')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\ImageColumn::make('selfie_path')
                    ->label('Foto')
                    ->disk('public')
                    ->circular()
                    ->size(40),
                Tables\Columns\TextColumn::make('submitted_at')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('attendance_session_id')
                    ->label('Sesi')
                    ->options(AttendanceSession::pluck('week_name', 'id')),
                Tables\Filters\TernaryFilter::make('face_detected')
                    ->label('Status Wajah'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkAction::make('export')
                    ->label('Export Excel (CSV)')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function (Tables\Actions\BulkAction $action, \Illuminate\Database\Eloquent\Collection $records) {
                        return response()->streamDownload(function () use ($records) {
                            echo "\xEF\xBB\xBF"; // UTF-8 BOM
                            $handle = fopen('php://output', 'w');
                            fwrite($handle, "sep=,\n"); // Force Excel to use comma
                            fputcsv($handle, ['NIM', 'Nama', 'Waktu', 'Keterangan']);

                            foreach ($records as $record) {
                                fputcsv($handle, [
                                    $record->user->nim,
                                    $record->user->name,
                                    $record->submitted_at->format('Y-m-d H:i:s'),
                                    'Hadir',
                                ]);
                            }
                            fclose($handle);
                        }, 'rekap-absensi-' . now()->format('Y-m-d-His') . '.csv');
                    })
                    ->deselectRecordsAfterCompletion(),
                Tables\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('submitted_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAttendances::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
