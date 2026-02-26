<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MasterCategoryAttributeController;
use App\Http\Controllers\MasterCategoryController;
use App\Http\Controllers\MasterConditionController;
use App\Http\Controllers\MasterStatusController;
use App\Http\Controllers\MasterUserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Route Scan QR Publik (Arahkan ke sini agar user umum bisa melihat info barang)
Route::get('/i/{id}', [ItemController::class, 'publicInfo'])->name('items.public');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Protected by Auth & Verified Middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('manage-users', UserController::class)->parameters([
        'manage-users' => 'user', // Memaksa parameter URL menjadi {user} agar terbaca di Controller
    ])->names([
        'index' => 'users.index',
    ]);

    Route::get('/scan', function () {
        return Inertia::render('scan/index');
    })->name('scan');

    // --- Dashboard ---
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // GET NUP
    // Route untuk mengambil NUP selanjutnya berdasarkan kode barang
    Route::get('/items/next-nup/{code}', [ItemController::class, 'getNextNup'])->middleware('auth');

    // Khusus Admin: Log Aktivitas
    Route::get('/admin/activity-logs', [App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('admin.logs.index');

    /*
    |--------------------------------------------------------------------------
    | Modul Management Barang (Items)
    |--------------------------------------------------------------------------
    */
    Route::prefix('items')->name('items.')->group(function () {
        Route::get('/labels/print-all', [ItemController::class, 'downloadAllLabels'])->name('labels.print_all');
        Route::get('/', [ItemController::class, 'index'])->name('index');
        Route::get('/create', [ItemController::class, 'create'])->name('create');
        Route::get('/{item}', [ItemController::class, 'show'])->name('show');
        Route::post('/', [ItemController::class, 'store'])->name('store');
        Route::put('/{item}', [ItemController::class, 'update'])->name('update');
        Route::delete('/{item}', [ItemController::class, 'destroy'])->name('destroy');

        // Export Data Barang (Excel/PDF)
        Route::get('/export/data', [ItemController::class, 'export'])->name('export');
    });

    /*
    |--------------------------------------------------------------------------
    | Modul Laporan (Reports)
    |--------------------------------------------------------------------------
    */
    Route::prefix('reports/bmn')->name('reports.')->group(function () {
        // Halaman filter laporan
        Route::get('/', [ReportController::class, 'index'])->name('index');
        // Proses download file laporan
        Route::get('/download', [ReportController::class, 'download'])->name('download');
    });

    /*
    |--------------------------------------------------------------------------
    | Modul Master Data Management
    |--------------------------------------------------------------------------
    */

    // --- Master User ---
    Route::resource('master/user', MasterUserController::class);

    // --- Master Kategori ---
    Route::prefix('master/categories')->name('master.categories.')->group(function () {
        Route::get('/', [MasterCategoryController::class, 'index'])->name('index');
        Route::post('/', [MasterCategoryController::class, 'store'])->name('store');
        Route::put('/{category}', [MasterCategoryController::class, 'update'])->name('update');
    });

    // --- Master Status ---
    Route::prefix('master/statuses')->name('master.statuses.')->group(function () {
        Route::get('/', [MasterStatusController::class, 'index'])->name('index');
        Route::post('/', [MasterStatusController::class, 'store'])->name('store');
    });

    // --- Master Kondisi ---
    Route::prefix('master/conditions')->name('master.conditions.')->group(function () {
        Route::get('/', [MasterConditionController::class, 'index'])->name('index');
        Route::post('/', [MasterConditionController::class, 'store'])->name('store');
    });

    /*
    |--------------------------------------------------------------------------
    | Dinamis: Atribut & Lokasi Berdasarkan Kategori
    |--------------------------------------------------------------------------
    */

    // Pengelolaan Atribut Kategori
    Route::post('/master-categories/{id}/attributes', [MasterCategoryController::class, 'storeAttribute'])->name('master-categories.attributes.store');
    Route::put('/master-categories/attributes/{attribute}', [MasterCategoryController::class, 'updateAttribute']);

    // Update spesifik key/nama atribut (MasterCategoryAttributeController)
    Route::put('/attributes/{attribute}', [MasterCategoryAttributeController::class, 'update']);

    // Pengelolaan Lokasi Kategori
    Route::prefix('master-categories')->group(function () {
        Route::post('/{category}/locations', [MasterCategoryController::class, 'storeLocation']);
        Route::put('/locations/{location}', [MasterCategoryController::class, 'updateLocation']);
        Route::delete('/locations/{location}', [MasterCategoryController::class, 'destroyLocation']);
    });

});

Route::get('/perbaiki-gambar', function () {
    // Menghapus jembatan lama jika ada yang salah/error
    if (file_exists(public_path('storage'))) {
        rmdir(public_path('storage'));
    }

    // Membuat jembatan baru
    Artisan::call('storage:link');

    return "Jembatan gambar sudah dibuat! Silakan cek kembali halaman List Barang.";
});

// Load routes bawaan untuk profil & settings
require __DIR__ . '/settings.php';
