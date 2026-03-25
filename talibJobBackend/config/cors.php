<?php

return [
   'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://talib-job.vercel.app', 
        'http://localhost:5173'
    ],
    // Autorise les URLs de test de Vercel (avec des codes aléatoires)
    'allowed_origins_patterns' => ['#^https://talib-.*\.vercel\.app$#'], 
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
