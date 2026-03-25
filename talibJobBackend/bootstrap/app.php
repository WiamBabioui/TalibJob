<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. Indispensable pour Railway/Vercel : On fait confiance au Proxy
        // Cela permet à Laravel de reconnaître le HTTPS et de valider le CORS.
        $middleware->trustProxies(at: '*');

        // 2. Activer Sanctum pour les APIs (Gestion des cookies et sessions cross-domain)
        $middleware->statefulApi();

        // 3. Désactiver la protection CSRF pour toutes les routes API
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Gestion propre des erreurs JSON pour ton Frontend React
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Non authentifié.'], 401);
            }
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Ressource introuvable.'], 404);
            }
        });
    })->create();