<?php
namespace App\Http\Controllers;

use App\Models\MasterUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterUserController extends Controller
{

    public function index(Request $request)
    {
        $query = MasterUser::query();

        // Filter Search
        $query->when($request->search, function ($q, $search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('employee_id', 'like', "%{$search}%");
        });

                                                                       // Sort Logic
        $sortColumn    = $request->input('sort_column', 'created_at'); // Default sort
        $sortDirection = $request->input('sort_direction', 'desc');    // Default direction

        $query->orderBy($sortColumn, $sortDirection);

        // Ambil nilai per_page dari request, default-nya 10
        $perPage = $request->input('per_page', 10);

        $users = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('master/user/index', [
            'users'      => $users->items(),
            'filters'    => $request->only(['search', 'sort_column', 'sort_direction']),
            'pagination' => [
                'links'    => $users->linkCollection()->toArray(),
                'total'    => $users->total(),
                'per_page' => (int) $perPage, // Kirim balik ke frontend
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'employee_id'       => 'nullable|string|max:50',
            'employment_status' => 'nullable|string',
            'job_title'         => 'nullable|string',
            'notes'             => 'nullable|string',
        ]);

        MasterUser::create($data);
        return redirect()->back()->with('success', 'User berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $user = MasterUser::findOrFail($id);

        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'employee_id'       => 'nullable|string|unique:master_users,employee_id,' . $id,
            'employment_status' => 'nullable|string',
            'job_title'         => 'nullable|string',
            'notes'             => 'nullable|string',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Data berhasil diperbarui');
    }

    public function destroy(MasterUser $masterUser)
    {
        $masterUser->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus');
    }
}
