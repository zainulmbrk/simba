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
        // Gunakan nama 'master_users'
        Schema::create('master_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('employee_id')->nullable(); // NIP
            $table->string('employment_status')->nullable(); // Status Pegawai
            $table->string('job_title')->nullable(); // Jabatan
            $table->text('notes')->nullable(); // Keterangan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_users');
    }
};
