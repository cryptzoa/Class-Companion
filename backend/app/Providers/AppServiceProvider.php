<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return "http://192.168.1.9:3000/reset-password?token={$token}&email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
