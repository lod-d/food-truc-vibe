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
            <style>
                .ns{font-family:system-ui,sans-serif;background:#F1EFE8;min-height:100vh;margin:0;padding:2rem 1rem;color:#2C2C2A;box-sizing:border-box}
                .ns-inner{max-width:900px;margin:0 auto}
                .ns-logo{font-size:1.4rem;font-weight:500;color:#D85A30;margin:0 0 .25rem}
                .ns-tagline{color:#6b6b68;margin:0 0 2rem;font-size:.95rem}
                .ns-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
                .ns-card{background:#fff;border:1px solid #D3D1C7;border-radius:8px;padding:1.5rem}
                .ns-card h2{font-size:.95rem;font-weight:500;margin:0 0 .6rem;color:#2C2C2A}
                .ns-card p{color:#6b6b68;font-size:.875rem;margin:0 0 1rem;line-height:1.55}
                .ns-btn{display:inline-block;background:#D85A30;color:#fff;text-decoration:none;padding:.35rem .85rem;border-radius:6px;font-size:.82rem;margin:0 .3rem .3rem 0}
                .ns-ex{margin:.85rem 0}
                .ns-ex b{display:block;font-size:.8rem;font-weight:500;margin-bottom:.3rem}
                .ns-code{background:#2C2C2A;color:#F1EFE8;padding:.45rem .75rem;border-radius:4px;font-family:monospace;font-size:.76rem;word-break:break-all;margin:0;white-space:pre-wrap}
                @media(max-width:600px){.ns-grid{grid-template-columns:1fr}}
            </style>
            <div class="ns">
                <div class="ns-inner">
                    <h1 class="ns-logo">🍔 TruckMap</h1>
                    <p class="ns-tagline">Annuaire de food trucks en France &mdash; disponibilit&eacute; en temps r&eacute;el</p>
                    <div class="ns-grid">
                        <div class="ns-card">
                            <h2>Ce site n&eacute;cessite JavaScript</h2>
                            <p>La carte interactive fonctionne avec JavaScript activ&eacute;. Sans JS, l&rsquo;API REST est disponible directement et retourne les donn&eacute;es en JSON.</p>
                            <a class="ns-btn" href="/api/trucks?open_now=1">Trucks ouverts maintenant</a>
                            <a class="ns-btn" href="/llms.txt">Documentation IA (llms.txt)</a>
                            <a class="ns-btn" href="/openapi.json">Sp&eacute;cification OpenAPI</a>
                        </div>
                        <div class="ns-card">
                            <h2>Exemples d&rsquo;appels API</h2>
                            <div class="ns-ex">
                                <b>Trucks ouverts en ce moment :</b>
                                <pre class="ns-code">GET /api/trucks?open_now=1</pre>
                            </div>
                            <div class="ns-ex">
                                <b>Food trucks en Bretagne :</b>
                                <pre class="ns-code">GET /api/trucks?lat=48.1173&amp;lng=-1.6778&amp;radius=100</pre>
                            </div>
                            <div class="ns-ex">
                                <b>Burgers &agrave; Paris :</b>
                                <pre class="ns-code">GET /api/trucks?cuisine=burger&amp;lat=48.8566&amp;lng=2.3522&amp;radius=25</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </noscript>
        <x-inertia::app />
    </body>
</html>
