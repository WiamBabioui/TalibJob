<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Mission', function (Blueprint $table) {
            $table->id();
            $table->string('titre', 150);
            $table->text('description');
            $table->string('type', 50)->nullable();
            $table->text('competencesRequises')->nullable();
            $table->string('duree', 50)->nullable();
            $table->decimal('remuneration', 10, 2)->nullable();
            $table->string('lieu', 100)->nullable();
            $table->date('dateDebut')->nullable();
            $table->date('dateFin')->nullable();
            $table->enum('statut', ['brouillon', 'active', 'fermee', 'pourvue'])->default('brouillon');
            $table->integer('nombreCandidatures')->default(0);
            $table->integer('vues')->default(0);
            $table->timestamp('datePublication')->nullable();
            $table->timestamp('dateExpiration')->nullable();
            $table->unsignedBigInteger('idEntreprise');
            $table->timestamp('dateCreation')->useCurrent();
            $table->timestamp('dateModification')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('idEntreprise')
                  ->references('id')->on('Entreprise')
                  ->onDelete('cascade');

            $table->index('idEntreprise', 'idx_mission_entreprise');
            $table->index('statut', 'idx_mission_statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Mission');
    }
};
