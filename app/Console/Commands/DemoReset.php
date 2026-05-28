<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class DemoReset extends Command
{
    protected $signature = 'demo:reset';

    protected $description = 'Réinitialise complètement la base de démo (migrate:fresh + seed). Bloqué hors APP_ENV=demo.';

    public function handle(): int
    {
        if (! app()->environment('demo')) {
            $this->error('demo:reset est réservé à APP_ENV=demo (actuel : '.app()->environment().').');

            return self::FAILURE;
        }

        $this->info('Reset démo : migrate:fresh --seed --force …');

        Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true], $this->output);

        $this->info('Reset démo terminé.');

        return self::SUCCESS;
    }
}
