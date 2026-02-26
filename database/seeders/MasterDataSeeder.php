<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasterCategory;
use App\Models\MasterStatus;
use App\Models\MasterCondition;

class MasterDataSeeder extends Seeder
{
    public function run()
    {
        // Categories
        $categories = ['Elektronik', 'Kendaraan Dinas', 'Bangunan', 'Peralatan Kantor'];
        foreach ($categories as $cat) {
            MasterCategory::firstOrCreate(['name' => $cat]);
        }

        // Statuses
        $statuses = ['Aktif', 'Tidak Aktif'];
        foreach ($statuses as $status) {
            MasterStatus::firstOrCreate(['name' => $status]);
        }

        // Conditions
        $conditions = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
        foreach ($conditions as $cond) {
            MasterCondition::firstOrCreate(['name' => $cond]);
        }
    }
}