<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    use HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'location_id',
        'day_of_week',
        'opens_at',
        'closes_at',
        'specific_date',
        'is_recurring',
        'is_cancelled',
    ];

    protected $casts = [
        'is_recurring' => 'boolean',
        'is_cancelled' => 'boolean',
        'specific_date' => 'date',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function scopeOpenToday(Builder $query, CarbonInterface $date): Builder
    {
        // Carbon: 0=Sunday, 1=Monday ... 6=Saturday
        // On aligne avec le cahier des charges : 0=Lun … 6=Dim
        // dayOfWeek Carbon : 0=Sun → on mappe : Lun=1→0, Mar=2→1 ... Dim=0→6
        $dayIndex = $date->dayOfWeek === 0 ? 6 : $date->dayOfWeek - 1;

        return $query->where('is_cancelled', false)
            ->where(function ($q) use ($date, $dayIndex) {
                $q->where(function ($q) use ($dayIndex) {
                    $q->where('is_recurring', true)
                        ->where('day_of_week', $dayIndex);
                })->orWhere(function ($q) use ($date) {
                    $q->where('is_recurring', false)
                        ->whereDate('specific_date', $date->toDateString());
                });
            });
    }

    public function scopeOpenNow(Builder $query): Builder
    {
        $now = now();

        return $query->openToday($now)
            ->where('opens_at', '<=', $now->toTimeString())
            ->where('closes_at', '>=', $now->toTimeString());
    }
}
