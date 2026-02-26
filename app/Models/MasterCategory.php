<?php
namespace App\Models;

use App\Models\MasterCategoryAttribute;
use App\Models\MasterCategoryLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterCategory extends Model
{
    use HasFactory;

    protected $table = 'master_categories';

    protected $fillable = [
        'name',
    ];

    /**
     * Relasi: satu kategori punya banyak attribute
     */
    public function attributes()
    {
        return $this->hasMany(MasterCategoryAttribute::class);
    }

    public function locations()
    {
        return $this->hasMany(MasterCategoryLocation::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}
