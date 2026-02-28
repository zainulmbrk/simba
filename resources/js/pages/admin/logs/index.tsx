import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                    styles[event as keyof typeof styles] || 'bg-gray-100'
                }`}
            >
                {event}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6">
                        {/* HEADER SECTION */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-primary">
                                    Riwayat Aktivitas Sistem
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Total {logs.total} aktivitas tercatat dalam
                                    sistem
                                </p>
                            </div>
                            <div className="self-start rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary sm:self-auto">
                                Halaman {logs.current_page}
                            </div>
                        </div>

                        {/* LOG LIST CARD */}
                        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                            <div className="divide-y divide-muted">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => {
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
                                                        <div className="rounded-lg bg-accent p-2">
                                                            {log.event ===
                                                                'updated' && (
                                                                <FileText className="h-5 w-5 text-blue-500" />
                                                            )}
                                                            {log.event ===
                                                                'created' && (
                                                                <Package className="h-5 w-5 text-green-500" />
                                                            )}
                                                            {log.event ===
                                                                'deleted' && (
                                                                <Trash2 className="h-5 w-5 text-destructive" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                                            {getEventBadge(
                                                                log.event,
                                                            )}
                                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Clock className="h-3.3 w-3.5" />
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
                                                            <span className="font-bold text-foreground">
                                                                {log.causer
                                                                    ?.name ||
                                                                    'Sistem'}
                                                            </span>{' '}
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
                                                                                <span className="font-bold text-green-600">
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
                                                                className={`font-bold ${isDeleted ? 'text-destructive' : 'text-blue-600'}`}
                                                            >
                                                                {itemName}
                                                            </span>
                                                            <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                                                ({itemCode})
                                                            </span>
                                                        </div>

                                                        {/* JSON Comparison (Hanya muncul saat hover) */}
                                                        {log.event ===
                                                            'updated' && (
                                                            <div className="mt-4 hidden animate-in fade-in slide-in-from-top-1 group-hover:block">
                                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                                    <div className="rounded-lg border bg-red-50/30 p-3">
                                                                        <span className="mb-2 block text-[10px] font-bold tracking-wider text-destructive uppercase">
                                                                            Sebelum
                                                                        </span>
                                                                        <pre className="overflow-x-auto text-[11px] text-destructive">
                                                                            {JSON.stringify(
                                                                                log
                                                                                    .properties
                                                                                    .old,
                                                                                null,
                                                                                2,
                                                                            )}
                                                                        </pre>
                                                                    </div>
                                                                    <div className="rounded-lg border bg-green-50/30 p-3">
                                                                        <span className="mb-2 block text-[10px] font-bold tracking-wider text-green-700 uppercase">
                                                                            Sesudah
                                                                        </span>
                                                                        <pre className="overflow-x-auto text-[11px] text-green-700">
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

                                                    <div className="text-muted-foreground/40 transition-colors group-hover:text-primary">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-20 text-center text-muted-foreground italic">
                                        Belum ada aktivitas yang tercatat.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PAGINATION SECTION */}
                        {logs.total > logs.data.length && (
                            <div className="flex flex-col items-center justify-between gap-4 px-2 py-2 sm:flex-row">
                                <div className="text-xs text-muted-foreground sm:text-sm">
                                    Menampilkan{' '}
                                    <span className="font-semibold text-foreground">
                                        {logs.data.length}
                                    </span>{' '}
                                    dari{' '}
                                    <span className="font-semibold text-foreground">
                                        {logs.total}
                                    </span>{' '}
                                    log
                                </div>

                                <div className="flex flex-wrap justify-center gap-1">
                                    {logs.links.map((link, index) => {
                                        // Cek apakah ini tombol Previous atau Next (biasanya mengandung simbol atau kata)
                                        const isNextPrev =
                                            link.label.includes('Previous') ||
                                            link.label.includes('Next');

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`flex h-8 items-center justify-center rounded-md border text-xs transition-all sm:h-9 sm:text-sm ${isNextPrev ? 'px-2' : 'min-w-[32px] px-2 sm:min-w-[36px]'} ${
                                                    link.active
                                                        ? 'border-primary bg-primary font-bold text-primary-foreground shadow-sm'
                                                        : 'bg-background text-foreground hover:border-accent-foreground/20 hover:bg-accent'
                                                } ${!link.url ? 'pointer-events-none cursor-not-allowed bg-muted opacity-30' : ''}`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
