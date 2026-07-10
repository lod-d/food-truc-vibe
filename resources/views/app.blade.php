<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">

        <meta name="description" content="TruckMap – Carte interactive des food trucks en France. Disponibilité en temps réel, horaires, 10 types de cuisine. API publique disponible.">

        <meta property="og:type" content="website">
        <meta property="og:title" content="TruckMap – Food trucks ouverts près de vous">
        <meta property="og:description" content="Trouvez les food trucks ouverts autour de vous en France. Carte interactive et horaires en temps réel.">
        <meta property="og:url" content="{{ config('app.url') }}">

        <link type="text/plain" rel="help" href="/llms.txt">
        <link type="application/json" rel="alternate" href="/openapi.json">

        @vite(['resources/css/app.css', 'resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <noscript>
            <div style="font-family:sans-serif;max-width:600px;margin:2rem auto;padding:1rem">
                <h1>TruckMap</h1>
                <p>Annuaire de food trucks en France avec localisation et horaires en temps réel.</p>
                <p>Ce site nécessite JavaScript. Pour accéder aux données sans JS :</p>
                <ul>
                    <li><a href="/api/trucks?open_now=1">Trucks ouverts maintenant (JSON)</a></li>
                    <li><a href="/llms.txt">Documentation API pour les IAs</a></li>
                    <li><a href="/openapi.json">Spécification OpenAPI</a></li>
                </ul>
            </div>
        </noscript>
        <x-inertia::app />
    </body>
</html>
