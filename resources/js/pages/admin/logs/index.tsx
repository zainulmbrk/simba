import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronRight, Clock, FileText, Package, Trash2 } from 'lucide-react';

interface LogEntry {
    id: number;
    description: string;
    event: string;
    subject_type: string;
    subject: {
        id: number;
        name?: string;
        code?: string;
    } | null;
    causer: { name: string } | null;
    properties: {
        old?: Record<string, any>;
        attributes?: Record<string, any>;
        // Tambahan interface untuk menangkap data cadangan
        old_name?: string;
        old_code?: string;
        new_user_name?: string;
        old_user_name?: string;
    };
    created_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Index({
    logs,
    filters,
}: {
    logs: {
        data: LogEntry[];
        links: PaginationLinks[];
        current_page: number;
        total: number;
    };
    filters: { start_date?: string; end_date?: string };
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Activity Logs', href: '#' },
    ];

    const getEventBadge = (event: string) => {
        const styles = {
            created: 'bg-green-100 text-green-700 border-green-200',
            updated: 'bg-blue-100 text-blue-700 border-blue-200',
            deleted: 'bg-red-100 text-red-700 border-red-200',
        };
        return (
            <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${styles[event as keyof typeof styles] || 'bg-gray-100'}`}
            >
                {event}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-primary">
                                Riwayat Aktivitas Sistem
                            </h3>
                            <p className="text-sm text-primary">
                                Menampilkan {logs.data.length} aktivitas terbaru
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border shadow-sm">
                            <div className="divide-y divide-muted">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => {
                                        // LOGIKA IDENTIFIKASI BARANG
                                        const itemName =
                                            log.subject?.name ||
                                            log.properties?.old_name ||
                                            'Aset';
                                        const itemCode =
                                            log.subject?.code ||
                                            log.properties?.old_code ||
                                            'Tanpa Kode';
                                        const isDeleted =
                                            log.event === 'deleted';

                                        return (
                                            <div
                                                key={log.id}
                                                className="group p-5 transition-all hover:bg-secondary/30"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Icon Section */}
                                                    <div className="mt-1 hidden sm:block">
                                                        <div
                                                            className={`rounded-lg bg-accent p-2`}
                                                        >
                                                            {log.event ===
                                                                'updated' && (
                                                                <FileText className="h-5 w-5 text-chart-3" />
                                                            )}
                                                            {log.event ===
                                                                'created' && (
                                                                <Package className="h-5 w-5 text-chart-2" />
                                                            )}
                                                            {log.event ===
                                                                'deleted' && (
                                                                <Trash2 className="h-5 w-5 text-destructive" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            {getEventBadge(
                                                                log.event,
                                                            )}
                                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(
                                                                    log.created_at,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                    {
                                                                        dateStyle:
                                                                            'medium',
                                                                        timeStyle:
                                                                            'short',
                                                                    },
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="text-sm leading-relaxed text-muted-foreground">
                                                            <span className="font-bold text-primary">
                                                                {log.causer
                                                                    ?.name ||
                                                                    'Sistem'}
                                                            </span>{' '}
                                                            {/* LOGIKA NARASI DINAMIS */}
                                                            {(() => {
                                                                if (
                                                                    log.event ===
                                                                    'created'
                                                                )
                                                                    return 'menambahkan aset baru';
                                                                if (
                                                                    log.event ===
                                                                    'deleted'
                                                                )
                                                                    return 'menghapus permanen';

                                                                if (
                                                                    log.event ===
                                                                    'updated'
                                                                ) {
                                                                    const attrs =
                                                                        log
                                                                            .properties
                                                                            ?.attributes ||
                                                                        {};

                                                                    // Cek jika ada perubahan user_id DAN kita punya data nama user baru
                                                                    if (
                                                                        Object.keys(
                                                                            attrs,
                                                                        ).includes(
                                                                            'user_id',
                                                                        )
                                                                    ) {
                                                                        const newName =
                                                                            log
                                                                                .properties
                                                                                ?.new_user_name;
                                                                        const oldName =
                                                                            log
                                                                                .properties
                                                                                ?.old_user_name;

                                                                        return (
                                                                            <span>
                                                                                mengubah
                                                                                pengguna
                                                                                dari{' '}
                                                                                <span className="font-bold text-destructive">
                                                                                    {oldName ||
                                                                                        '...'}
                                                                                </span>{' '}
                                                                                menjadi{' '}
                                                                                <span className="font-bold text-chart-2">
                                                                                    {newName ||
                                                                                        '...'}
                                                                                </span>{' '}
                                                                                pada
                                                                            </span>
                                                                        );
                                                                    }
                                                                    return 'memperbarui informasi';
                                                                }
                                                                return log.description;
                                                            })()}{' '}
                                                            <span
                                                                className={`font-bold ${isDeleted ? 'text-destructive' : 'text-chart-3'}`}
                                                            >
                                                                {itemName}
                                                            </span>
                                                            <span className="ml-1 font-mono text-xs text-muted-foreground">
                                                                ({itemCode})
                                                            </span>
                                                        </div>

                                                        {/* JSON Comparison (Hanya muncul saat hover) */}
                                                        {log.event ===
                                                            'updated' && (
                                                            <div className="mt-4 hidden animate-in fade-in slide-in-from-top-1 group-hover:block">
                                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                                    <div className="rounded-lg border p-3">
                                                                        <span className="mb-2 block text-xs font-bold text-destructive uppercase">
                                                                            Sebelum
                                                                        </span>
                                                                        <pre className="overflow-x-auto font-mono text-xs text-destructive">
                                                                            {JSON.stringify(
                                                                                log
                                                                                    .properties
                                                                                    .old,
                                                                                null,
                                                                                2,
                                                                            )}
                                                                        </pre>
                                                                    </div>
                                                                    <div className="rounded-lg border p-3">
                                                                        <span className="mb-2 block text-xs font-bold text-chart-2 uppercase">
                                                                            Sesudah
                                                                        </span>
                                                                        <pre className="overflow-x-auto font-mono text-xs text-chart-2">
                                                                            {JSON.stringify(
                                                                                log
                                                                                    .properties
                                                                                    .attributes,
                                                                                null,
                                                                                2,
                                                                            )}
                                                                        </pre>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-muted-foreground transition">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-20 text-center text-muted-foreground">
                                        Belum ada aktivitas.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
