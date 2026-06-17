<!DOCTYPE html>
<html>
<head>
    <style>
        /* Ukuran kertas A4 Landscape */
        @page { 
            margin: 0.5cm; 
            size: a4 landscape;
        }
        body { 
            font-family: sans-serif; 
            margin: 0; 
            padding: 0; 
        }
        
        .container { 
            width: 100%;         
            font-size: 0; 
        }

        .label-box {
            display: inline-block;
            vertical-align: top;
            /* Lebar 5cm */
            width: 6cm;
            height: 2.5cm;
            border: 1px dashed #bbb;            
            padding: 12px;
            margin: 2px;
            box-sizing: border-box;
            position: relative;
            /* Kembalikan font-size untuk teks di dalam box */
            font-size: 11px;
            page-break-inside: avoid;
        }

        .header {
            font-size: 9px;
            font-weight: bold;
            border-bottom: 1px solid #000;
            margin-bottom: 10px;
            text-align: center;
            text-transform: uppercase;
        }

        .content { 
            width: 70%; 
            line-height: 1.5;
            font-size: 8px;
        }

        .content strong {
            display: inline-block;
            width: 60px;
        }

        /* .qr-code {
            position: absolute;
            top: 35px;
            right: 12px;
        }

        .qr-code img {
            display: block;
        } */

        .qr-code {
            position: absolute;
            top: 40px;
            right: 12px;
            width: 60px;
            height: 60px;
        }

        .qr-code img.qr-img {
            width: 60px;
            height: 60px;
            display: block;
        }

        /* KUNCI: Logo menumpuk di tengah QR */
        .qr-logo {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 25px;
            height: 25px;
            background-color: white;
            /* padding: 10px; */
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        @foreach($items as $item)
            <div class="label-box">
                <div class="header">Label Inventaris BMN KPU Kota Bima</div>
                <div class="content">
                    <strong>Nama</strong>: {{ $item->name }}<br>
                    <strong>Kode</strong>: {{ $item->code }}<br>
                    <strong>NUP</strong>: {{ $item->nup }}<br>
                    <strong>User</strong>: {{ $item->user->name ?? ($item->user ?? '-') }}<br>
                    <strong>Kondisi</strong>: {{ $item->condition->name ?? ($item->condition ?? '-') }}
                </div>
                <div class="qr-code">
                    @if($item->qrcode_image)
                        <img src="{{ $item->qrcode_image }}" class="qr-img">
                        <img src="{{ public_path('assets/logo-kpu.png') }}" class="qr-logo">
                    @endif
                </div>
            </div>
        @endforeach
    </div>
</body>
</html>