<?php

namespace Database\Seeders;

use App\Models\FoodTruck;
use App\Models\Location;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class FoodTruckSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory()->count(40)->create();

        foreach ($users as $user) {
            $truckCount = random_int(6, 9);

            for ($i = 0; $i < $truckCount; $i++) {
                $truck = FoodTruck::factory()->for($user)->create();

                $location = Location::factory()
                    ->for($truck, 'foodTruck')
                    ->create();

                $days = collect(range(0, 6))
                    ->shuffle()
                    ->take(random_int(3, 6));

                foreach ($days as $day) {
                    Schedule::factory()
                        ->for($location)
                        ->create(['day_of_week' => $day]);
                }
            }
        }
    }
}
