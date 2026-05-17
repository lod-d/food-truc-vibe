<?php

namespace App\Http\Controllers;

use App\Models\Cuisine;
use Illuminate\Http\JsonResponse;

class CuisineController extends Controller
{
    public function index(): JsonResponse
    {
        $cuisines = Cuisine::select('id', 'name', 'slug', 'emoji')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $cuisines]);
    }
}
