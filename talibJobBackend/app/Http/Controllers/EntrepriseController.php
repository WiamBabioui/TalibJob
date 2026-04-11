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

        // Révoquer tous les tokens
        $entreprise->tokens()->delete();

        // Supprimer le compte (cascade supprime les missions et candidatures)
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
                'statut_label'     => $c->statut_label,
                'badgeColor'       => $c->badge_color,
                'lettreMotivation' => $c->lettreMotivation,
                'dateEnvoi'        => $c->dateEnvoi->format('d/m/Y'),
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

    // PUT /api/entreprise/candidatures/{id}/statut
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut'                => 'required|in:vue,acceptee,refusee',
            'commentaireEntreprise' => 'nullable|string',
        ]);

        $candidature = Candidature::whereHas('mission',
            fn($q) => $q->where('idEntreprise', $request->user()->id)
        )->findOrFail($id);

        $candidature->update([
            'statut'                => $request->statut,
            'commentaireEntreprise' => $request->commentaireEntreprise,
            'dateReponse'           => now(),
        ]);

        return response()->json(['success' => 'Statut mis à jour !']);
    }
    public function toutesLesCandidatures(Request $request)
{
    // Récupère l'entreprise connectée
    $entreprise = $request->user();

    // Récupère toutes les candidatures liées aux missions de cette entreprise
    return \App\Models\Candidature::whereIn('mission_id', $entreprise->missions()->pluck('id'))
        ->with(['etudiant', 'mission']) // 'mission' pour savoir de quel job il s'agit
        ->latest()
        ->get();
}
}
