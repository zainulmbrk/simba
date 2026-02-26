<?php
namespace App\Http\Controllers;

use App\Models\MasterCategory;
use App\Models\MasterCategoryAttribute;
use App\Models\MasterCategoryLocation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MasterCategoryController extends Controller
{

    public function index()
    {
        $categories = MasterCategory::with(['attributes', 'locations'])
            ->orderBy('id')
            ->get();

        return inertia('master/category/list', [
            'categories' => $categories,
        ]);
    }

    /**
     * Simpan kategori baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:master_categories,name',
        ]);

        MasterCategory::create([
            'name'      => $validated['name'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan');
    }

    public function storeAttribute(Request $request, $categoryId)
    {
        $data = $request->validate([
            'name'        => 'required|string',
            'key'         => 'required|string',
            'type'        => 'required|string',
            'is_required' => 'boolean',
            'order'       => 'nullable|integer',
        ]);

        $category = MasterCategory::findOrFail($categoryId);
        $category->attributes()->create($data);

        return back();
    }

    public function storeLocation(Request $request, $categoryId)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'key'  => [
                'required',
                'string',
                'alpha_dash',
                // Validasi: key harus unik di tabel master_category_locations
                // untuk master_category_id yang sama
                Rule::unique('master_category_locations')->where(function ($query) use ($categoryId) {
                    return $query->where('master_category_id', $categoryId);
                }),
            ],
        ]);

        $category = MasterCategory::findOrFail($categoryId);
        $category->locations()->create($data);

        return back()->with('success', 'Field lokasi berhasil ditambahkan');
    }

    public function update(Request $request, MasterCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:master_categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $validated['name'],
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function updateAttribute(Request $request, MasterCategoryAttribute $attribute)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'key'  => 'required|string',
        ]);

        $attribute->update($data);

        return back()->with('success', 'Attribute berhasil diperbarui');
    }

    public function updateLocation(Request $request, $locationId)
    {
        // Cari data berdasarkan ID
        $location = MasterCategoryLocation::findOrFail($locationId);

        // Validasi data
        $data = $request->validate([
            'name' => 'required|string',
            'key'  => [
                'required',
                'string',
                'alpha_dash',
                // Pastikan unik di kategori yang sama, abaikan untuk ID ini sendiri
                Rule::unique('master_category_locations')->where(function ($query) use ($location) {
                    return $query->where('master_category_id', $location->master_category_id);
                })->ignore($locationId),
            ],
        ]);

        $location->update($data);

        return back()->with('success', 'Field lokasi berhasil diperbarui');
    }

    public function destroyLocation($locationId)
    {
        // Cari data lokasi berdasarkan ID
        $location = \App\Models\MasterCategoryLocation::findOrFail($locationId);

        // Hapus data
        $location::destroy($locationId);

        return back()->with('success', 'Field lokasi berhasil dihapus');
    }
}
