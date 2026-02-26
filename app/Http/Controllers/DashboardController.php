<?php
namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // LOGIKA PENENTU ADMIN:
        // User dianggap Admin jika ID-nya adalah 1 atau kolom 'role' bernilai 'admin'
        $isAdmin = ($user->id === 1 || (isset($user->role) && $user->role === 'admin'));

        // 1. QUERY STATISTIK BARANG
        $itemQuery = Item::query();

        // Jika bukan admin, hanya hitung barang milik user ini
        if (! $isAdmin) {
            $itemQuery->where('user_id', $user->id);
        }

        $stats = [
            'total_items'    => (clone $itemQuery)->count(),

            'good_condition' => (clone $itemQuery)->whereHas('condition', function ($q) {
                $q->where('name', 'like', '%baik%')
                    ->orWhere('name', 'like', '%layak%');
            })->count(),

            'active_items'   => (clone $itemQuery)->whereHas('status', function ($q) {
                $q->where('name', 'like', '%tersedia%')
                    ->orWhere('name', 'like', '%aktif%');
            })->count(),

            'bad_condition'  => (clone $itemQuery)->whereHas('condition', function ($q) {
                $q->where('name', 'like', '%rusak%')
                    ->orWhere('name', 'like', '%buruk%');
            })->count(),
        ];

        // 2. QUERY LOG AKTIVITAS
        $logQuery = Activity::with('causer');

        // Jika bukan admin, hanya tampilkan log aktivitas yang dilakukan oleh user ini
        if (! $isAdmin) {
            $logQuery->where('causer_id', $user->id);
        }

        $recentLogs = $logQuery->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id'          => $log->id,
                    'description' => $log->description,
                    'event'       => $log->event,
                    'causer'      => $log->causer ? ['name' => $log->causer->name] : ['name' => 'Sistem'],
                    'created_at'  => $log->created_at->toISOString(),
                ];
            });

        // 3. RENDER KE VIEW
        return Inertia::render('dashboard', [
            'stats'      => $stats,
            'recentLogs' => $recentLogs,
            'isAdmin'    => $isAdmin,
        ]);
    }
}
