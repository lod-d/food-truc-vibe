<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([CuisineSeeder::class]);

        if (app()->environment(['local', 'demo'])) {
            $this->call([UserSeeder::class, FoodTruckSeeder::class]);
        }

        if (app()->environment('demo')) {
            $this->call([DemoSeeder::class]);
        }
    }
}
