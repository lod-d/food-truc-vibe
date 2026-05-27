<?php

namespace Database\Factories;

use App\Models\Cuisine;
use App\Models\FoodTruck;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<FoodTruck>
 */
class FoodTruckFactory extends Factory
{
    protected $model = FoodTruck::class;

    private const NAMES = [
        'Le Camion de Marcel', 'Burger Bros', 'Tacos Roi', 'Pizza Mobile',
        'Le Wok Roulant', 'Sushi Express', 'Kebab du Coin', 'Veggie Truck',
        'BBQ Nation', 'Sweet Wheels', 'Chez Gaston', 'La Cantine Ambulante',
        'Street Eats', 'Le Food Mood', 'Roule ma Poule', 'Miam Mobile',
        'Le Bistrot Roulant', 'Hot Dog Hero', 'Crêpes & Co', 'Tako Time',
        'La Frite Belge', 'El Loco Taco', 'Pasta Pronto', 'Bao & Buns',
        'Saveurs du Sud', 'Le Camion Rouge', 'Goûts d\'Asie', 'Bagel Boys',
        'La Roulotte Gourmande', 'Smash & Bun',
    ];

    public function definition(): array
    {
        $name = fake()->randomElement(self::NAMES).' '.fake()->randomLetter().fake()->randomNumber(2);

        return [
            'user_id' => User::factory(),
            'cuisine_id' => Cuisine::inRandomOrder()->value('id'),
            'name' => $name,
            'description' => fake()->sentence(8),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'instagram_url' => fake()->boolean(40)
                ? 'https://instagram.com/'.Str::slug($name)
                : null,
            'photo_url' => null,
        ];
    }
}
