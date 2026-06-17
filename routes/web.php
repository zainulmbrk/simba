<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MasterBuildingController;
use App\Http\Controllers\MasterCategoryAttributeController;
use App\Http\Controllers\MasterCategoryController;
use App\Http\Controllers\MasterConditionController;
// MasterUserController dihapus dari sini
use App\Http\Controllers\MasterRoomController;
use App\Http\Controllers\MasterStatusController;
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
})->middleware('guest')->name('home');

Route::get('/i/{id}', [ItemController::class, 'publicInfo'])->name('items.public');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Route untuk Manajemen User (Jika Anda ingin URL /manage-users juga aktif)
    Route::resource('manage-users', UserController::class)->parameters([
        'manage-users' => 'user',
    ])->names([
        'index' => 'users.index',
    ]);

    Route::get('/scan', function () {
        return Inertia::render('scan/index');
    })->name('scan');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/items/next-nup/{code}', [ItemController::class, 'getNextNup']);

    Route::get('/admin/activity-logs', [App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('admin.logs.index');

    // --- Master Gedung (Baru) ---
    Route::prefix('master/buildings')->name('master.buildings.')->group(function () {
        Route::get('/', [MasterBuildingController::class, 'index'])->name('index');
        Route::post('/', [MasterBuildingController::class, 'store'])->name('store');
        Route::put('/{building}', [MasterBuildingController::class, 'update'])->name('update');
        Route::delete('/{building}', [MasterBuildingController::class, 'destroy'])->name('destroy');
    });

    // --- Master Ruangan (Baru) ---
    Route::prefix('master/rooms')->name('master.rooms.')->group(function () {
        Route::get('/', [MasterRoomController::class, 'index'])->name('index');
        Route::post('/', [MasterRoomController::class, 'store'])->name('store');
        Route::put('/{room}', [MasterRoomController::class, 'update'])->name('update');
        Route::delete('/{room}', [MasterRoomController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Modul Management Barang (Items)
    |--------------------------------------------------------------------------
    */
    Route::prefix('items')->name('items.')->group(function () {
        Route::get('/export/kir', [ItemController::class, 'downloadKIR'])->name('export.kir');
        Route::get('/labels/print-all', [ItemController::class, 'downloadAllLabels'])->name('labels.print_all');
        Route::get('/', [ItemController::class, 'index'])->name('index');
        Route::get('/create', [ItemController::class, 'create'])->name('create');
        Route::get('/{item}', [ItemController::class, 'show'])->name('show');
        Route::post('/', [ItemController::class, 'store'])->name('store');
        Route::put('/{item}', [ItemController::class, 'update'])->name('update');
        Route::delete('/{item}', [ItemController::class, 'destroy'])->name('destroy');
        Route::get('/export/data', [ItemController::class, 'export'])->name('export');
    });

    /*
    |--------------------------------------------------------------------------
    | Modul Laporan (Reports)
    |--------------------------------------------------------------------------
    */
    Route::prefix('reports/bmn')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/download', [ReportController::class, 'download'])->name('download');
    });

    /*
    |--------------------------------------------------------------------------
    | Modul Master Data Management
    |--------------------------------------------------------------------------
    */

    // --- Master User (SOLUSI: Diarahkan ke UserController) ---
    Route::resource('master/user', UserController::class);

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
    | Dinamis: Atribut & Lokasi
    |--------------------------------------------------------------------------
    */
    Route::post('/master-categories/{id}/attributes', [MasterCategoryController::class, 'storeAttribute'])->name('master-categories.attributes.store');
    Route::put('/master-categories/attributes/{attribute}', [MasterCategoryController::class, 'updateAttribute']);
    Route::put('/attributes/{attribute}', [MasterCategoryAttributeController::class, 'update']);

    Route::prefix('master-categories')->group(function () {
        Route::post('/{category}/locations', [MasterCategoryController::class, 'storeLocation']);
        Route::put('/locations/{location}', [MasterCategoryController::class, 'updateLocation']);
        Route::delete('/locations/{location}', [MasterCategoryController::class, 'destroyLocation']);
    });

});

Route::get('/perbaiki-gambar', function () {
    if (file_exists(public_path('storage'))) {
        rmdir(public_path('storage'));
    }
    Artisan::call('storage:link');
    return "Jembatan gambar sudah dibuat!";
});

require __DIR__ . '/settings.php';
