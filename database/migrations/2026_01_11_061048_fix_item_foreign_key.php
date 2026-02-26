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
            // Hapus foreign key yang lama (yang mengarah ke tabel 'users')
            $table->dropForeign(['user_id']);

            // Buat foreign key baru yang mengarah ke 'master_users'
            $table->foreign('user_id')
                ->references('id')
                ->on('master_users')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users');
        });
    }
};
