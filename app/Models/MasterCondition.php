<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterCondition extends Model
{
    use HasFactory;

    protected $table    = 'master_conditions';
    protected $fillable = ['name'];
}
