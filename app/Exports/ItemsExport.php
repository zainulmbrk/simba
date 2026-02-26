<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ItemsExport implements FromCollection, WithHeadings
{
    protected $items;

    public function __construct($items)
    {
        $this->items = $items;
    }

    public function collection()
    {
        // Kita petakan kolom mana saja yang mau muncul di Excel
        return $this->items->map(function ($item) {
            return [
                $item->id,
                $item->name,
                $item->code,
                $item->category_id, // Anda bisa ganti dengan nama kategori jika ada relasi
                $item->status_id,
                $item->condition_id,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama Barang',
            'Kode Barang',
            'Kategori',
            'Status',
            'Kondisi',
        ];
    }
}
