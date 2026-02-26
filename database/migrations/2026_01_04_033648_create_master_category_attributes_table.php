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
        Schema::create('master_category_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_category_id')
                ->constrained('master_categories')
                ->cascadeOnDelete();

            $table->string('name'); // No Polisi
            $table->string('key');  // nopol
            $table->string('type'); // text, number, date, select
            $table->json('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['master_category_id', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_category_attributes');
    }
};
