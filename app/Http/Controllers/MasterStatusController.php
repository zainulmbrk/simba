<?php
namespace App\Http\Controllers;

use App\Models\MasterStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterStatusController extends Controller
{
    /**
     * Tampilkan daftar status
     */
    public function index()
    {
        return Inertia::render('master/status/list', [
            'statuses' => MasterStatus::orderBy('name')->get(),
        ]);
    }

    /**
     * Simpan status baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:master_statuses,name',
        ]);

        MasterStatus::create([
            'name'      => $validated['name'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Status berhasil ditambahkan');
    }
}
