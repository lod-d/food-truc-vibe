<?php

namespace Database\Seeders;

use App\Models\Cuisine;
use App\Models\FoodTruck;
use App\Models\Location;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    private const DEMO_TRUCKS = [
        ['Burger Démo Paris',       'burger',      48.8566,  2.3522,  'Paris',        '75001'],
        ['Tacos Démo Lyon',         'tacos',       45.7640,  4.8357,  'Lyon',         '69001'],
        ['Pizza Démo Marseille',    'pizza',       43.2965,  5.3698,  'Marseille',    '13001'],
        ['Asiatique Démo Toulouse', 'asiatique',   43.6047,  1.4442,  'Toulouse',     '31000'],
        ['Sushi Démo Bordeaux',     'sushi',       44.8378, -0.5792,  'Bordeaux',     '33000'],
        ['Kebab Démo Lille',        'kebab',       50.6292,  3.0573,  'Lille',        '59000'],
        ['Veggie Démo Nantes',      'vegetarien',  47.2184, -1.5536,  'Nantes',       '44000'],
        ['BBQ Démo Strasbourg',     'bbq',         48.5734,  7.7521,  'Strasbourg',   '67000'],
        ['Desserts Démo Nice',      'desserts',    43.7102,  7.2620,  'Nice',         '06000'],
        ['Street Démo Rennes',      'street-food', 48.1173, -1.6778,  'Rennes',       '35000'],
    ];

    public function run(): void
    {
        $demo = User::firstOrCreate(
            ['email' => 'demo@truckmap.fr'],
            [
                'name' => 'Démo TruckMap',
                'password' => Hash::make('demo'),
                'email_verified_at' => now(),
            ]
        );

        foreach (self::DEMO_TRUCKS as [$name, $cuisineSlug, $lat, $lng, $city, $postal]) {
            $cuisine = Cuisine::where('slug', $cuisineSlug)->first();

            $truck = FoodTruck::create([
                'user_id' => $demo->id,
                'cuisine_id' => $cuisine?->id,
                'name' => $name,
                'description' => "Truck de démonstration — $city. Données réinitialisées chaque nuit.",
                'phone' => '01 23 45 67 89',
                'email' => 'demo@truckmap.fr',
                'instagram_url' => null,
                'photo_url' => null,
            ]);

            $location = Location::create([
                'food_truck_id' => $truck->id,
                'address' => '1 rue de la Démo',
                'city' => $city,
                'postal_code' => $postal,
                'latitude' => $lat,
                'longitude' => $lng,
                'place_name' => null,
            ]);

            foreach (range(0, 6) as $day) {
                Schedule::create([
                    'location_id' => $location->id,
                    'day_of_week' => $day,
                    'opens_at' => '11:00:00',
                    'closes_at' => '22:00:00',
                    'is_recurring' => true,
                    'is_cancelled' => false,
                ]);
            }
        }

        $this->command->info('Demo user créé : demo@truckmap.fr / demo (10 trucks)');
    }
}
