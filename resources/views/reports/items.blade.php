<!DOCTYPE html>
<html>
<head>
    <title>Laporan BMN - {{ $category->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 9px; margin: 0; padding: 10px; }
        .text-center { text-align: center; }
        .header-title { font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 2px; }
        .sub-header { font-size: 11px; font-weight: bold; margin-bottom: 20px; }

        .info-table { margin-bottom: 2px; font-weight: bold; border-collapse: collapse; }
        .info-table td { border: none; padding: 2px 0; vertical-align: top; }
        .label-col { width: 80px; }
        .separator-col { width: 15px; text-align: center; }

        table.main-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.main-table th, table.main-table td {
            border: 1px solid #000;
            padding: 4px;
            word-wrap: break-word;
            vertical-align: middle;
        }
        table.main-table th { background-color: #f2f2f2; text-transform: uppercase; font-size: 8px; text-align: center; }

        .footer { margin-top: 40px; width: 100%; }
        .footer td { border: none; text-align: center; width: 50%; }
    </style>
</head>
<body>

    <div class="text-center">
        <div class="header-title">DAFTAR BARANG KUASA PENGGUNA</div>
        <div class="header-title">{{ $category->name }}</div>
        <div class="sub-header">
            POSISI PER TANGGAL {{ \Carbon\Carbon::parse($until_date ?? now())->format('d-m-Y') }}
        </div>
    </div>

    <table class="info-table">
        <tr>
            <td class="label-col">Nama UAKPB</td>
            <td class="separator-col">:</td>
            <td>KPU KOTA BIMA</td>
        </tr>
    </table>

    @php
        $sekretaris = \App\Models\MasterUser::where('job_title', 'like', '%Sekretaris%')->first();

        // --- LOGIKA BLACKLIST ATRIBUT ---
        $excludedKeys = ['specification', 'deskripsi', 'catatan_teknis'];
        $dynamicKeys = [];

        foreach($items as $item) {
            $attr = is_string($item->attributes) ? json_decode($item->attributes, true) : $item->attributes;
            if(!empty($attr) && is_array($attr)) {
                foreach(array_keys($attr) as $key) {
                    // Hanya masukkan jika TIDAK ada di blacklist
                    if(!in_array(strtolower($key), $excludedKeys) && !in_array($key, $dynamicKeys)) {
                        $dynamicKeys[] = $key;
                    }
                }
            }
        }

        $attributeLabels = \App\Models\MasterCategoryAttribute::where('master_category_id', $category->id)
            ->whereIn('key', $dynamicKeys)
            ->pluck('name', 'key')
            ->toArray();
    @endphp

    <table class="main-table">
        <thead>
            <tr>
                <th style="width: 25px;">No</th>
                <th style="width: 85px;">Kode Barang-NUP</th>
                <th style="width: 100px;">Nama Barang</th>
                <th style="width: 80px;">Kategori</th> @foreach($dynamicKeys as $key)
                    <th>{{ $attributeLabels[$key] ?? ucfirst(str_replace('_', ' ', $key)) }}</th>
                @endforeach
                <th style="width: 50px;">Kondisi</th>
                <th style="width: 90px;">Pengguna Barang</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                @php $itemAttr = is_string($item->attributes) ? json_decode($item->attributes, true) : ($item->attributes ?? []); @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->code }}-{{ $item->nup }}</td>
                    <td>{{ $item->name }}</td>
                    <td class="text-center">{{ $item->category->name ?? $category->name }}</td>

                    @foreach($dynamicKeys as $key)
                        <td class="text-center">{{ $itemAttr[$key] ?? '-' }}</td>
                    @endforeach

                    <td class="text-center">{{ $item->condition->name ?? '-' }}</td>
                    <td>{{ $item->user->name ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="footer">
        <tr>
            <td style="width: 60%;"></td>
            <td style="width: 40%; text-align: center;">
                Kota Bima, {{ \Carbon\Carbon::parse($until_date ?? now())->locale('id')->translatedFormat('d F Y') }}<br>
                Kuasa Pengguna Barang
                <br><br><br><br><br>
                <strong>{{ $sekretaris->name ?? '( ................................. )' }}</strong><br>
                NIP. {{ $sekretaris->employee_id ?? '............................' }}
            </td>
        </tr>
    </table>
    </body>
</html>
