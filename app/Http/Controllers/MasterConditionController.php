<?php
namespace App\Http\Controllers;

use App\Models\MasterCondition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterConditionController extends Controller
{
    /**
     * Tampilkan daftar kondisi
     */
    public function index()
    {
        return Inertia::render('master/condition/list', [
            'conditions' => MasterCondition::orderBy('name')->get(),
        ]);
    }

    /**
     * Simpan kondisi baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:master_conditions,name',
        ]);

        MasterCondition::create([
            'name'      => $validated['name'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Kondisi berhasil ditambahkan');
    }
}
