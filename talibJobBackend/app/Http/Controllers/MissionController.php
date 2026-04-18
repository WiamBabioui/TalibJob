<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use App\Models\Candidature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MissionController extends Controller
{
    // GET /api/missions  (liste publique avec filtres)
    public function index(Request $request)
    {
        $query = Mission::with('entreprise')->active();

        if ($request->filled('q'))      $query->search($request->q);
        if ($request->filled('ville'))  $query->where('lieu', 'like', '%'.$request->ville.'%');
        if ($request->filled('type'))   $query->where('type', $request->type);

        $missions = $query->orderByDesc('datePublication')
            ->paginate(9)
            ->through(fn($m) => [
                'id'              => $m->id,
                'titre'           => $m->titre,
                'type'            => $m->type,
                'remuneration'    => $m->remuneration,
                'lieu'            => $m->lieu,
                'entreprise'      => ['id' => $m->entreprise->id, 'nom' => $m->entreprise->nom, 'logo' => $m->entreprise->logo ? asset('storage/' . $m->entreprise->logo) : null],
                'datePublication' => $m->datePublication?->diffForHumans(),
                'vues'            => $m->vues,
            ]);

        return response()->json($missions);
    }

    // GET /api/missions/{id}  (détail public)
    public function show($id)
    {
        $mission = Mission::with('entreprise')->findOrFail($id);
        $mission->increment('vues');

        return response()->json([
            'id'                  => $mission->id,
            'titre'               => $mission->titre,
            'description'         => $mission->description,
            'type'                => $mission->type,
            'competencesRequises' => $mission->competencesRequises,
            'duree'               => $mission->duree,
            'remuneration'        => $mission->remuneration,
            'lieu'                => $mission->lieu,
            'dateDebut'           => $mission->dateDebut?->format('d/m/Y'),
            'dateFin'             => $mission->dateFin?->format('d/m/Y'),
            'statut'              => $mission->statut,
            'nombreCandidatures'  => $mission->nombreCandidatures,
            'vues'                => $mission->vues,
            'datePublication'     => $mission->datePublication?->format('d/m/Y'),
            'entreprise'          => [
                'id'          => $mission->entreprise->id,
                'nom'         => $mission->entreprise->nom,
                'secteur'     => $mission->entreprise->secteur,
                'description' => $mission->entreprise->description,
                'logo'        => $mission->entreprise->logo ? asset('storage/' . $mission->entreprise->logo) : null,
                'siteWeb'     => $mission->entreprise->siteWeb,
            ],
        ]);
    }

    // POST /api/etudiant/missions/{id}/postuler  (protégé étudiant)
    public function postuler(Request $request, $id)
    {
        $etudiant = $request->user();
        $mission  = Mission::findOrFail($id);

        $deja = Candidature::where('idEtudiant', $etudiant->id)
            ->where('idMission', $id)->exists();

        if ($deja) {
            return response()->json(['error' => 'Vous avez déjà postulé à cette offre.'], 409);
        }

        Candidature::create([
            'idEtudiant'       => $etudiant->id,
            'idMission'        => $id,
            'lettreMotivation' => $request->lettreMotivation,
            'statut'           => 'en_attente',
            'dateEnvoi'        => now(),
        ]);

        $mission->increment('nombreCandidatures');

        return response()->json(['success' => 'Candidature envoyée avec succès !'], 201);
    }

    // POST /api/entreprise/missions  (protégé entreprise)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre'       => 'required|string|max:150',
            'description' => 'required|string',
            'type'        => 'required|string',
            'lieu'        => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $mission = Mission::create([
            'idEntreprise'        => $request->user()->id,
            'titre'               => $request->titre,
            'description'         => $request->description,
            'type'                => $request->type,
            'competencesRequises' => $request->competencesRequises,
            'remuneration'        => $request->remuneration,
            'lieu'                => $request->lieu,
            'duree'               => $request->duree,
            'dateDebut'           => $request->dateDebut,
            'dateFin'             => $request->dateFin,
            'statut'              => $request->statut ?? 'brouillon',
            'datePublication'     => ($request->statut === 'active') ? now() : null,
            'dateCreation'        => now(),
            'dateModification'    => now(),
        ]);

        return response()->json(['success' => 'Offre publiée !', 'mission' => $mission], 201);
    }

    // GET /api/entreprise/missions  (mes offres - protégé entreprise)
    public function mesOffres(Request $request)
    {
        $offres = Mission::where('idEntreprise', $request->user()->id)
            ->withCount('candidatures')
            ->orderByDesc('dateCreation')
            ->get()
            ->map(fn($m) => [
                'id'                 => $m->id,
                'titre'              => $m->titre,
                'type'               => $m->type,
                'lieu'               => $m->lieu,
                'statut'             => $m->statut,
                'nombreCandidatures' => $m->candidatures_count,
                'vues'               => $m->vues,
            ]);

        return response()->json($offres);
    }

    // GET /api/entreprise/missions/{id}  (détail d'une offre - protégé entreprise)
    public function showEntreprise(Request $request, $id)
    {
        $mission = Mission::where('idEntreprise', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'id'                  => $mission->id,
            'titre'               => $mission->titre,
            'description'         => $mission->description,
            'type'                => $mission->type,
            'competencesRequises' => $mission->competencesRequises,
            'remuneration'        => $mission->remuneration,
            'lieu'                => $mission->lieu,
            'statut'              => $mission->statut,
            'dateExpiration'      => $mission->dateFin?->format('Y-m-d'),
            'vues'                => $mission->vues,
        ]);
    }

    // PUT /api/entreprise/missions/{id}  (modifier une offre - protégé entreprise)
    public function update(Request $request, $id)
    {
        $mission = Mission::where('idEntreprise', $request->user()->id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre'       => 'required|string|max:150',
            'description' => 'required|string',
            'type'        => 'required|string',
            'lieu'        => 'required|string|max:100',
            'statut'      => 'sometimes|in:active,brouillon,fermee,pourvue',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $mission->update([
            'titre'               => $request->titre,
            'description'         => $request->description,
            'type'                => $request->type,
            'competencesRequises' => $request->competencesRequises,
            'remuneration'        => $request->remuneration,
            'lieu'                => $request->lieu,
            'statut'              => $request->statut ?? $mission->statut,
            'dateModification'    => now(),
        ]);

        return response()->json(['success' => 'Offre modifiée avec succès !', 'mission' => $mission]);
    }

    // DELETE /api/entreprise/missions/{id}  (supprimer une offre - protégé entreprise)
    public function destroy(Request $request, $id)
    {
        $mission = Mission::where('idEntreprise', $request->user()->id)
            ->findOrFail($id);

        $mission->delete();

        return response()->json(['success' => 'Offre supprimée avec succès !']);
    }

}