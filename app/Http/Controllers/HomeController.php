<?php

namespace App\Http\Controllers;

use App\Models\FoodTruck;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $initialTrucks = FoodTruck::with([
            'cuisine:id,name,emoji,slug',
            'locations.schedules' => fn($q) => $q->openToday(now()),
        ])
        ->whereHas('locations.schedules', fn($q) => $q->openToday(now()))
        ->get()
        ->map(fn($truck) => $this->formatTruck($truck));

        return Inertia::render('Home', [
            'initialTrucks' => $initialTrucks,
        ]);
    }

    private function formatTruck(FoodTruck $truck): array
    {
        return [
            'id'            => $truck->id,
            'name'          => $truck->name,
            'cuisine'       => $truck->cuisine->only('name', 'emoji', 'slug'),
            'photo_url'     => $truck->photo_url,
            'instagram_url' => $truck->instagram_url,
            'phone'         => $truck->phone,
            'locations'     => $truck->locations->map(function ($loc) {
                $schedule = $loc->schedules->first();
                return [
                    'id'             => $loc->id,
                    'address'        => $loc->address,
                    'city'           => $loc->city,
                    'latitude'       => (float) $loc->latitude,
                    'longitude'      => (float) $loc->longitude,
                    'place_name'     => $loc->place_name,
                    'is_open_today'  => $schedule !== null,
                    'is_open_now'    => $schedule && $this->isOpenNow($schedule),
                    'todays_schedule' => $schedule ? [
                        'opens_at'  => $schedule->opens_at,
                        'closes_at' => $schedule->closes_at,
                    ] : null,
                ];
            }),
        ];
    }

    private function isOpenNow($schedule): bool
    {
        $now = now()->toTimeString();
        return $schedule->opens_at <= $now && $schedule->closes_at >= $now;
    }
}
