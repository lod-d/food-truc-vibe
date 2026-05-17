<?php

namespace Database\Seeders;

use App\Models\Cuisine;
use Illuminate\Database\Seeder;

class CuisineSeeder extends Seeder
{
    public function run(): void
    {
        $cuisines = [
            ['name' => 'Burger',      'slug' => 'burger',      'emoji' => '🍔'],
            ['name' => 'Tacos',       'slug' => 'tacos',       'emoji' => '🌮'],
            ['name' => 'Pizza',       'slug' => 'pizza',       'emoji' => '🍕'],
            ['name' => 'Asiatique',   'slug' => 'asiatique',   'emoji' => '🍜'],
            ['name' => 'Sushi',       'slug' => 'sushi',       'emoji' => '🍱'],
            ['name' => 'Kebab',       'slug' => 'kebab',       'emoji' => '🥙'],
            ['name' => 'Végétarien',  'slug' => 'vegetarien',  'emoji' => '🥗'],
            ['name' => 'BBQ',         'slug' => 'bbq',         'emoji' => '🥩'],
            ['name' => 'Desserts',    'slug' => 'desserts',    'emoji' => '🧁'],
            ['name' => 'Street food', 'slug' => 'street-food', 'emoji' => '🥡'],
        ];

        foreach ($cuisines as $data) {
            Cuisine::firstOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
