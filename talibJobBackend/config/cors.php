<?php
return [
    'paths'                    => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => [
        'https://talib-job.vercel.app',
        'https://talib-job-*.vercel.app',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_origins_patterns' => ['#^https://talib-job.*\.vercel\.app$#'],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => false,
];