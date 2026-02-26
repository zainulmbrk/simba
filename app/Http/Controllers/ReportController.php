<?php
namespace App\Http\Controllers;

use App\Exports\DynamicItemsExport;
use App\Models\Item;
use App\Models\MasterCategory;
use Barryvdh\DomPDF\Facade\Pdf; // Kita akan buat file ini
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index()
    {
        $categories = MasterCategory::all();
        return inertia('reports/bmn/index', [
            'categories' => $categories,
        ]);
    }

    public function download(Request $request)
    {
        $request->validate([
            'category_id' => 'required',
            'export'      => 'required|in:pdf,excel',
            'until_date'  => 'required|date', // Pastikan validasi ini ada
        ]);

        $query = Item::with(['category', 'condition', 'user'])
            ->where('category_id', $request->category_id)
            ->whereDate('created_at', '<=', $request->until_date);

        $items    = $query->get();
        $category = MasterCategory::findOrFail($request->category_id);

        if ($items->isEmpty()) {
            return back()->with('error', 'Data tidak ditemukan.');
        }

        if ($request->export === 'pdf') {
            $pdf = Pdf::loadView('reports.items', [
                'items'      => $items,
                'title'      => 'DAFTAR BARANG KUASA PENGGUNA',
                'category'   => $category,
                'until_date' => $request->until_date, // VARIABEL INI YANG KURANG
            ])->setPaper('a4', 'landscape');

            return $pdf->download("laporan-bmn-{$category->name}.pdf");
        }

        return Excel::download(
            new DynamicItemsExport($items, $category->name, $request->until_date),
            "laporan-bmn-{$category->name}.xlsx"
        );
    }
}
