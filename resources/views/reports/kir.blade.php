<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 0.8cm;
            size: A4 portrait;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 8.5pt; /* Sedikit diperkecil agar proporsional */
            line-height: 1.2;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        .header h2 {
            margin: 0;
            text-transform: uppercase;
            font-size: 11pt;
            text-decoration: underline;
        }
        
        .info-table {
            width: 100%;
            margin-bottom: 10px;
        }
        .info-label { width: 80pt; font-weight: bold; }
        .info-sep { width: 10pt; }

        /* KUNCI PERBAIKAN DI SINI */
        .main-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .main-table th, .main-table td {
            border: 1px solid black;
            padding: 3px 1px;
            word-wrap: break-word;
            overflow: hidden;
        }
        .main-table th {
            background-color: #f0f0f0;
            font-size: 8pt;
        }

        /* Definisi Lebar Kolom yang Akurat (Total harus ~530pt) */
        .col-no    { width: 18pt !important; }  /* Sangat sempit untuk angka 1-2 digit */
        .col-kode  { width: 45pt; }
        .col-nup   { width: 20pt; }
        .col-nama  { width: 80pt; }
        .col-merk  { width: 50pt; }
        .col-kond  { width: 40pt; }
        .col-user  { width: 100pt; }
        .col-ket   { width: 122pt; } /* Sisa ruang diberikan ke keterangan */

        .text-center { text-align: center; }
        
        .col-numbers td {
            font-size: 7pt;
            background-color: #f9f9f9;
            height: 7pt;
        }

        /* PERBAIKAN FOOTER DI SINI */
        .footer-table {
            width: 100%;
            margin-top: 30px;
            border-collapse: collapse;
        }
        /* Kolom pertama kosong untuk mendorong kolom kedua ke kanan */
        .footer-empty {
            width: 60%; 
        }
        .footer-sig {
            width: 40%;
            text-align: center;
            vertical-align: top;
        }
        .footer-sig .responsible {
            display: inline-block;
            font-weight: bold;
            text-decoration: underline;
        }
        .sig-space { height: 60px; }
    </style>
</head>
<body>

    <div class="header">
        <h2>KARTU INVENTARIS RUANGAN</h2>
    </div>

    <table class="info-table">        
        <tr>
            <td class="info-label">INSTANSI</td>
            <td class="info-sep">:</td>
            <td>KOMISI PEMILIHAN UMUM</td>
        </tr>
        <tr>
            <td class="info-label">UNIT KERJA</td>
            <td class="info-sep">:</td>
            <td>{{ $unit_kerja ?? 'SEKRETARIAT KPU KOTA BIMA' }}</td>
        </tr>
        <tr>
            <td class="info-label">RUANGAN</td>
            <td class="info-sep">:</td>
            <td>{{ $ruangan_name ?? '................................' }}</td>
        </tr>
        <tr>
            <td class="info-label">KODE RUANGAN</td>
            <td class="info-sep">:</td>
            <td>{{ $ruangan_code ?? '................................' }}</td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th class="col-no">No</th>
                <th class="col-kode">Kode Barang</th>
                <th class="col-nup">NUP</th>
                <th class="col-nama">Nama Barang</th>
                <th class="col-merk">Merk</th>
                <th class="col-kond">Kondisi</th>
                <th class="col-user">Pengguna</th>                
            </tr>
            <tr class="col-numbers text-center">
                <td class="col-no">1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $index => $item)
                @php
                    $attrs = is_string($item->attributes) ? json_decode($item->attributes, true) : ($item->attributes ?? []);
                @endphp
                <tr>
                    <td class="col-no text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ $item->code }}</td>
                    <td class="text-center">{{ $item->nup ?? '1' }}</td>
                    <td class="text-center">{{ $item->name }}</td>
                    <td class="text-center">{{ $attrs['merk'] ?? ($attrs['tipe'] ?? '-') }}</td>
                    <td class="text-center">{{ $item->condition?->name ?? '-' }}</td>
                    <td class="text-center">{{ $item->user?->name ?? '-' }}</td>                    
                </tr>
            @empty
                @for($i = 1; $i <= 10; $i++)
                <tr>
                    <td class="col-no" style="height: 20px;"></td>
                    @for($j=0; $j<7; $j++) <td></td> @endfor
                </tr>
                @endfor
            @endforelse
        </tbody>
    </table>

    <table class="footer-table">
        <tr>
            <td class="footer-empty"></td>
            
            <td class="footer-sig">
                Kota Bima, {{ now()->translatedFormat('d F Y') }}<br>
                Kuasa Pengguna Barang
                <div class="sig-space"></div>
                <strong class="responsible"> {{ $responsible ?? '........................................' }} </strong><br>               
            </td>
        </tr>
    </table>

</body>
</html>