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
    Schema::create('master_category_locations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('master_category_id')->constrained('master_categories')->onDelete('cascade');
        $table->string('name'); 
        $table->string('key');  
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('master_category_locations');
}
};
