<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterBuilding extends Model
{
    // Tambahkan baris ini agar 'name' bisa disimpan lewat form
    protected $fillable = ['name'];

    /**
     * Relasi ke tabel rooms
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(MasterRoom::class, 'master_building_id');
    }
}
