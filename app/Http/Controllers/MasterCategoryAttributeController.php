<?php
namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\MasterCategoryAttribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MasterCategoryAttributeController extends Controller
{
    /**
     * Update attribute (name & key)
     * Sekaligus migrasi value item.attributes
     */
    public function update(Request $request, MasterCategoryAttribute $attribute)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'key'  => 'required|alpha_dash',
        ]);

        $oldKey = $attribute->key;

        DB::transaction(function () use ($attribute, $data, $oldKey) {

            // 1. update attribute master
            $attribute->update($data);

            // 2. migrasi attributes di item
            Item::where('category_id', $attribute->category_id)
                ->each(function ($item) use ($oldKey, $data) {

                    if (! is_array($item->attributes)) {
                        return;
                    }

                    if (! array_key_exists($oldKey, $item->attributes)) {
                        return;
                    }

                    $attrs = $item->attributes;

                    $attrs[$data['key']] = $attrs[$oldKey];
                    unset($attrs[$oldKey]);

                    $item->update([
                        'attributes' => $attrs,
                    ]);
                });
        });

        return back()->with('success', 'Attribute berhasil diperbarui');
    }
}
