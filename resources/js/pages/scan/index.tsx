import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanQrCodeIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ScanPage() {
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isInitializing = useRef(false);
    // Flag untuk mengunci agar tidak terjadi scan ganda
    const isScanned = useRef(false);

    useEffect(() => {
        const container = document.getElementById('reader');
        if (!container || isInitializing.current) return;

        isInitializing.current = true;

        // Bersihkan kontainer secara paksa dari sisa render sebelumnya
        container.innerHTML = '';

        const html5QrCode = new Html5Qrcode('reader');
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        // 1. JIKA SUDAH PERNAH SCAN, JANGAN PROSES LAGI
                        if (isScanned.current) return;

                        // 2. KUNCI PROSES
                        isScanned.current = true;

                        // 3. LOGIKA PEMBERSIH URL (Mencegah URL Double)
                        let rawText = decodedText.trim();
                        let targetUrl = rawText;

                        // Jika terdeteksi string "http" lebih dari satu kali
                        if ((rawText.match(/http/g) || []).length > 1) {
                            // Ambil dari posisi "http" yang paling terakhir
                            const lastHttpIndex = rawText.lastIndexOf('http');
                            targetUrl = rawText.substring(lastHttpIndex);
                        }

                        // 4. Hentikan kamera segera
                        html5QrCode
                            .stop()
                            .then(() => {
                                if (
                                    targetUrl.includes('/i/') ||
                                    targetUrl.includes('/items/')
                                ) {
                                    // Gunakan replace agar URL bersih (tidak menumpuk)
                                    window.location.replace(targetUrl);
                                } else {
                                    router.get(`/items/${targetUrl}`);
                                }
                            })
                            .catch((err) => {
                                console.error(
                                    'Gagal menghentikan scanner:',
                                    err,
                                );
                                // Fallback: langsung pindah jika stop gagal
                                window.location.replace(targetUrl);
                            });
                    },
                    undefined,
                );
            } catch (err) {
                console.error('Gagal start kamera:', err);
                if (isInitializing.current) {
                    setError(
                        'Kamera gagal diakses. Pastikan Anda menggunakan HTTPS dan izin kamera aktif.',
                    );
                }
            }
        };

        const timeoutId = setTimeout(() => {
            startScanner();
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            isInitializing.current = false;
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current
                        .stop()
                        .then(() => {
                            if (container) container.innerHTML = '';
                        })
                        .catch((e) => console.log('Cleanup error:', e));
                }
            }
        };
    }, []);

    return (
        <AppLayout>
            <Head title="Scan QR Code" />

            <div className="flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md overflow-hidden border-none shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <ScanQrCodeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Scan QR Barang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Frame Kamera */}
                        <div className="relative mx-auto aspect-square overflow-hidden rounded-xl border-4 border-muted bg-black shadow-inner">
                            <div id="reader" className="h-full w-full"></div>

                            {/* Overlay Garis Fokus (Visual Only) */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="h-64 w-64 border-2 border-primary/50 bg-transparent opacity-30"></div>
                                <div className="absolute h-[2px] w-64 animate-pulse bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2 text-center">
                            <p className="text-sm font-medium text-foreground">
                                Pastikan QR Code berada di dalam kotak
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Arahkan kamera ke label BMN. Jika menggunakan
                                laptop, pastikan cahaya cukup terang agar kode
                                terbaca.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                #reader video {
                    object-fit: cover !important;
                }
                #reader__dashboard, #reader img {
                    display: none !important;
                }
                #reader {
                    border: none !important;
                }
            `}</style>
        </AppLayout>
    );
}
