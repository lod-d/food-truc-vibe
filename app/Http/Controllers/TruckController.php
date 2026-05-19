<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTruckRequest;
use App\Mail\TruckRegisteredMail;
use App\Models\FoodTruck;
use App\Models\Location;
use App\Models\Schedule;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class TruckController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'lat'     => ['nullable', 'numeric', 'between:-90,90'],
            'lng'     => ['nullable', 'numeric', 'between:-180,180'],
            'min_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'max_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'min_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'max_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'radius'  => ['nullable', 'integer', 'min:1', 'max:500'],
            'page'    => ['nullable', 'integer', 'min:1', 'max:5000'],
        ]);

        $date = $request->date ? Carbon::parse($request->date) : now();

        $trucks = FoodTruck::with([
            'cuisine:id,name,emoji,slug',
            'locations' => function ($q) use ($request, $date) {
                if ($request->filled('lat') && $request->filled('lng')) {
                    $lat    = (float) $request->lat;
                    $lng    = (float) $request->lng;
                    $radius = (int) ($request->radius ?? 50);
                    $q->whereRaw(
                        '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) < ?',
                        [$lat, $lng, $lat, $radius]
                    );
                }
                $q->with(['schedules' => fn($s) => $s->openToday($date)]);
                if ($request->filled('min_lat') && $request->filled('max_lat')) {
                    $q->whereBetween('latitude',  [(float) $request->min_lat, (float) $request->max_lat])
                      ->whereBetween('longitude', [(float) $request->min_lng, (float) $request->max_lng]);
                }
            },
        ])
        ->when($request->filled('cuisine'), fn($q) =>
            $q->whereHas('cuisine', fn($c) => $c->where('slug', $request->cuisine))
        )
        ->when($request->boolean('open_now'), fn($q) =>
            $q->whereHas('locations.schedules', fn($s) => $s->openNow())
        )
        ->when($request->filled('name'), fn($q) =>
            $q->where('name', 'LIKE', '%' . addcslashes((string) $request->input('name'), '%_') . '%')
        )
        ->paginate(20);

        return response()->json([
            'data'         => $trucks->map(fn($truck) => $this->formatTruck($truck, $date)),
            'current_page' => $trucks->currentPage(),
            'last_page'    => $trucks->lastPage(),
            'total'        => $trucks->total(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $truck = FoodTruck::with(['cuisine', 'locations.schedules'])
            ->findOrFail($id);

        return response()->json(['data' => $this->formatTruck($truck, now())]);
    }

    public function checkName(Request $request): JsonResponse
    {
        $name = $request->string('name')->trim();

        if ($name->isEmpty()) {
            return response()->json(['exists' => false]);
        }

        $exists = FoodTruck::whereRaw('LOWER(name) = ?', [strtolower($name)])->exists();

        return response()->json(['exists' => $exists]);
    }

    public function create(): Response
    {
        return Inertia::render('Register/Index');
    }

    public function store(StoreTruckRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $photoUrl = $request->file('photo')->store('trucks', 'public');
        }

        $truck = FoodTruck::create([
            'user_id'       => auth()->id(),
            'cuisine_id'    => $data['cuisine_id'],
            'name'          => $data['name'],
            'description'   => $data['description'] ?? null,
            'email'         => $data['email'] ?? null,
            'phone'         => $data['phone'] ?? null,
            'instagram_url' => $data['instagram_url'] ?? null,
            'photo_url'     => $photoUrl ? asset('storage/' . $photoUrl) : null,
        ]);

        $location = Location::create([
            'food_truck_id' => $truck->id,
            'address'       => $data['address'],
            'city'          => $data['city'],
            'latitude'      => $data['latitude'],
            'longitude'     => $data['longitude'],
            'place_name'    => $data['place_name'] ?? null,
        ]);

        foreach ($data['days'] as $day) {
            Schedule::create([
                'location_id'  => $location->id,
                'day_of_week'  => $day,
                'opens_at'     => $data['opens_at'],
                'closes_at'    => $data['closes_at'],
                'is_recurring' => $data['is_recurring'] ?? true,
            ]);
        }

        if ($truck->email) {
            try {
                Mail::to($truck->email)->send(new TruckRegisteredMail($truck));
            } catch (\Exception $e) {
                \Log::error('TruckRegisteredMail failed: ' . $e->getMessage());
            }
        }

        return redirect()->route('home')->with('success', "Votre truck \"{$truck->name}\" a bien été enregistré !");
    }

    private function formatTruck(FoodTruck $truck, CarbonInterface $date): array
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
                    'id'              => $loc->id,
                    'address'         => $loc->address,
                    'city'            => $loc->city,
                    'latitude'        => (float) $loc->latitude,
                    'longitude'       => (float) $loc->longitude,
                    'place_name'      => $loc->place_name,
                    'is_open_today'   => $schedule !== null,
                    'is_open_now'     => $schedule && $this->isOpenNow($schedule),
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
