<?php

namespace App\Providers;

use App\Models\Cuisine;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

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
        $this->configureDefaults();

        Inertia::share([
            'cuisines' => fn() => Cuisine::select('id', 'name', 'slug', 'emoji')
                ->orderBy('name')
                ->get(),
            'flash' => fn() => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'auth' => fn() => [
                'user' => auth()->check() ? [
                    'id'   => auth()->id(),
                    'name' => auth()->user()->name,
                ] : null,
            ],
        ]);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
