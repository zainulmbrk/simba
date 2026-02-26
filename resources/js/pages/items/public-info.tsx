import { Head } from '@inertiajs/react';

export default function PublicInfo({
    item,
    attributeLabels,
    locationLabels,
}: any) {
    return (
        <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
            <Head title={`Info: ${item.name}`} />

            <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-100">
                {/* Header Instansi */}
                <div className="bg-red-900 p-6 text-center text-white">
                    <p className="text-xs font-semibold tracking-widest uppercase opacity-70">
                        Sistem Informasi Manajemen Barang (SIMBA)
                    </p>
                    <h1 className="mt-1 text-xl font-extrabold uppercase">
                        KPU KOTA BIMA
                    </h1>
                </div>

                {/* Foto Barang */}
                <div className="relative aspect-video w-full bg-slate-200">
                    <img
                        src={
                            item.files
                                ? `/storage/${item.files}`
                                : '/assets/placeholder.svg'
                        }
                        className="h-full w-full object-cover"
                        alt={item.name}
                    />
                    <div className="absolute right-4 bottom-4 rounded-full bg-red-900 px-4 py-1 text-xs font-bold text-white shadow-lg">
                        {item.status?.name || 'Aktif'}
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl leading-tight font-black text-slate-800">
                            {item.name}
                        </h2>
                        <p className="text-sm font-medium text-red-900">
                            {item.category?.name}
                        </p>
                    </div>

                    {/* Grid Info Cepat */}
                    <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                                Kode Barang
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                                {item.code}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                                NUP
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                                {item.nup}
                            </p>
                        </div>
                    </div>

                    {/* List Detail */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <span className="text-sm font-medium text-slate-500">
                                Pengguna
                            </span>
                            <span className="text-sm font-bold text-slate-800">
                                {item.user?.name || '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <span className="text-sm font-medium text-slate-500">
                                Penanggung Jawab
                            </span>
                            <span className="text-sm font-bold text-slate-800">
                                {item.responsible}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                            <span className="text-sm font-medium text-slate-500">
                                Kondisi
                            </span>
                            <span
                                className={`rounded px-2 py-0.5 text-sm font-bold ${item.condition?.name === 'Baik' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {item.condition?.name}
                            </span>
                        </div>
                    </div>

                    {/* Lokasi Aset */}
                    <div className="mt-8">
                        <h3 className="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
                            📍 Lokasi Penempatan
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(item.location_values || {}).map(
                                ([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex flex-col rounded-xl border border-slate-100 p-3"
                                    >
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            {locationLabels[key] || key}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-700">
                                            {String(value)}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 text-center">
                    <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition active:scale-95">
                        Laporkan Kendala / Kerusakan
                    </button>
                    <p className="mt-4 text-[9px] tracking-tighter text-slate-400">
                        Terdata secara digital oleh Sistem Informasi Manajemen
                        Barang (SIMBA)
                    </p>
                </div>
            </div>
        </div>
    );
}
