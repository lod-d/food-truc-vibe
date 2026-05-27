<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Schedule>
 */
class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition(): array
    {
        $opensHour = fake()->numberBetween(11, 12);
        $closesHour = fake()->numberBetween(14, 22);

        return [
            'location_id' => Location::factory(),
            'day_of_week' => fake()->numberBetween(0, 6),
            'opens_at' => sprintf('%02d:00:00', $opensHour),
            'closes_at' => sprintf('%02d:00:00', $closesHour),
            'specific_date' => null,
            'is_recurring' => true,
            'is_cancelled' => false,
        ];
    }
}
