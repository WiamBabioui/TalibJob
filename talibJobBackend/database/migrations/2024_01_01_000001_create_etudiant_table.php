<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Etudiant', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 100)->unique();
            $table->string('motDePasse', 255);
            $table->string('telephone', 20)->nullable();
            $table->text('cv')->nullable();
            $table->text('competences')->nullable();
            $table->string('photoProfil', 255)->nullable();
            $table->enum('statut', ['actif', 'inactif', 'suspendu'])->default('actif');
            $table->boolean('emailVerifie')->default(false);
            $table->string('tokenVerification', 100)->nullable();
            $table->string('tokenResetPassword', 100)->nullable();
            $table->timestamp('dernierLogin')->nullable();
            $table->timestamp('dateInscription')->useCurrent();
            $table->timestamp('dateModification')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Etudiant');
    }
};
