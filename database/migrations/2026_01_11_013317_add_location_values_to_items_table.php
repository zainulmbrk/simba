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
        Schema::table('items', function (Blueprint $table) {
            // Kita buat kolom JSON baru untuk menampung lokasi yang dinamis
            $table->json('location_values')->nullable()->after('attributes');
            // Kolom location yang lama (string) sebaiknya dihapus nanti jika sudah migrasi
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            //
        });
    }
};
