<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTruckRequest;
use App\Models\FoodTruck;
use App\Models\Location;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TruckAdminController extends Controller
{
    public function index(): Response
    {
        $myTrucks = Auth::user()->trucks()
            ->with(['cuisine:id,name,emoji,slug', 'locations.schedules'])
            ->latest()
            ->get()
            ->map(fn (FoodTruck $t) => $this->formatForAdmin($t));

        $unclaimedTrucks = FoodTruck::whereNull('user_id')
            ->with(['cuisine:id,name,emoji,slug', 'locations.schedules'])
            ->orderBy('name')
            ->get()
            ->map(fn (FoodTruck $t) => $this->formatForAdmin($t));

        return Inertia::render('Admin/Index', [
            'trucks' => $myTrucks,
            'unclaimedTrucks' => $unclaimedTrucks,
        ]);
    }

    public function edit(FoodTruck $truck): Response
    {
        abort_if($truck->user_id !== Auth::id(), 403);

        $truck->load(['cuisine', 'locations.schedules']);
        $location = $truck->locations->first();
        $schedules = $location?->schedules ?? collect();

        return Inertia::render('Admin/Edit', [
            'truck' => [
                'id' => $truck->id,
                'name' => $truck->name,
                'cuisine_id' => $truck->cuisine_id,
                'description' => $truck->description,
                'email' => $truck->email,
                'phone' => $truck->phone,
                'instagram_url' => $truck->instagram_url,
                'photo_url' => $truck->photo_url,
                'address' => $location?->address ?? '',
                'city' => $location?->city ?? '',
                'latitude' => $location ? (float) $location->latitude : null,
                'longitude' => $location ? (float) $location->longitude : null,
                'place_name' => $location?->place_name,
                'days' => $schedules->pluck('day_of_week')->toArray(),
                'opens_at' => $schedules->first()?->opens_at ?? '',
                'closes_at' => $schedules->first()?->closes_at ?? '',
                'is_recurring' => $schedules->first()?->is_recurring ?? true,
            ],
        ]);
    }

    public function update(UpdateTruckRequest $request, FoodTruck $truck): RedirectResponse
    {
        abort_if($truck->user_id !== Auth::id(), 403);

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo_url'] = asset('storage/'.$request->file('photo')->store('trucks', 'public'));
        } else {
            unset($data['photo_url']);
        }

        $truck->update([
            'cuisine_id' => $data['cuisine_id'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'instagram_url' => $data['instagram_url'] ?? null,
            'photo_url' => $data['photo_url'] ?? $truck->photo_url,
        ]);

        $truck->locations()->delete();

        $location = Location::create([
            'food_truck_id' => $truck->id,
            'address' => $data['address'],
            'city' => $data['city'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'place_name' => $data['place_name'] ?? null,
        ]);

        foreach ($data['days'] as $day) {
            Schedule::create([
                'location_id' => $location->id,
                'day_of_week' => $day,
                'opens_at' => $data['opens_at'],
                'closes_at' => $data['closes_at'],
                'is_recurring' => $data['is_recurring'] ?? true,
            ]);
        }

        return redirect()->route('admin.index')->with('success', "Truck \"{$truck->name}\" mis à jour.");
    }

    public function destroy(FoodTruck $truck): RedirectResponse
    {
        abort_if($truck->user_id !== Auth::id(), 403);

        $name = $truck->name;
        $truck->delete();

        return redirect()->route('admin.index')->with('success', "Truck \"{$name}\" supprimé.");
    }

    public function claim(FoodTruck $truck): RedirectResponse
    {
        abort_if($truck->user_id !== null, 403);

        $truck->update(['user_id' => Auth::id()]);

        return redirect()->route('admin.index')
            ->with('success', "Vous êtes maintenant propriétaire de \"{$truck->name}\".");
    }

    private function formatForAdmin(FoodTruck $truck): array
    {
        return [
            'id' => $truck->id,
            'name' => $truck->name,
            'cuisine' => $truck->cuisine->only('name', 'emoji', 'slug'),
            'photo_url' => $truck->photo_url,
            'city' => $truck->locations->first()?->city,
            'is_open_today' => $truck->locations->first()?->schedules->isNotEmpty(),
        ];
    }
}
