<?php
namespace App\Exports;

use App\Models\MasterCategoryAttribute;
use App\Models\MasterUser;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class DynamicItemsExport implements FromCollection, WithHeadings, WithMapping, WithEvents, WithCustomStartCell
{
    protected $items;
    protected $keys   = [];
    protected $labels = [];
    protected $category_name;
    protected $until_date;

    public function __construct($items, $category_name, $until_date)
    {
        $this->items         = $items;
        $this->category_name = $category_name;
        $this->until_date    = \Carbon\Carbon::parse($until_date)->format('d-m-Y');

        $category_id = $items->first()->category_id ?? null;

        // Tentukan key yang TIDAK BOLEH muncul (Blacklist)
        $excludedKeys = ['specification'];

        foreach ($items as $item) {
            $attr = is_string($item->attributes) ? json_decode($item->attributes, true) : $item->attributes;
            if (! empty($attr)) {
                // Ambil semua key dari atribut barang
                $currentKeys = array_keys($attr);

                // Filter: Hanya ambil yang TIDAK ada di dalam daftar excludedKeys
                $filteredKeys = array_filter($currentKeys, function ($key) use ($excludedKeys) {
                    return ! in_array(strtolower($key), $excludedKeys);
                });

                $this->keys = array_unique(array_merge($this->keys, $filteredKeys));
            }
        }

        if ($category_id) {
            $this->labels = MasterCategoryAttribute::where('master_category_id', $category_id)
                ->whereIn('key', $this->keys)
                ->pluck('name', 'key')
                ->toArray();
        }
    }

    public function collection()
    {
        return $this->items;
    }

    public function startCell(): string
    {
        return 'A7'; // Data tabel dimulai dari baris ke-7 untuk memberi ruang header
    }

    public function headings(): array
    {
        $headers = ['NO', 'KODE BARANG - NUP', 'NAMA BARANG', 'KATEGORI'];
        foreach ($this->keys as $key) {
            $headers[] = strtoupper($this->labels[$key] ?? str_replace('_', ' ', $key));
        }
        return array_merge($headers, ['KONDISI', 'PENGGUNA BARANG']);
    }

    public function map($item): array
    {
        static $no = 0;
        $no++;
        $attr = is_string($item->attributes) ? json_decode($item->attributes, true) : ($item->attributes ?? []);

        // Menggabungkan kode dan nup: contoh 3100102002-1
        $kodeNup = $item->code . '-' . $item->nup;

        $row = [
            $no,
            $kodeNup,
            $item->name,
            $item->category->name ?? $this->category_name,
        ];

        foreach ($this->keys as $key) {
            $row[] = $attr[$key] ?? '-';
        }

        return array_merge($row, [
            $item->condition->name ?? '-',
            $item->user->name ?? '-',
        ]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet         = $event->sheet->getDelegate();
                $highestColumn = $sheet->getHighestColumn();
                $highestRow    = $sheet->getHighestRow();
                $sekretaris    = MasterUser::where('job_title', 'like', '%Sekretaris%')->first();

                // --- HEADER SECTION ---
                $sheet->mergeCells("A1:{$highestColumn}1");
                $sheet->setCellValue('A1', 'DAFTAR BARANG KUASA PENGGUNA');

                $sheet->mergeCells("A2:{$highestColumn}2");
                $sheet->setCellValue('A2', strtoupper($this->category_name));

                $sheet->mergeCells("A3:{$highestColumn}3");
                $sheet->setCellValue('A3', 'POSISI PER TANGGAL ' . $this->until_date);

                $sheet->getStyle("A1:A3")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("A1:A2")->getFont()->setBold(true)->setSize(14);

                // --- INFO SATKER ---
                $sheet->setCellValue('A5', 'Nama UAKPB');
                $sheet->setCellValue('B5', ': KPU KOTA BIMA');
                $sheet->getStyle("A5:B5")->getFont()->setBold(true);

                // --- TABLE STYLING ---
                $sheet->getStyle("A7:{$highestColumn}7")->getFont()->setBold(true);
                $sheet->getStyle("A7:{$highestColumn}7")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("A7:{$highestColumn}{$highestRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

                // --- FOOTER (TANDA TANGAN) ---
                $footerRow   = $highestRow + 2;
                $tglSekarang = \Carbon\Carbon::now()->translatedFormat('d F Y');

                $sheet->setCellValue("{$highestColumn}{$footerRow}", "Kota Bima, " . $tglSekarang);
                $sheet->setCellValue("{$highestColumn}" . ($footerRow + 1), "Kuasa Pengguna Barang");

                $nameRow = $footerRow + 5;
                $sheet->setCellValue("{$highestColumn}{$nameRow}", $sekretaris->name ?? '( ................................. )');
                $sheet->setCellValue("{$highestColumn}" . ($nameRow + 1), "NIP. " . ($sekretaris->employee_id ?? '............................'));

                $sheet->getStyle("{$highestColumn}{$footerRow}:{$highestColumn}" . ($nameRow + 1))
                    ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("{$highestColumn}{$nameRow}")->getFont()->setBold(true)->setUnderline(true);

                // Auto-size columns
                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }
}
