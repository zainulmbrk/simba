<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterUser extends Model
{
    use HasFactory;

    // Pastikan nama tabelnya 'users' sesuai migration Anda
    protected $table = 'master_users';

    protected $fillable = [
        'name',
        'employee_id',
        'employment_status',
        'job_title',
        'notes',
    ];

    public function items()
    {
        // Nama foreign key di tabel items nanti adalah 'user_id'
        return $this->hasMany(Item::class, 'user_id');
    }
}
