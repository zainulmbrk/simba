<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        // Kita tambahkan 'subject' agar tahu nama barang yang diubah
        $logs = Activity::with(['causer', 'subject'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/logs/index', [
            'logs' => $logs,
        ]);
    }
}
