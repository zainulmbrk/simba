<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterRoom extends Model
{
    protected $fillable = ['master_building_id', 'name', 'code'];

    public function building()
    {
        return $this->belongsTo(MasterBuilding::class, 'master_building_id');
    }
}
