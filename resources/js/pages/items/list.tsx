import { DeleteConfirmDialog } from '@/components/delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ItemsFormLayout from '@/layouts/items/form-layout';
import { ItemForm } from '@/layouts/items/item-form';
import {
    defaultFormValues,
    getLabel,
    mapItemToForm,
} from '@/layouts/items/item-form.helpers';
import { buildOptions } from '@/layouts/items/item-options';
import ItemsLayout from '@/layouts/items/layout';
import type { Item } from '@/types';
import { type BreadcrumbItem, ItemFormValues } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    EyeIcon,
    PlusIcon,
    PrinterIcon,
    SquarePenIcon,
    TrashIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ItemsList() {
    /* =================== GET PROPS FROM INERTIA =================== */
    const { props } = usePage<{
        items: Item[];
        categories: { id: number; name: string }[];
        statuses: { id: number; name: string }[];
        conditions: { id: number; name: string }[];
        users: { id: number; name: string; employee_id?: string }[]; //AFTER ADD USER TABLE
        itemReferences: { code: string; name: string }[];
        pagination: {
            links: { url: string | null; label: string; active: boolean }[];
            current_page: number;
            per_page: number;
            total: number;
        };
        filters?: {
            search?: string;
            category?: string;
            status?: string;
            condition?: string;
        };
    }>();

    // BREADCRUMBS
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'List Barang', href: '/items' },
    ];

    /* =================== GET ITEMS =================== */
    const items = props.items;

    /* =================== STATE =================== */
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [attributes, setAttributes] = useState<Record<string, string>>({});
    const [locationValues, setLocationValues] = useState<
        Record<string, string>
    >({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    /* =================== ARRAY TABLE HEADERS =================== */
    const { auth } = usePage().props as any;
    const isAdmin = auth.user.role === 'admin';
    const TABLE_HEADERS = [
        'No',
        'Nama Barang',
        'Kode Barang',
        'NUP',
        'Kategori',
        'Status BMN',
        'Kondisi',
        ...(isAdmin ? ['Pengguna Barang'] : []),
        'Files',
        'Aksi',
    ];

    /* =================== SELECT OPTIONS =================== */
    const CATEGORY_OPTIONS = buildOptions(props.categories);
    const STATUS_OPTIONS = buildOptions(props.statuses);
    const CONDITION_OPTIONS = buildOptions(props.conditions);

    /* ===================== FILTER ===================== */
    const [filters, setFilters] = useState({
        search: props.filters?.search || '',
        category: props.filters?.category || '',
        status: props.filters?.status || '',
        condition: props.filters?.condition || '',
    });

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        const finalFilters = {
            ...filters,
            ...newFilters,
            per_page: props.pagination.per_page,
        };

        setFilters(finalFilters);

        router.get('/items', finalFilters, {
            preserveState: true,
            replace: true,
        });
    };

    /* =================== HANDLE PAGE =================== */
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/items',
            { per_page: e.target.value },
            { preserveState: true, replace: true },
        );
    };

    /* =================== EFFECT EDIT =================== */
    useEffect(() => {
        if (editingItem) {
            setAttributes(
                typeof editingItem.attributes === 'string'
                    ? JSON.parse(editingItem.attributes)
                    : editingItem.attributes || {},
            );
        } else {
            setAttributes({});
        }
    }, [editingItem]);

    /* =================== HANDLE DELETE =================== */
    const handleDelete = () => {
        if (itemToDelete) {
            router.delete(`/items/${itemToDelete}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    /* =================== HANDLE SUBMIT =================== */
    const onSubmit = (data: ItemFormValues) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'photo' && value instanceof FileList) {
                    if (value.length > 0) formData.append('photo', value[0]);
                } else {
                    formData.append(key, value as any);
                }
            }
        });

        if (Object.keys(attributes).length > 0) {
            formData.append('attributes', JSON.stringify(attributes));
        }
        if (Object.keys(locationValues).length > 0) {
            formData.append('location_values', JSON.stringify(locationValues));
        }

        if (editingItem) {
            formData.append('_method', 'PUT');
            router.post(`/items/${editingItem.id}`, formData);
        } else {
            router.post('/items', formData);
        }

        setOpen(false);
        setEditingItem(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Barang" />
            <ItemsLayout>
                <Heading
                    title="List Barang"
                    description="Manage your items here"
                />
                <div className="space-y-4">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <select
                                value={filters.category}
                                onChange={(e) =>
                                    applyFilters({
                                        category: e.target.value,
                                    })
                                }
                                className="rounded border px-2 py-2 text-sm"
                            >
                                <option value="">Semua Kategori</option>
                                {props.categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    applyFilters({ status: e.target.value })
                                }
                                className="rounded border px-2 py-2 text-sm"
                            >
                                <option value="">Semua Status</option>
                                {props.statuses.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.condition}
                                onChange={(e) =>
                                    applyFilters({
                                        condition: e.target.value,
                                    })
                                }
                                className="rounded border px-2 py-2 text-sm"
                            >
                                <option value="">Semua Kondisi</option>
                                {props.conditions.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Cari nama / kode barang..."
                                value={filters.search}
                                onChange={(e) =>
                                    applyFilters({ search: e.target.value })
                                }
                                className="w-full max-w-sm rounded border px-3 py-2 text-sm"
                            />

                            {/* TOMBOL CETAK MASSAL BERDASARKAN FILTER */}
                            {isAdmin && (
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                                    onClick={() => {
                                        // Kita bungkus semua filter aktif ke dalam URLSearchParams
                                        const queryParams = new URLSearchParams(
                                            {
                                                search: filters.search,
                                                category: filters.category,
                                                status: filters.status,
                                                condition: filters.condition,
                                            },
                                        ).toString();

                                        // Membuka tab baru untuk proses download PDF
                                        window.open(
                                            `/items/labels/print-all?${queryParams}`,
                                            '_blank',
                                        );
                                    }}
                                >
                                    <PrinterIcon className="h-4 w-4" />
                                    Cetak Label
                                </Button>
                            )}

                            <Button
                                onClick={() => {
                                    setEditingItem(null);
                                    setAttributes({});
                                    setLocationValues({});
                                    setOpen(true);
                                }}
                            >
                                <PlusIcon className="h-4 w-4" />
                                Tambah
                            </Button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="relative max-h-[70vh] overflow-auto rounded-lg border">
                        <table className="w-full min-w-max border-collapse text-sm">
                            <thead className="sticky top-0 z-10 bg-muted">
                                <tr>
                                    {TABLE_HEADERS.map((label) => (
                                        <th
                                            key={label}
                                            className="px-4 py-2 text-left whitespace-nowrap"
                                        >
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={TABLE_HEADERS.length}
                                            className="py-6 text-center text-muted-foreground"
                                        >
                                            Data tidak ditemukan
                                        </td>
                                    </tr>
                                )}
                                {items.map((item, i) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item.nup}
                                        </td>
                                        <td className="px-4 py-2">
                                            {getLabel(
                                                item.category,
                                                CATEGORY_OPTIONS,
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {getLabel(
                                                item.status,
                                                STATUS_OPTIONS,
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {getLabel(
                                                item.condition,
                                                CONDITION_OPTIONS,
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-2">
                                                {item.user}
                                            </td>
                                        )}
                                        <td className="px-4 py-2">
                                            <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted">
                                                {item.files ? (
                                                    <img
                                                        src={`/storage/${item.files}`}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/assets/placeholder.svg"
                                                        alt={item.name}
                                                        className="h-full w-full object-cover opacity-50"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <Button
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.location.href = `/items/${item.id}`;
                                                }}
                                            >
                                                <EyeIcon className="inline h-4 w-4 text-yellow-500 hover:text-yellow-700" />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setEditingItem(item);

                                                    // Parse Attributes
                                                    const attr =
                                                        typeof item.attributes ===
                                                        'string'
                                                            ? JSON.parse(
                                                                  item.attributes,
                                                              )
                                                            : item.attributes;
                                                    setAttributes(attr || {});

                                                    // Parse Location (Kunci suksesnya di sini)
                                                    const loc =
                                                        typeof item.location_values ===
                                                        'string'
                                                            ? JSON.parse(
                                                                  item.location_values,
                                                              )
                                                            : item.location_values;
                                                    setLocationValues(
                                                        loc || {},
                                                    );

                                                    setOpen(true); // Buka modal terakhir
                                                }}
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <SquarePenIcon className="inline h-4 w-4 cursor-pointer text-green-500 hover:text-green-700" />
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setItemToDelete(item.id);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <TrashIcon className="inline h-4 w-4 cursor-pointer text-red-500 hover:text-red-700" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROL */}
                    <div className="flex items-center justify-between px-2 py-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Menampilkan {items.length} dari{' '}
                                {props.pagination.total} data
                            </span>

                            <span className="text-sm text-muted-foreground">
                                Tampilkan:
                            </span>

                            <select
                                value={props.pagination.per_page}
                                onChange={handlePerPageChange}
                                className="rounded border p-1 text-sm"
                            >
                                {[5, 10, 20, 50].map((val) => (
                                    <option key={val} value={val}>
                                        {val}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-1">
                            {props.pagination.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded border px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background hover:bg-accent'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* MODAL FORM */}
                <ItemsFormLayout
                    open={open}
                    onOpenChange={setOpen}
                    title={editingItem ? 'Edit Barang' : 'Tambah Barang'}
                    footer={
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Batal
                            </Button>

                            <Button
                                onClick={() =>
                                    document
                                        .getElementById('item-main-form')
                                        ?.dispatchEvent(
                                            new Event('submit', {
                                                cancelable: true,
                                                bubbles: true,
                                            }),
                                        )
                                }
                            >
                                Simpan
                            </Button>
                        </>
                    }
                >
                    <ItemForm
                        formId="item-main-form"
                        initialValues={
                            editingItem
                                ? mapItemToForm(editingItem)
                                : defaultFormValues
                        }
                        itemReferences={props.itemReferences || []}
                        categories={props.categories}
                        statuses={props.statuses}
                        conditions={props.conditions}
                        attributes={attributes}
                        users={props.users} //AFTER ADD USER TABLE
                        setAttributes={setAttributes}
                        locationValues={locationValues}
                        setLocationValues={setLocationValues}
                        onSubmit={onSubmit}
                    />
                </ItemsFormLayout>

                <DeleteConfirmDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={handleDelete}
                />
            </ItemsLayout>
        </AppLayout>
    );
}
