<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('Etudiant', function (Blueprint $table) {
            $table->string('poste', 100)->nullable()->after('prenom');
        });
    }

    public function down(): void
    {
        Schema::table('Etudiant', function (Blueprint $table) {
            $table->dropColumn('poste');
        });
    }
};