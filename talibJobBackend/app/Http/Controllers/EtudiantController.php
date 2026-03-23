<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use App\Models\Candidature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EtudiantController extends Controller
{
    // GET /api/etudiant/dashboard
    public function dashboard(Request $request)
    {
        $etudiant = $request->user();

        $offres = Mission::with('entreprise')
            ->active()
            ->orderByDesc('datePublication')
            ->limit(5)
            ->get()
            ->map(fn($m) => [
                'id'           => $m->id,
                'titre'        => $m->titre,
                'type'         => $m->type,
                'remuneration' => $m->remuneration,
                'lieu'         => $m->lieu,
                'entreprise'   => $m->entreprise->nom,
            ]);

        $activite = Candidature::with('mission')
            ->where('idEtudiant', $etudiant->id)
            ->orderByDesc('dateEnvoi')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'action' => match($c->statut) {
                    'en_attente' => 'Candidature envoyée – ',
                    'vue'        => 'Candidature vue – ',
                    'acceptee'   => 'Candidature acceptée – ',
                    'refusee'    => 'Candidature refusée – ',
                    default      => 'Candidature – ',
                } . $c->mission->titre,
                'date' => $c->dateEnvoi->format('d/m/Y H:i'),
            ]);

        $stats = Candidature::where('idEtudiant', $etudiant->id)
            ->selectRaw("
                COUNT(*)                       AS total,
                SUM(statut = 'acceptee')       AS acceptees,
                SUM(statut = 'refusee')        AS refusees,
                SUM(statut = 'en_attente')     AS en_attente
            ")
            ->first();

        return response()->json([
            'success' => true,
            'data'    => [
                'profil' => [
                    'id'          => $etudiant->id,
                    'nom'         => $etudiant->nom,
                    'prenom'      => $etudiant->prenom,
                    'email'       => $etudiant->email,
                    'telephone'   => $etudiant->telephone,
                    'competences' => $etudiant->competences_array,
                    'photoProfil' => $etudiant->photoProfil,
                    'cv'          => $etudiant->cv,
                ],
                'offres'      => $offres,
                'activite'    => $activite,
                'progression' => $etudiant->progression,
                'stats'       => $stats,
            ],
        ]);
    }

    // GET /api/etudiant/candidatures
    public function mesCandidatures(Request $request)
    {
        $candidatures = Candidature::with(['mission.entreprise'])
            ->where('idEtudiant', $request->user()->id)
            ->orderByDesc('dateEnvoi')
            ->get()
            ->map(fn($c) => [
                'id'         => $c->id,
                'missionId'  => $c->idMission,
                'poste'      => $c->mission->titre,
                'entreprise' => $c->mission->entreprise->nom,
                'lieu'       => $c->mission->lieu,
                'date'       => $c->dateEnvoi->format('d/m/Y'),
                'statut'     => $c->statut,
                'lettreMotivation' => $c->lettreMotivation,
            ]);

        return response()->json($candidatures);
    }

    // GET /api/etudiant/profil
    public function profil(Request $request)
    {
        $e = $request->user();
        return response()->json([
            'id'          => $e->id,
            'nom'         => $e->nom,
            'prenom'      => $e->prenom,
            'email'       => $e->email,
            'telephone'   => $e->telephone,
            'competences' => $e->competences_array,
            'photoProfil' => $e->photoProfil
                ? asset('storage/' . $e->photoProfil)
                : null,
            'cv'          => $e->cv,
            'progression' => $e->progression,
        ]);
    }

    // PUT /api/etudiant/profil
    public function updateProfil(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'         => 'sometimes|string|max:100',
            'prenom'      => 'sometimes|string|max:100',
            'telephone'   => 'sometimes|string|max:20',
            'competences' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $request->user()->update(
            array_merge(
                $request->only(['nom', 'prenom', 'telephone', 'competences']),
                ['dateModification' => now()]
            )
        );

        return response()->json(['success' => 'Profil mis à jour !']);
    }

    // PUT /api/etudiant/parametres
    public function parametres(Request $request)
    {
        $etudiant = $request->user();

        $validator = Validator::make($request->all(), [
            'nom'         => 'sometimes|string|max:100',
            'prenom'      => 'sometimes|string|max:100',  // ✅ ajouté
            'email'       => 'sometimes|email|unique:Etudiant,email,' . $etudiant->id,
            'telephone'   => 'sometimes|string|max:20',
            'newPassword' => 'sometimes|string|min:6',
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        // ✅ inclure prenom dans la mise à jour
        $data = $request->only(['nom', 'prenom', 'email', 'telephone']);
        $data['dateModification'] = now();

        if ($request->filled('newPassword')) {
            $data['motDePasse'] = Hash::make($request->newPassword);
        }

        $etudiant->update($data);

        return response()->json(['success' => 'Paramètres enregistrés !']);
    }

    // POST /api/etudiant/upload-cv
    public function uploadCv(Request $request)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:5120']);

        $path = $request->file('cv')->store('cvs', 'public');
        $request->user()->update([
            'cv'               => $path,
            'dateModification' => now(),
        ]);

        return response()->json(['success' => 'CV uploadé !', 'cv' => $path]);
    }

    // POST /api/etudiant/upload-photo
    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:2048']);

        $path = $request->file('photo')->store('photos', 'public');
        $request->user()->update([
            'photoProfil'      => $path,
            'dateModification' => now(),
        ]);

        return response()->json(['success' => 'Photo mise à jour !', 'photo' => asset('storage/' . $path)]);
    }

    // GET /api/etudiant/download-cv
    public function downloadCv(Request $request)
    {
        $etudiant = $request->user();

        if (!$etudiant->cv) {
            return response()->json(['error' => 'Aucun CV disponible.'], 404);
        }

        $path = storage_path('app/public/' . $etudiant->cv);

        if (!file_exists($path)) {
            return response()->json(['error' => 'Fichier introuvable.'], 404);
        }

        return response()->download($path, 'CV_' . $etudiant->nom . '_' . $etudiant->prenom . '.pdf');
    }

    // DELETE /api/etudiant/compte
    public function supprimerCompte(Request $request)
    {
        $etudiant = $request->user();
        $etudiant->tokens()->delete();
        $etudiant->delete();

        return response()->json(['success' => 'Compte supprimé.']);
    }
}