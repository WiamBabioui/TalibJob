<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://talib-job.vercel.app', // TON URL PRINCIPALE
        'http://localhost:5173',        // LOCAL
    ],
    // Cette ligne permet d'accepter TOUTES les URLs de test de Vercel (celles avec des codes)
    'allowed_origins_patterns' => ['#^https://talib-.*\.vercel\.app$#'], 
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // On remet à true pour que tes tokens passent
];