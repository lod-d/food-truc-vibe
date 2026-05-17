<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre truck est en ligne</title>
    <style>
        body { font-family: 'Inter', -apple-system, sans-serif; background: #F1EFE8; margin: 0; padding: 32px 16px; color: #2C2C2A; }
        .card { background: #fff; border-radius: 12px; border: 1px solid #D3D1C7; max-width: 480px; margin: 0 auto; padding: 32px; }
        .logo { font-size: 24px; margin-bottom: 24px; }
        h1 { font-size: 20px; font-weight: 500; margin: 0 0 8px; }
        p { font-size: 14px; color: #888780; line-height: 1.6; margin: 0 0 16px; }
        .truck-name { font-weight: 500; color: #2C2C2A; }
        .cta { display: inline-block; background: #D85A30; color: #fff; text-decoration: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 500; margin-top: 8px; }
        .footer { font-size: 12px; color: #D3D1C7; margin-top: 24px; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">🚚</div>
        <h1>Votre truck est en ligne !</h1>
        <p>
            Félicitations — <span class="truck-name">{{ $truck->name }}</span> est désormais visible sur TruckMap.
            Les gourmands autour de vous peuvent maintenant vous trouver.
        </p>
        <p>Pensez à vérifier vos horaires et votre emplacement pour que tout soit à jour.</p>
        <a href="{{ url('/') }}" class="cta">Voir la carte →</a>
        <div class="footer">TruckMap · Vous recevez cet email car vous avez enregistré votre truck.</div>
    </div>
</body>
</html>
