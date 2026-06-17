<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Item extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = [
        'name',
        'code',
        'nup',
        'category_id',
        'status_id',
        'condition_id',
        'location',
        'location_values',
        'user_id',
        'responsible',
        'files',
        'file_bast',
        'attributes',
    ];

    protected $casts = [
        'attributes'      => 'array',
        'location_values' => 'array',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'name',
                'code',
                'user_id',
                'category_id',
                'status_id',
                'condition_id',
                'location_values',
                'attributes',
            ])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        if ($eventName === 'updated' && $this->isDirty('user_id')) {
            // Pastikan menggunakan User::class (Tabel Login)
            $newUser = \App\Models\User::query()->find($this->user_id);
            $oldUser = \App\Models\User::query()->find($this->getOriginal('user_id'));

            $activity->properties = $activity->properties->merge([
                'new_user_name' => $newUser?->name ?? 'Tidak ada',
                'old_user_name' => $oldUser?->name ?? 'Tidak ada',
            ]);
        }

        if ($eventName === 'deleted') {
            $activity->properties = $activity->properties->merge([
                'old_name' => $this->name,
                'old_code' => $this->code,
            ]);
        }
    }

    /**
     * PERBAIKAN UTAMA:
     * Relasi harus ke User::class agar sinkron dengan sistem login (semravvut)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(MasterCategory::class, 'category_id');
    }

    public function status()
    {
        return $this->belongsTo(MasterStatus::class, 'status_id');
    }

    public function condition()
    {
        return $this->belongsTo(MasterCondition::class, 'condition_id');
    }
}
