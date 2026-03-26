<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthEtudiantController extends Controller
{

    // REGISTER
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [

            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',

            // correction ici
            'email' => 'required|email|unique:Etudiant,email',

            'motDePasse' => 'required|string|min:6',

        ], [

            'email.unique' => 'Cet email est déjà utilisé.',
            'motDePasse.min' => 'Le mot de passe doit avoir au moins 6 caractères.'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 422);
        }

        $etudiant = Etudiant::create([

            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,

            'motDePasse' => Hash::make($request->motDePasse),

            'statut' => 'actif',

            'dateInscription' => now(),
            'dateModification' => now()

        ]);

        $token = $etudiant->createToken('etudiant-token')->plainTextToken;

        return response()->json([

            'success' => 'Inscription réussie',

            'token' => $token,

            'etudiant' => [
                'id' => $etudiant->id,
                'nom' => $etudiant->nom,
                'prenom' => $etudiant->prenom,
                'email' => $etudiant->email
            ]

        ], 201);
    }

    // LOGIN

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [

            'email' => 'required|email',
            'motDePasse' => 'required|string'

        ]);

        if ($validator->fails()) {

            return response()->json([
                'error' => $validator->errors()->first()
            ], 422);

        }

        $etudiant = Etudiant::where('email', $request->email)->first();

        if (!$etudiant || !Hash::check($request->motDePasse, $etudiant->motDePasse)) {

            return response()->json([
                'error' => 'Email ou mot de passe incorrect'
            ], 401);

        }

        if ($etudiant->statut === 'suspendu') {

            return response()->json([
                'error' => 'Compte suspendu'
            ], 403);

        }

        $etudiant->tokens()->delete();

        $etudiant->update([
            'dernierLogin' => now()
        ]);

        $token = $etudiant->createToken('etudiant-token')->plainTextToken;

        return response()->json([

            'success' => 'Connexion réussie',

            'token' => $token,

            'etudiant' => [

                'id' => $etudiant->id,
                'nom' => $etudiant->nom,
                'prenom' => $etudiant->prenom,
                'email' => $etudiant->email

            ]

        ]);
    }

    // LOGOUT

    public function logout(Request $request)
    {

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => 'Déconnexion réussie'
        ]);
    }

    // PROFIL

    public function me(Request $request)
    {

        $e = $request->user();

        return response()->json([

            'id' => $e->id,
            'nom' => $e->nom,
            'prenom' => $e->prenom,
            'email' => $e->email,

            'telephone' => $e->telephone,

            'competences' => $e->competences_array,

            'photoProfil' => $e->photoProfil,

            'cv' => $e->cv,

            'progression' => $e->progression

        ]);
    }
}