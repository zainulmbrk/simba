<?php
namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Mengambil Statistik Barang
        $stats = [
            'total_items'    => Item::count(),

            // Menghitung barang berdasarkan relasi condition
            // DashboardController.php

            'good_condition' => Item::whereHas('condition', function ($q) {
                // Gunakan 'like' dengan lowercase untuk menghindari case-sensitivity database
                $q->where('name', 'like', '%baik%')
                    ->orWhere('name', 'like', '%layak%');
            })->count(),

            'active_items'   => Item::whereHas('status', function ($q) {
                // Pastikan status 'Tersedia' atau 'Aktif' sesuai dengan isi table master_statuses
                $q->where('name', 'like', '%tersedia%')
                    ->orWhere('name', 'like', '%aktif%');
            })->count(),

            'bad_condition'  => Item::whereHas('condition', function ($q) {
                $q->where('name', 'like', '%Rusak%')
                    ->orWhere('name', 'like', '%Buruk%');
            })->count(),

        ];

        // 2. Mengambil 5 Aktivitas Terbaru untuk Audit Trail di Dashboard
        $recentLogs = Activity::with('causer')
            ->latest()
            ->take(8) // Kita ambil 8 agar tampilan dashboard lebih penuh
            ->get()
            ->map(function ($log) {
                return [
                    'id'           => $log->id,
                    'description'  => $log->description,
                    'event'        => $log->event,
                    'causer'       => $log->causer ? ['name' => $log->causer->name] : ['name' => 'Sistem'],
                    'created_at'   => $log->created_at->toDateTimeString(),
                    // Kita ambil nama barang dari subject jika masih ada
                    'subject_name' => $log->subject?->name ?? ($log->properties['old_name'] ?? 'Aset'),
                ];
            });

        // 3. (Opsional) Data untuk Grafik Bar - Sebaran per Kategori
        $categoriesData = \App\Models\MasterCategory::withCount('items')->get()->map(function ($cat) {
            return [
                'name'  => $cat->name,
                'total' => $cat->items_count,
            ];
        });

        return Inertia::render('Dashboard', [
            'stats'          => $stats,
            'recentLogs'     => $recentLogs,
            'categoriesData' => $categoriesData,
        ]);
    }
}
