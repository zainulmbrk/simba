<?php
namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\MasterCategory;
use App\Models\MasterCategoryAttribute;
use App\Models\MasterCategoryLocation;
use App\Models\MasterCondition;
use App\Models\MasterStatus;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $perPage   = $request->input('per_page', 10);
        $search    = $request->input('search');
        $category  = $request->input('category');
        $status    = $request->input('status');
        $condition = $request->input('condition');

        $query = Item::with(['category', 'status', 'condition', 'user'])->latest();

        $authUser = Auth::user();
        if ($authUser && $authUser->role !== 'admin') {
            $query->where('user_id', $authUser->id);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($qu) use ($search) {
                        $qu->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($category) {
            $query->where('category_id', $category);
        }

        if ($status) {
            $query->where('status_id', $status);
        }

        if ($condition) {
            $query->where('condition_id', $condition);
        }

        $itemsPaginator = $query->paginate($perPage)->withQueryString();

        return Inertia::render('items/list', [
            'items'          => collect($itemsPaginator->items())->map(function ($item) {
                return [
                    'id'              => $item->id,
                    'name'            => $item->name,
                    'code'            => $item->code,
                    'nup'             => $item->nup,
                    'category'        => $item->category?->name,
                    'category_id'     => $item->category_id,
                    'status'          => $item->status?->name,
                    'status_id'       => $item->status_id,
                    'condition'       => $item->condition?->name,
                    'condition_id'    => $item->condition_id,
                    'location_values' => $item->location_values,
                    'user'            => $item->user?->name ?? '-',
                    'user_id'         => $item->user_id,
                    'responsible'     => $item->responsible,
                    'files'           => $item->files,
                    'attributes'      => is_array($item->attributes) ? $item->attributes : [],
                ];
            }),
            'pagination'     => [
                'links'        => $itemsPaginator->linkCollection(),
                'current_page' => $itemsPaginator->currentPage(),
                'per_page'     => $itemsPaginator->perPage(),
                'total'        => $itemsPaginator->total(),
            ],
            'filters'        => $request->only(['search', 'category', 'status', 'condition']),
            'categories'     => MasterCategory::with(['attributes', 'locations'])->get(),
            'statuses'       => MasterStatus::all(),
            'conditions'     => MasterCondition::all(),
            'users'          => User::all(),
            'itemReferences' => \App\Models\MasterItemReference::select('code', 'name')->get(),
        ]);
    }

    public function getNextNup($code)
    {
        // 1. Cari nilai NUP tertinggi berdasarkan kode barang yang dipilih
        $lastNup = Item::where('code', $code)->max('nup');

        // 2. Jika ada, tambahkan 1. Jika belum ada (null), mulai dari 1.
        $nextNup = $lastNup ? $lastNup + 1 : 1;

        // 3. Kembalikan dalam bentuk JSON agar bisa dibaca oleh React (Frontend)
        return response()->json([
            'next_nup' => $nextNup,
        ]);
    }

    // FUNGSI SHOW UNTUK MEMPERBAIKI ERROR 500 / HALAMAN PUTIH
    public function show(Item $item)
    {
        $item->load(['category', 'status', 'condition', 'user']);

        $attributeLabels = MasterCategoryAttribute::where('master_category_id', $item->category_id)
            ->pluck('name', 'key')->toArray();

        $locationLabels = MasterCategoryLocation::where('master_category_id', $item->category_id)
            ->pluck('name', 'key')->toArray();

        return Inertia::render('items/show', [
            'item'            => [
                'id'              => $item->id,
                'name'            => $item->name,
                'code'            => $item->code,
                'nup'             => $item->nup,
                'category'        => $item->category?->name,
                'category_id'     => $item->category_id, // Tambahkan ini
                'status'          => $item->status?->name,
                'status_id'       => $item->status_id, // Tambahkan ini
                'condition'       => $item->condition?->name,
                'condition_id'    => $item->condition_id, // Tambahkan ini
                'user'            => $item->user?->name ?? '-',
                'user_id'         => $item->user_id, // Tambahkan ini
                'responsible'     => $item->responsible,
                'files'           => $item->files,
                'attributes'      => is_array($item->attributes) ? $item->attributes : [],
                'location_values' => is_array($item->location_values) ? $item->location_values : [],
            ],
            'attributeLabels' => $attributeLabels,
            'locationLabels'  => $locationLabels,
            // --- TAMBAHKAN DATA DI BAWAH INI ---
            'categories'      => MasterCategory::with(['attributes', 'locations'])->get(),
            'statuses'        => MasterStatus::all(),
            'conditions'      => MasterCondition::all(),
            'users'           => User::all(),
            'itemReferences'  => \App\Models\MasterItemReference::select('code', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        return $this->processSave(new Item(), $request);
    }

    public function update(Request $request, Item $item)
    {
        return $this->processSave($item, $request);
    }

    // protected function processSave(Item $item, Request $request)
    // {
    //     $currentUser = Auth::user();
    //     $rules       = [
    //         'name'        => 'required|string',
    //         'code'        => 'required|string',
    //         'nup'         => 'nullable|integer',
    //         'category'    => 'required|integer',
    //         'status'      => 'required|integer',
    //         'condition'   => 'required|integer',
    //         'responsible' => 'required|string',
    //         'photo'       => 'nullable|file|image',
    //     ];

    //     if ($currentUser && $currentUser->role === 'admin') {
    //         $rules['user_id'] = 'required|integer';
    //     }

    //     $validated = $request->validate($rules);

    //     $item->name         = $validated['name'];
    //     $item->code         = $validated['code'];
    //     $item->category_id  = $validated['category'];
    //     $item->status_id    = $validated['status'];
    //     $item->condition_id = $validated['condition'];
    //     $item->responsible  = $validated['responsible'];
    //     $item->user_id      = ($currentUser->role === 'admin') ? $request->input('user_id') : $currentUser->id;

    //     if (! $item->exists && (empty($validated['nup']) || $validated['nup'] == 0)) {
    //         $lastNup   = Item::where('code', $validated['code'])->max('nup');
    //         $item->nup = $lastNup ? $lastNup + 1 : 1;
    //     } else {
    //         $item->nup = $validated['nup'] ?? $item->nup;
    //     }

    //     $item->location_values = $request->input('location_values', []);
    //     $item->attributes      = $request->input('attributes', []);

    //     if ($request->hasFile('photo')) {
    //         if ($item->files) {
    //             Storage::disk('public')->delete($item->files);
    //         }

    //         $item->files = $request->file('photo')->store('items', 'public');
    //     }

    //     $item->save();
    //     return redirect()->route('items.index')->with('success', 'Berhasil disimpan');
    // }

    protected function processSave(Item $item, Request $request)
    {
        $currentUser = Auth::user();
        $rules       = [
            'name'        => 'required|string',
            'code'        => 'required|string',
            'nup'         => 'nullable|integer',
            'category'    => 'required|integer',
            'status'      => 'required|integer',
            'condition'   => 'required|integer',
            'responsible' => 'required|string',
            'photo'       => 'nullable|file|image',
        ];

        if ($currentUser && $currentUser->role === 'admin') {
            $rules['user_id'] = 'required|integer';
        }

        $validated = $request->validate($rules);

        $item->name         = $validated['name'];
        $item->code         = $validated['code'];
        $item->category_id  = $validated['category'];
        $item->status_id    = $validated['status'];
        $item->condition_id = $validated['condition'];
        $item->responsible  = $validated['responsible'];
        $item->user_id      = ($currentUser->role === 'admin') ? $request->input('user_id') : $currentUser->id;

        if (! $item->exists && (empty($validated['nup']) || $validated['nup'] == 0)) {
            $lastNup   = Item::where('code', $validated['code'])->max('nup');
            $item->nup = $lastNup ? $lastNup + 1 : 1;
        } else {
            $item->nup = $validated['nup'] ?? $item->nup;
        }

        // --- PERBAIKAN DI SINI ---
        // Cek apakah data berupa string (JSON), jika ya maka decode. Jika sudah array, pakai langsung.
        $attrs            = $request->input('attributes');
        $item->attributes = is_string($attrs) ? json_decode($attrs, true) : ($attrs ?? []);

        $locs                  = $request->input('location_values');
        $item->location_values = is_string($locs) ? json_decode($locs, true) : ($locs ?? []);
        // -------------------------

        if ($request->hasFile('photo')) {
            if ($item->files) {
                Storage::disk('public')->delete($item->files);
            }
            $item->files = $request->file('photo')->store('items', 'public');
        }

        $item->save();

        // Perbaikan Redirect: Jika ada instruksi redirect_to, ikuti.
        if ($request->input('redirect_to') === 'show') {
            return redirect()->route('items.show', $item->id)->with('success', 'Berhasil diupdate');
        }

        return redirect()->route('items.index')->with('success', 'Berhasil disimpan');
    }

    public function destroy(Item $item)
    {
        if ($item->files) {
            Storage::disk('public')->delete($item->files);
        }

        $item->delete();
        return redirect()->route('items.index');
    }

    public function downloadAllLabels(Request $request)
    {
        $query = Item::with(['user', 'category', 'condition']);
        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        $items = $query->latest()->get();

        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel'   => QRCode::ECC_M,
            'scale'      => 5,
        ]);

        $itemsData = $items->map(function ($item) use ($options) {
            $qrcodeGenerator    = new QRCode($options);
            $item->qrcode_image = $qrcodeGenerator->render(route('items.public', $item->id));
            return $item;
        });

        $pdf = Pdf::loadView('qr.item-label', ['items' => $itemsData]);
        $pdf->setPaper('a4', 'landscape');
        return $pdf->stream("labels.pdf");
    }

    public function publicInfo($id)
    {
        $item = Item::with(['category', 'status', 'condition', 'user'])->find($id);

        if (! $item) {
            abort(404, 'Barang tidak ditemukan');
        }

        // Ambil label agar di halaman QR tidak muncul "room_name" tapi "Nama Ruangan"
        $attributeLabels = MasterCategoryAttribute::where('master_category_id', $item->category_id)
            ->pluck('name', 'key')->toArray();

        $locationLabels = MasterCategoryLocation::where('master_category_id', $item->category_id)
            ->pluck('name', 'key')->toArray();

        return Inertia::render('items/public-info', [
            'item'            => [
                'id'              => $item->id,
                'name'            => $item->name,
                'code'            => $item->code,
                'nup'             => $item->nup,
                'category'        => $item->category,  // Kirim objek utuh
                'status'          => $item->status,    // Kirim objek utuh
                'condition'       => $item->condition, // Kirim objek utuh
                'user'            => $item->user,      // Kirim objek utuh
                'responsible'     => $item->responsible,
                'files'           => $item->files,
                'attributes'      => is_array($item->attributes) ? $item->attributes : [],
                'location_values' => is_array($item->location_values) ? $item->location_values : [],
            ],
            'attributeLabels' => $attributeLabels,
            'locationLabels'  => $locationLabels,
        ]);
    }
}
