<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterCategoryAttribute extends Model
{
    protected $fillable = [
        'master_category_id',
        'name',
        'key',
        'type',
        'options',
        'is_required',
        'order',
    ];

    protected $casts = [
        'options'     => 'array',
        'is_required' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(MasterCategory::class, 'master_category_id');
    }
}
