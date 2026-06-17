<?php
namespace App\Http\Controllers;

use App\Models\MasterBuilding;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterBuildingController extends Controller
{
    public function index()
    {
        return Inertia::render('master/buildings/index', [
            'buildings' => MasterBuilding::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        MasterBuilding::create($validated);
        return redirect()->back()->with('success', 'Gedung berhasil ditambahkan');
    }

    public function destroy(MasterBuilding $building)
    {
        $building::delete();
        return redirect()->back()->with('success', 'Gedung dihapus');
    }
}
