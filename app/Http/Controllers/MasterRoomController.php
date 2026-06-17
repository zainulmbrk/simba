<?php
namespace App\Http\Controllers;

use App\Models\MasterBuilding;
use App\Models\MasterRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterRoomController extends Controller
{
    public function index()
    {
        return Inertia::render('master/rooms/index', [
            'rooms'     => MasterRoom::with('building')->get(),
            'buildings' => MasterBuilding::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'master_building_id' => 'required|exists:master_buildings,id',
            'name'               => 'required|string|max:255',
            'code'               => 'nullable|string|max:50',
        ]);

        MasterRoom::create($validated);
        return redirect()->back()->with('success', 'Ruangan berhasil ditambahkan');
    }

    public function update(Request $request, MasterRoom $room)
    {
        $validated = $request->validate([
            'master_building_id' => 'required|exists:master_buildings,id',
            'name'               => 'required|string|max:255',
            'code'               => 'nullable|string|max:50',
        ]);

        $room->update($validated);
        return redirect()->back();
    }

    public function destroy(MasterRoom $room)
    {
        $room->delete();
        return redirect()->back();
    }
}
