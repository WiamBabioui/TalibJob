<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthEtudiantController;
use App\Http\Controllers\AuthEntrepriseController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\MissionController;
use App\Http\Controllers\AuthController;


/*
|--------------------------------------------------------------------------
| Routes publiques
|--------------------------------------------------------------------------
*/
Route::prefix('etudiant')->group(function () {
    Route::post('/register', [AuthEtudiantController::class, 'register']);
    Route::post('/login',    [AuthEtudiantController::class, 'login']);
});

Route::prefix('entreprise')->group(function () {
    Route::post('/register', [AuthEntrepriseController::class, 'register']);
    Route::post('/login',    [AuthEntrepriseController::class, 'login']);
});

// Offres publiques (visibles sans connexion)
Route::get('/missions',      [MissionController::class, 'index']);
Route::get('/missions/{id}', [MissionController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Routes protégées — Étudiant
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('etudiant')->group(function () {
    Route::post('/logout',                 [AuthEtudiantController::class, 'logout']);
    Route::get('/me',                      [AuthEtudiantController::class, 'me']);

    Route::get('/dashboard',               [EtudiantController::class,    'dashboard']);
    Route::get('/candidatures',            [EtudiantController::class,    'mesCandidatures']);

    Route::get('/profil',                  [EtudiantController::class,    'profil']);
    Route::put('/profil',                  [EtudiantController::class,    'updateProfil']);
    Route::put('/parametres',              [EtudiantController::class,    'parametres']);
    Route::delete('/compte',               [EtudiantController::class,    'supprimerCompte']);

    Route::post('/upload-cv',              [EtudiantController::class,    'uploadCv']);
    Route::post('/upload-photo',           [EtudiantController::class,    'uploadPhoto']);
    Route::get('/download-cv',             [EtudiantController::class,    'downloadCv']);   // ✅ manquait

    Route::post('/missions/{id}/postuler', [MissionController::class,     'postuler']);
});

/*
|--------------------------------------------------------------------------
| Routes protégées — Entreprise
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('entreprise')->group(function () {
    Route::post('/logout',   [AuthEntrepriseController::class, 'logout']);
    Route::get('/me',        [AuthEntrepriseController::class, 'me']);

    Route::get('/dashboard', [EntrepriseController::class,    'dashboard']);
    Route::put('/parametres',[EntrepriseController::class,    'parametres']);
    Route::delete('/compte', [EntrepriseController::class,    'supprimerCompte']);

    Route::get('/missions',          [MissionController::class,   'mesOffres']);
    Route::post('/missions',         [MissionController::class,   'store']);
    Route::get('/missions/{id}',     [MissionController::class,   'showEntreprise']);  // ✅ manquait
    Route::put('/missions/{id}',     [MissionController::class,   'update']);          // ✅ bonus : modifier une offre
    Route::delete('/missions/{id}',  [MissionController::class,   'destroy']);         // ✅ bonus : supprimer une offre

    Route::get('/missions/{id}/candidatures', [EntrepriseController::class, 'candidaturesMission']);
    Route::put('/candidatures/{id}/statut',   [EntrepriseController::class, 'updateStatut']);
});
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);