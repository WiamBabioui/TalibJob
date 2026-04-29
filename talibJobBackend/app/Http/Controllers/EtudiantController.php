<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use App\Models\Candidature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
                'entrepriseLogo' => $m->entreprise->logo ?: null,
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
                    'poste'       => $etudiant->poste,
                    'email'       => $etudiant->email,
                    'telephone'   => $etudiant->telephone,
                    'competences' => $etudiant->competences_array,
                    'photoProfil' => $etudiant->photoProfil ?: null,
                    'cv'          => $etudiant->cv ?: null,
                ],
                'offres'      => $offres,
                'activite'    => $activite,
                'progression' => $etudiant->progression,
                'stats'       => $stats,
            ],
        ]);
    }

    // GET /api/etudiant/profil
    public function profil(Request $request)
    {
        $e = $request->user();

        return response()->json([
            'id'          => $e->id,
            'nom'         => $e->nom,
            'prenom'      => $e->prenom,
            'poste'       => $e->poste,
            'email'       => $e->email,
            'telephone'   => $e->telephone,
            'competences' => $e->competences_array,
            'photoProfil' => $e->photoProfil ?: null,
            'cv'          => $e->cv ?: null,
            'progression' => $e->progression,
        ]);
    }

    // PUT /api/etudiant/profil
    public function updateProfil(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'         => 'sometimes|string|max:100',
            'prenom'      => 'sometimes|string|max:100',
            'poste'       => 'sometimes|string|max:100',
            'telephone'   => 'sometimes|string|max:20',
            'competences' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $request->user()->update(
            array_merge(
                $request->only(['nom', 'prenom', 'poste', 'telephone', 'competences']),
                ['dateModification' => now()]
            )
        );

        return response()->json(['success' => 'Profil mis à jour !']);
    }

    // POST /api/etudiant/upload-cv
    public function uploadCv(Request $request)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:5120']);

        // Upload sur Cloudinary (raw pour les PDFs)
        $result = Cloudinary::uploadFile(
            $request->file('cv')->getRealPath(),
            [
                'folder'        => 'talibjob/cvs',
                'resource_type' => 'raw',
                'public_id'     => 'cv_' . $request->user()->id . '_' . time(),
            ]
        );

        $url = $result->getSecurePath();

        $request->user()->update([
            'cv'               => $url,
            'dateModification' => now(),
        ]);

        return response()->json([
            'success' => 'CV uploadé !',
            'cv'      => $url,
            'cvUrl'   => $url,
        ]);
    }

    // POST /api/etudiant/upload-photo
    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:2048']);

        // Upload sur Cloudinary
        $result = Cloudinary::upload(
            $request->file('photo')->getRealPath(),
            [
                'folder'    => 'talibjob/photos',
                'public_id' => 'photo_' . $request->user()->id . '_' . time(),
                'overwrite' => true,
            ]
        );

        $url = $result->getSecurePath();

        $request->user()->update([
            'photoProfil'      => $url,
            'dateModification' => now(),
        ]);

        return response()->json([
            'success' => 'Photo mise à jour !',
            'photo'   => $url,
        ]);
    }

    // Télécharger CV
    public function downloadCv(Request $request)
    {
        $etudiant = $request->user();

        if (!$etudiant->cv) {
            return response()->json(['error' => 'Aucun CV disponible.'], 404);
        }

        // Avec Cloudinary, on redirige directement vers l'URL
        return response()->json(['url' => $etudiant->cv]);
    }

    // PUT /api/etudiant/parametres
    public function parametres(Request $request)
    {
        $etudiant = $request->user();

        $rules = [
            'nom'         => 'sometimes|string|max:100',
            'prenom'      => 'sometimes|string|max:100',
            'telephone'   => 'sometimes|nullable|string|max:20',
            'newPassword' => 'sometimes|nullable|string|min:6',
        ];

        if ($request->filled('email') && $request->email !== $etudiant->email) {
            $rules['email'] = 'email|unique:Etudiant,email';
        }

        $validator = Validator::make($request->all(), $rules, [
            'email.unique' => 'Cet email est déjà utilisé par un autre compte.',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = ['dateModification' => now()];
        if ($request->filled('nom'))       $data['nom']       = $request->nom;
        if ($request->filled('prenom'))    $data['prenom']    = $request->prenom;
        if ($request->filled('telephone')) $data['telephone'] = $request->telephone;
        if ($request->filled('email'))     $data['email']     = $request->email;
        if ($request->filled('newPassword')) {
            $data['motDePasse'] = Hash::make($request->newPassword);
        }

        $etudiant->update($data);
        $etudiant->refresh();

        return response()->json([
            'success'  => 'Paramètres enregistrés avec succès !',
            'etudiant' => [
                'id'        => $etudiant->id,
                'nom'       => $etudiant->nom,
                'prenom'    => $etudiant->prenom,
                'email'     => $etudiant->email,
                'telephone' => $etudiant->telephone,
            ],
        ]);
    }

    // DELETE /api/etudiant/compte
    public function supprimerCompte(Request $request)
    {
        $etudiant = $request->user();
        $etudiant->tokens()->delete();
        $etudiant->delete();
        return response()->json(['success' => 'Compte étudiant supprimé avec succès.']);
    }
}