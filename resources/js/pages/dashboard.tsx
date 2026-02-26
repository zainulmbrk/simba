import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowUpRight, History, Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({ stats, recentLogs }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* 1. STATS CARDS */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Total Barang */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Total Aset
                            </h3>
                            <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">
                                {stats?.total_items || 0}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Unit
                            </span>
                        </div>
                    </div>

                    {/* Barang Kondisi Baik */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Kondisi Layak
                            </h3>
                            <ArrowUpRight className="h-4 w-4 text-chart-2" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">
                                {stats?.good_condition || 0}
                            </span>
                            <span className="text-xs text-chart-2 text-muted-foreground">
                                Siap Pakai
                            </span>
                        </div>
                    </div>

                    {/* Peringatan/Status Tertentu */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Butuh Perbaikan
                            </h3>
                            <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-destructive">
                                {stats?.bad_condition || 0}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Unit
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. RECENT ACTIVITY (Kotak Besar Bawah) */}
                <div className="relative flex-1 overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b p-4">
                        <div className="flex items-center gap-2 font-bold">
                            <History className="h-4 w-4" />
                            Aktivitas Terbaru
                        </div>
                        <Link
                            href="/logs"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="p-4">
                        {/* List simpel aktivitas terakhir */}
                        <div className="space-y-4">
                            {recentLogs?.map((log: any) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                            {log.causer?.name} {log.description}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="rounded bg-muted px-2 py-1 font-mono text-xs">
                                        {log.event}
                                    </div>
                                </div>
                            ))}
                            {!recentLogs?.length && (
                                <p className="py-10 text-center text-sm text-muted-foreground">
                                    Belum ada aktivitas terbaru.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
