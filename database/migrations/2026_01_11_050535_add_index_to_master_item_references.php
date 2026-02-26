<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('master_item_references', function (Blueprint $table) {
            // Menambahkan index pada name agar pencarian SELECT OPTION cepat
            $table->index('name');
            // Index pada code juga bagus jika nanti ada pencarian berdasarkan kode
            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::table('master_item_references', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['code']);
        });
    }
};
