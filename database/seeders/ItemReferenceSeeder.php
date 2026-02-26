<?php

namespace Database\Seeders;

use App\Models\MasterItemReference;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemReferenceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Kosongkan tabel
        DB::table('master_item_references')->truncate();

        $filePath = database_path('data/item_references.csv');

        if (!file_exists($filePath)) {
            $this->command->error("File tidak ditemukan di: $filePath");
            return;
        }

        $file = fopen($filePath, 'r');
        
        // 2. LEWATI BARIS PERTAMA (Header: code;name)
        fgetcsv($file, 2000, ";"); 

        $data = [];
        $batchSize = 1000;
        $count = 0;

        $this->command->info("Sedang mengimport data dari CSV...");

        // 3. Gunakan ";" sebagai pemisah
        while (($row = fgetcsv($file, 2000, ";")) !== FALSE) {
            // Validasi baris agar tidak ada 'undefined array key'
            if (!isset($row[0]) || !isset($row[1]) || trim($row[0]) === '') {
                continue;
            }

            $data[] = [
                'code' => trim($row[0]),
                'name' => trim($row[1]),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            if (count($data) >= $batchSize) {
                MasterItemReference::insert($data);
                $data = [];
            }
        }

        if (!empty($data)) {
            MasterItemReference::insert($data);
        }

        fclose($file);
        $this->command->info("Selesai! Berhasil mengimport $count data barang.");
    }
}