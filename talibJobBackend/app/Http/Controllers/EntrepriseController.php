<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use App\Models\Candidature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EntrepriseController extends Controller
{
    // GET /api/entreprise/dashboard
    public function dashboard(Request $request)
    {
        $entreprise = $request->user();

        $totalCandidatures = Candidature::whereHas('mission',
            fn($q) => $q->where('idEntreprise', $entreprise->id)
        )->count();

        $stats = [
            'offres_actives'       => Mission::where('idEntreprise', $entreprise->id)->where('statut', 'active')->count(),
            'candidatures_totales' => $totalCandidatures,
            'vues_totales'         => Mission::where('idEntreprise', $entreprise->id)->sum('vues'),
            'nouveaux_candidats'   => Candidature::whereHas('mission',
                fn($q) => $q->where('idEntreprise', $entreprise->id)
            )->where('dateEnvoi', '>=', now()->subWeek())->count(),
        ];

        $offres = Mission::where('idEntreprise', $entreprise->id)
            ->withCount('candidatures')
            ->orderByDesc('dateCreation')
            ->limit(6)
            ->get()
            ->map(fn($m) => [
                'id'                 => $m->id,
                'titre'              => $m->titre,
                'statut'             => $m->statut,
                'nombreCandidatures' => $m->candidatures_count,
                'vues'               => $m->vues,
                'derniereMaj'        => $m->dateModification?->diffForHumans(),
            ]);

        $activites = Candidature::with(['etudiant', 'mission'])
            ->whereHas('mission', fn($q) => $q->where('idEntreprise', $entreprise->id))
            ->orderByDesc('dateEnvoi')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'texte' => "Candidature de {$c->etudiant->prenom} {$c->etudiant->nom} pour '{$c->mission->titre}'",
                'date'  => $c->dateEnvoi->diffForHumans(),
                'type'  => 'candidature',
            ]);

        return response()->json([
            'success'    => true,
            'entreprise' => ['id' => $entreprise->id, 'nom' => $entreprise->nom],
            'stats'      => $stats,
            'offres'     => $offres,
            'activites'  => $activites,
        ]);
    }

    // PUT /api/entreprise/parametres
    public function parametres(Request $request)
    {
        $entreprise = $request->user();

        $rules = [
            'nom'         => 'sometimes|string|max:100',
            'telephone'   => 'sometimes|nullable|string|max:20',
            'newPassword' => 'sometimes|nullable|string|min:6',
        ];

        if ($request->filled('email') && $request->email !== $entreprise->email) {
            $rules['email'] = 'email|unique:Entreprise,email';
        }

        $validator = Validator::make($request->all(), $rules, [
            'email.unique' => 'Cet email est déjà utilisé par un autre compte.',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = ['dateModification' => now()];
        if ($request->filled('nom'))       $data['nom']       = $request->nom;
        if ($request->filled('telephone')) $data['telephone'] = $request->telephone;
        if ($request->filled('email'))     $data['email']     = $request->email;
        if ($request->filled('newPassword')) {
            $data['motDePasse'] = Hash::make($request->newPassword);
        }

        $entreprise->update($data);
        $entreprise->refresh();

        return response()->json([
            'success'    => 'Paramètres enregistrés avec succès !',
            'entreprise' => [
                'id'        => $entreprise->id,
                'nom'       => $entreprise->nom,
                'email'     => $entreprise->email,
                'telephone' => $entreprise->telephone,
            ],
        ]);
    }

    // DELETE /api/entreprise/compte
    public function supprimerCompte(Request $request)
    {
        $entreprise = $request->user();
        $entreprise->tokens()->delete();
        $entreprise->delete();
        return response()->json(['success' => 'Compte entreprise supprimé avec succès.']);
    }

    // GET /api/entreprise/missions/{id}/candidatures
    public function candidaturesMission(Request $request, $id)
    {
        $mission = Mission::where('idEntreprise', $request->user()->id)->findOrFail($id);

        $candidatures = Candidature::with('etudiant')
            ->where('idMission', $id)
            ->orderByDesc('dateEnvoi')
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'statut'           => $c->statut,
                'lettreMotivation' => $c->lettreMotivation,
                'date'             => $c->dateEnvoi->format('d/m/Y'),
                'etudiant'         => [
                    'id'          => $c->etudiant->id,
                    'nom'         => $c->etudiant->nom,
                    'prenom'      => $c->etudiant->prenom,
                    'email'       => $c->etudiant->email,
                    'telephone'   => $c->etudiant->telephone,
                    'competences' => $c->etudiant->competences_array,
                    'cv'          => $c->etudiant->cv,
                ],
            ]);

        return response()->json([
            'mission'      => ['id' => $mission->id, 'titre' => $mission->titre],
            'candidatures' => $candidatures,
        ]);
    }

    // GET /api/entreprise/candidatures (Bouton général)
    public function toutesLesCandidatures(Request $request)
    {
        $entreprise = $request->user();
        $candidatures = Candidature::with(['etudiant', 'mission'])
            ->whereHas('mission', fn($q) => $q->where('idEntreprise', $entreprise->id))
            ->orderByDesc('dateEnvoi')
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'statut'           => $c->statut,
                'lettreMotivation' => $c->lettreMotivation,
                'date'             => $c->dateEnvoi->format('d/m/Y'),
                'mission'          => ['titre' => $c->mission->titre],
                'etudiant'         => [
                    'id'          => $c->etudiant->id,
                    'nom'         => $c->etudiant->nom,
                    'prenom'      => $c->etudiant->prenom,
                    'email'       => $c->etudiant->email,
                    'telephone'   => $c->etudiant->telephone,
                    'competences' => $c->etudiant->competences_array,
                    'cv'          => $c->etudiant->cv,
                ],
            ]);

        return response()->json($candidatures);
    }

    // ✅ FONCTION AJOUTÉE ET CORRIGÉE
    public function updateStatut(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:vue,acceptee,refusee',
            'commentaireEntreprise' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            // Vérification que la candidature appartient bien à une mission de cette entreprise
            $candidature = Candidature::whereHas('mission', function($q) use ($request) {
                $q->where('idEntreprise', $request->user()->id);
            })->findOrFail($id);

            // Mise à jour manuelle car $timestamps = false dans le modèle
            $candidature->update([
                'statut' => $request->statut,
                'commentaireEntreprise' => $request->commentaireEntreprise,
                'dateReponse' => now(),
            ]);

            return response()->json(['success' => 'Statut mis à jour avec succès !']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour : ' . $e->getMessage()], 500);
        }
    }
}