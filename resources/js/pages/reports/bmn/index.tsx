import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FileBarChart, FileTextIcon, SheetIcon } from 'lucide-react';
import { useState } from 'react';

export default function ReportIndex({ categories }: { categories: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [untilDate, setUntilDate] = useState(
        new Date().toISOString().split('T')[0],
    );

    const handleDownload = (type: 'pdf' | 'excel') => {
        setErrors([]);

        if (!selectedCategory) {
            setErrors([
                'Kategori barang wajib dipilih sebelum mengunduh laporan.',
            ]);
            return;
        }
        const params = new URLSearchParams({
            category_id: selectedCategory,
            until_date: untilDate,
            export: type,
        }).toString();

        window.open(`/reports/bmn/download?${params}`, '_blank');
    };

    return (
        <AppLayout>
            <Head title="Laporan BMN" />
            <div className="mx-auto max-w-4xl p-8">
                <div className="rounded-xl border p-6 shadow-sm dark:bg-muted">
                    <div className="mb-6 flex items-center gap-3 border-b pb-4">
                        <FileBarChart className="text-primary" size={28} />
                        <h1 className="text-xl font-bold">
                            Laporan Inventaris BMN
                        </h1>
                    </div>

                    {errors.length > 0 && (
                        <div className="mb-6">
                            <AlertError
                                title="Gagal Mengunduh"
                                errors={errors}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Pilih Kategori */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Pilih Kategori Barang
                            </label>
                            <select
                                className={`w-full rounded-md border p-2 ${errors.length > 0 && !selectedCategory ? 'border-destructive' : ''}`}
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    if (e.target.value) setErrors([]);
                                }}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Periode */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Cetak Data Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-md border p-2 text-sm"
                                value={untilDate}
                                onChange={(e) => setUntilDate(e.target.value)}
                            />
                            <p className="text-xs text-slate-500">
                                *Menampilkan semua data yang diinput hingga
                                tanggal ini.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <Button
                            onClick={() => handleDownload('excel')}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            <SheetIcon size={16} className="mr-2" /> Download
                            Excel
                        </Button>
                        <Button
                            onClick={() => handleDownload('pdf')}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            <FileTextIcon size={16} className="mr-2" /> Download
                            PDF
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
