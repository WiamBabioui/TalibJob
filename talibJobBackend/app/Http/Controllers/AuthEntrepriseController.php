<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthEntrepriseController extends Controller
{
    // POST /api/entreprise/register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nomEntreprise' => 'required|string|max:100',
            'email'         => 'required|email|unique:Entreprise,email',
            'motDePasse'    => 'required|string|min:6',
        ], [
            'email.unique'    => 'Cet email est déjà utilisé.',
            'motDePasse.min'  => 'Le mot de passe doit avoir au moins 6 caractères.',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $entreprise = Entreprise::create([
            'nom'              => $request->nomEntreprise,
            'email'            => $request->email,
            'motDePasse'       => Hash::make($request->motDePasse),
            'statut'           => 'en_attente_validation',
            'dateInscription'  => now(),
            'dateModification' => now(),
        ]);

        $token = $entreprise->createToken('entreprise-token')->plainTextToken;

        return response()->json([
            'success'    => 'Inscription réussie !',
            'token'      => $token,
            'entreprise' => [
                'id'    => $entreprise->id,
                'nom'   => $entreprise->nom,
                'email' => $entreprise->email,
            ],
        ], 201);
    }

    // POST /api/entreprise/login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'      => 'required|email',
            'motDePasse' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $entreprise = Entreprise::where('email', $request->email)->first();

        if (!$entreprise || !Hash::check($request->motDePasse, $entreprise->motDePasse)) {
            return response()->json(['error' => 'Email ou mot de passe incorrect.'], 401);
        }

        $entreprise->tokens()->delete();
        $entreprise->update(['dernierLogin' => now()]);

        $token = $entreprise->createToken('entreprise-token')->plainTextToken;

        return response()->json([
            'success'    => 'Connexion réussie !',
            'token'      => $token,
            'entreprise' => [
                'id'    => $entreprise->id,
                'nom'   => $entreprise->nom,
                'email' => $entreprise->email,
            ],
        ]);
    }

    // POST /api/entreprise/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => 'Déconnexion réussie.']);
    }

    // GET /api/entreprise/me
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
