<?php
// 1. Paksa PHP untuk menampilkan error ke layar
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // 2. Tentukan jalur ke file index utama Laravel
    $indexPath = __DIR__ . '/../public/index.php';

    // 3. Cek apakah filenya benar-benar ada di sana
    if (! file_exists($indexPath)) {
        die("<h1>Error: File Tidak Ditemukan</h1>Jalur: " . $indexPath);
    }

    require $indexPath;

} catch (\Throwable $e) {
    // 4. Jika Laravel gagal booting, tampilkan pesannya
    echo "<h1>SIMBA Error Detector</h1>";
    echo "<b>Pesan Error:</b> " . $e->getMessage() . "<br>";
    echo "<b>Lokasi File:</b> " . $e->getFile() . " (Baris: " . $e->getLine() . ")<br>";
    echo "<b>Trace:</b> <pre>" . $e->getTraceAsString() . "</pre>";
}
