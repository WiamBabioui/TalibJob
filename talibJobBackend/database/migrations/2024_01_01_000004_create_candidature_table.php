<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Candidature', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idMission');
            $table->enum('statut', ['en_attente', 'vue', 'acceptee', 'refusee', 'retiree'])->default('en_attente');
            $table->text('lettreMotivation')->nullable();
            $table->text('cvPersonnalise')->nullable();
            $table->timestamp('dateEnvoi')->useCurrent();
            $table->timestamp('dateReponse')->nullable();
            $table->text('commentaireEntreprise')->nullable();

            $table->foreign('idEtudiant')
                  ->references('id')->on('Etudiant')
                  ->onDelete('cascade');

            $table->foreign('idMission')
                  ->references('id')->on('Mission')
                  ->onDelete('cascade');

            $table->unique(['idEtudiant', 'idMission'], 'candidature_unique');
            $table->index('idEtudiant',  'idx_candidature_etudiant');
            $table->index('idMission',   'idx_candidature_mission');
            $table->index('statut',      'idx_candidature_statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Candidature');
    }
};
