<?php

namespace Database\Factories;

use App\Models\FoodTruck;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Location>
 */
class LocationFactory extends Factory
{
    protected $model = Location::class;

    private const CITIES = [
        ['Paris',            48.8566,  2.3522,  '75001'],
        ['Lyon',             45.7640,  4.8357,  '69001'],
        ['Marseille',        43.2965,  5.3698,  '13001'],
        ['Toulouse',         43.6047,  1.4442,  '31000'],
        ['Bordeaux',         44.8378, -0.5792,  '33000'],
        ['Lille',            50.6292,  3.0573,  '59000'],
        ['Nantes',           47.2184, -1.5536,  '44000'],
        ['Strasbourg',       48.5734,  7.7521,  '67000'],
        ['Nice',             43.7102,  7.2620,  '06000'],
        ['Rennes',           48.1173, -1.6778,  '35000'],
        ['Montpellier',      43.6108,  3.8767,  '34000'],
        ['Reims',            49.2583,  4.0317,  '51100'],
        ['Le Havre',         49.4944,  0.1079,  '76600'],
        ['Dijon',            47.3220,  5.0415,  '21000'],
        ['Grenoble',         45.1885,  5.7245,  '38000'],
        ['Angers',           47.4784, -0.5632,  '49000'],
        ['Nîmes',            43.8367,  4.3601,  '30000'],
        ['Brest',            48.3904, -4.4861,  '29200'],
        ['Tours',            47.3941,  0.6848,  '37000'],
        ['Limoges',          45.8336,  1.2611,  '87000'],
        ['Clermont-Ferrand', 45.7772,  3.0870,  '63000'],
        ['Amiens',           49.8941,  2.2958,  '80000'],
        ['Besançon',         47.2378,  6.0241,  '25000'],
        ['Metz',             49.1193,  6.1757,  '57000'],
        ['Caen',             49.1829, -0.3707,  '14000'],
        ['Orléans',          47.9029,  1.9039,  '45000'],
        ['Rouen',            49.4431,  1.0993,  '76000'],
        ['Mulhouse',         47.7508,  7.3359,  '68100'],
        ['Perpignan',        42.6886,  2.8949,  '66000'],
        ['Nancy',            48.6921,  6.1844,  '54000'],
    ];

    public function definition(): array
    {
        [$city, $lat, $lng, $postal] = fake()->randomElement(self::CITIES);

        return [
            'food_truck_id' => FoodTruck::factory(),
            'address' => fake()->streetAddress(),
            'city' => $city,
            'postal_code' => $postal,
            'latitude' => $lat + (mt_rand(-500, 500) / 10000),
            'longitude' => $lng + (mt_rand(-500, 500) / 10000),
            'place_name' => fake()->boolean(30) ? 'Place '.fake()->lastName() : null,
        ];
    }
}
