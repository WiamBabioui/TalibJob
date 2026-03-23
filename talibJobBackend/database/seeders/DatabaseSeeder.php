<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // ── Étudiants de test ──────────────────────────────────────
        DB::table('Etudiant')->insert([
            [
                'nom'              => 'Alaoui',
                'prenom'           => 'Youssef',
                'email'            => 'youssef@etu.ma',
                'motDePasse'       => Hash::make('123456'),
                'telephone'        => '0612345678',
                'competences'      => 'React,PHP,Laravel,MySQL,JavaScript',
                'statut'           => 'actif',
                'dateInscription'  => $now,
                'dateModification' => $now,
            ],
            [
                'nom'              => 'Benali',
                'prenom'           => 'Sara',
                'email'            => 'sara@etu.ma',
                'motDePasse'       => Hash::make('123456'),
                'telephone'        => '0698765432',
                'competences'      => 'Marketing Digital,Canva,Social Media',
                'statut'           => 'actif',
                'dateInscription'  => $now,
                'dateModification' => $now,
            ],
        ]);

        // ── Entreprises de test ────────────────────────────────────
        DB::table('Entreprise')->insert([
            [
                'nom'              => 'Tech Innov SARL',
                'email'            => 'rh@techinnov.ma',
                'motDePasse'       => Hash::make('123456'),
                'secteur'          => 'Informatique',
                'description'      => 'Société spécialisée dans le développement de solutions web et mobiles.',
                'statut'           => 'actif',
                'emailVerifie'     => true,
                'dateInscription'  => $now,
                'dateModification' => $now,
            ],
            [
                'nom'              => 'Creative Minds Agency',
                'email'            => 'contact@creativeminds.ma',
                'motDePasse'       => Hash::make('123456'),
                'secteur'          => 'Marketing & Communication',
                'description'      => 'Agence de communication digitale basée à Casablanca.',
                'statut'           => 'actif',
                'emailVerifie'     => true,
                'dateInscription'  => $now,
                'dateModification' => $now,
            ],
        ]);

        // ── Missions de test ───────────────────────────────────────
        DB::table('Mission')->insert([
            [
                'idEntreprise'        => 1,
                'titre'               => 'Développeur Front-end React',
                'description'         => "Rejoignez notre équipe pour développer des interfaces modernes.\n\nResponsabilités :\n- Développer des composants React réutilisables\n- Collaborer avec l'équipe back-end\n- Optimiser les performances\n\nProfil recherché :\n- Maîtrise de React et JavaScript ES6+\n- Connaissance de Bootstrap ou Tailwind\n- Capacité à travailler en équipe",
                'type'                => 'Stage',
                'competencesRequises' => 'React,JavaScript,HTML,CSS,Bootstrap',
                'duree'               => '3 mois',
                'remuneration'        => 5000.00,
                'lieu'                => 'Casablanca',
                'statut'              => 'active',
                'datePublication'     => $now,
                'dateCreation'        => $now,
                'dateModification'    => $now,
            ],
            [
                'idEntreprise'        => 1,
                'titre'               => 'Développeur Back-end Laravel',
                'description'         => "Nous cherchons un développeur back-end passionné pour renforcer notre équipe.\n\nMissions :\n- Concevoir et développer des APIs RESTful avec Laravel\n- Gérer la base de données MySQL\n- Rédiger la documentation technique",
                'type'                => 'CDD 6 mois',
                'competencesRequises' => 'PHP,Laravel,MySQL,API REST',
                'duree'               => '6 mois',
                'remuneration'        => 8000.00,
                'lieu'                => 'Rabat',
                'statut'              => 'active',
                'datePublication'     => $now,
                'dateCreation'        => $now,
                'dateModification'    => $now,
            ],
            [
                'idEntreprise'        => 2,
                'titre'               => 'Assistant Marketing Digital',
                'description'         => "Nous recrutons un assistant marketing pour gérer nos réseaux sociaux et nos campagnes digitales.",
                'type'                => 'Stage',
                'competencesRequises' => 'Social Media,Canva,Google Analytics,Copywriting',
                'duree'               => '2 mois',
                'remuneration'        => 3000.00,
                'lieu'                => 'Casablanca',
                'statut'              => 'active',
                'datePublication'     => $now,
                'dateCreation'        => $now,
                'dateModification'    => $now,
            ],
            [
                'idEntreprise'        => 2,
                'titre'               => 'Graphiste / UI Designer',
                'description'         => "Création de visuels pour nos campagnes digitales et nos clients.",
                'type'                => 'Freelance',
                'competencesRequises' => 'Figma,Photoshop,Illustrator,UI Design',
                'remuneration'        => 450.00,
                'lieu'                => 'Télétravail',
                'statut'              => 'active',
                'datePublication'     => $now,
                'dateCreation'        => $now,
                'dateModification'    => $now,
            ],
        ]);

        // ── Candidatures de test ───────────────────────────────────
        DB::table('Candidature')->insert([
            [
                'idEtudiant'      => 1,
                'idMission'       => 1,
                'statut'          => 'en_attente',
                'lettreMotivation'=> 'Bonjour, je suis très motivé par ce poste...',
                'dateEnvoi'       => $now->copy()->subDays(2),
            ],
            [
                'idEtudiant'      => 1,
                'idMission'       => 2,
                'statut'          => 'acceptee',
                'lettreMotivation'=> 'Fort de mon expérience en Laravel...',
                'dateEnvoi'       => $now->copy()->subDays(5),
                'dateReponse'     => $now->copy()->subDay(),
            ],
            [
                'idEtudiant'      => 2,
                'idMission'       => 3,
                'statut'          => 'vue',
                'dateEnvoi'       => $now->copy()->subDays(1),
            ],
        ]);
    }
}
