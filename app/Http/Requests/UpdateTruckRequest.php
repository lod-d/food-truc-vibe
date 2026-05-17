<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateTruckRequest extends FormRequest
{
    public function authorize(): bool
    {
        $truck = $this->route('truck');
        return $truck && $truck->user_id === Auth::id();
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'cuisine_id'    => ['required', 'string', 'exists:cuisines,id'],
            'description'   => ['nullable', 'string', 'max:1000'],
            'email'         => ['nullable', 'email', 'max:255'],
            'phone'         => ['nullable', 'string', 'max:30'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'photo'         => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'address'       => ['required', 'string', 'max:255'],
            'city'          => ['required', 'string', 'max:100'],
            'latitude'      => ['required', 'numeric', 'between:-90,90'],
            'longitude'     => ['required', 'numeric', 'between:-180,180'],
            'place_name'    => ['nullable', 'string', 'max:255'],
            'days'          => ['required', 'array', 'min:1'],
            'days.*'        => ['integer', 'between:0,6'],
            'opens_at'      => ['required', 'date_format:H:i'],
            'closes_at'     => ['required', 'date_format:H:i', 'after:opens_at'],
            'is_recurring'  => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => 'Le nom du food truck est obligatoire.',
            'cuisine_id.required' => 'Sélectionnez un type de cuisine.',
            'latitude.required'  => 'Placez le truck sur la carte.',
            'days.required'      => 'Sélectionnez au moins un jour.',
            'closes_at.after'    => "L'heure de fermeture doit être après l'heure d'ouverture.",
        ];
    }
}
