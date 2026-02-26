<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterCategoryLocation extends Model
{
    // Izinkan pengisian massal untuk kolom-kolom ini
    protected $fillable = [
        'master_category_id',
        'name',
        'key',
    ];

    // Relasi balik ke Kategori
    public function category()
    {
        return $this->belongsTo(MasterCategory::class, 'master_category_id');
    }
}
