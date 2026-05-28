<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

if (app()->environment('demo')) {
    Schedule::command('demo:reset')
        ->dailyAt('04:00')
        ->timezone('Europe/Paris')
        ->withoutOverlapping();
}
