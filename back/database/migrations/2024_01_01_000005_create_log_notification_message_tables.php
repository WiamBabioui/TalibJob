<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Table LogActivite
        Schema::create('LogActivite', function (Blueprint $table) {
            $table->id();
            $table->enum('typeUtilisateur', ['etudiant', 'entreprise']);
            $table->unsignedBigInteger('idUtilisateur');
            $table->string('action', 100);
            $table->text('details')->nullable();
            $table->string('ipAdresse', 45)->nullable();
            $table->timestamp('dateAction')->useCurrent();

            $table->index(['typeUtilisateur', 'idUtilisateur'], 'idx_log_utilisateur');
        });

        // Table Notification
        Schema::create('Notification', function (Blueprint $table) {
            $table->id();
            $table->enum('typeUtilisateur', ['etudiant', 'entreprise']);
            $table->unsignedBigInteger('idUtilisateur');
            $table->string('titre', 150);
            $table->text('message');
            $table->string('type', 50)->nullable();
            $table->boolean('lu')->default(false);
            $table->timestamp('dateCreation')->useCurrent();

            $table->index(['typeUtilisateur', 'idUtilisateur'], 'idx_notification_utilisateur');
        });

        // Table Message
        Schema::create('Message', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idEntreprise');
            $table->enum('expediteur', ['etudiant', 'entreprise']);
            $table->string('sujet', 150)->nullable();
            $table->text('message');
            $table->boolean('lu')->default(false);
            $table->timestamp('dateEnvoi')->useCurrent();

            $table->foreign('idEtudiant')
                  ->references('id')->on('Etudiant')
                  ->onDelete('cascade');

            $table->foreign('idEntreprise')
                  ->references('id')->on('Entreprise')
                  ->onDelete('cascade');

            $table->index('idEtudiant',  'idx_message_etudiant');
            $table->index('idEntreprise', 'idx_message_entreprise');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Message');
        Schema::dropIfExists('Notification');
        Schema::dropIfExists('LogActivite');
    }
};
