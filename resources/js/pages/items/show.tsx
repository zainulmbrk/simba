import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ItemsFormLayout from '@/layouts/items/form-layout';
import { ItemForm } from '@/layouts/items/item-form';
import { mapItemToForm } from '@/layouts/items/item-form.helpers';
import ItemsLayout from '@/layouts/items/layout';
import type { Item } from '@/types';
import { type BreadcrumbItem, ItemFormValues } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronDownIcon, SquarePenIcon } from 'lucide-react';
import { useState } from 'react';

export default function Item() {
    /* =================== PROPS =================== */
    const { props } = usePage<{
        item: Item;
        categories: any[];
        statuses: any[];
        conditions: any[];
        users: { id: number; name: string; employee_id?: string }[];
        itemReferences: { code: string; name: string }[];
        attributeLabels: Record<string, string>;
        locationLabels: Record<string, string>;
    }>();

    const {
        item,
        categories,
        statuses,
        conditions,
        attributeLabels,
        locationLabels,
    } = props;

    // BREADCRUMBS
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'List Barang', href: '/items' },
        { title: item.name, href: '#' },
    ];

    /* =================== STATE =================== */
    const [openEdit, setOpenEdit] = useState(false);
    const [attributes, setAttributes] = useState<Record<string, string>>({});
    const [locationValues, setLocationValues] = useState<
        Record<string, string>
    >({});
    const [open, setOpen] = useState(false);
    const [openLocation, setOpenLocation] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    /* =================== HANDLE SUBMIT =================== */
    // const onSubmit = (data: any) => {
    //     const formData = new FormData();
    //     Object.entries(data).forEach(([key, value]) => {
    //         if (value !== undefined && value !== null) {
    //             if (key === 'photo' && value instanceof FileList) {
    //                 if (value.length > 0) formData.append('photo', value[0]);
    //             } else {
    //                 formData.append(key, value as any);
    //             }
    //         }
    //     });

    //     if (Object.keys(attributes).length > 0) {
    //         formData.append('attributes', JSON.stringify(attributes));
    //     }

    //     if (Object.keys(locationValues).length > 0) {
    //         formData.append('location_values', JSON.stringify(locationValues));
    //     }

    //     formData.append('redirect_to', 'show');
    //     formData.append('_method', 'PUT');

    //     router.post(`/items/${item.id}`, formData, {
    //         onSuccess: () => setOpenEdit(false),
    //     });
    // };

    /* =================== HANDLE SUBMIT (PERBAIKAN) =================== */
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

        // PAKSA menggunakan metode PUT untuk update
        formData.append('_method', 'PUT');

        // Gunakan ID dari item yang sedang aktif (item.id)
        router.post(`/items/${item.id}`, formData, {
            onSuccess: () => {
                setOpenEdit(false);
                // Opsional: tampilkan toast sukses di sini
            },
        });
    };

    /* =================== PERBAIKAN: DATA SAFETY =================== */
    // Jangan pakai 'if (!item.attributes) return null' karena akan bikin halaman putih.
    // Kita buat variabel bantuan agar mapping tidak error.
    const safeAttributes = item.attributes || {};
    const safeLocationValues = item.location_values || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ItemsLayout>
                <div>
                    <div className="lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                        <div className="flex justify-between lg:col-span-2 lg:border-r lg:border-muted-foreground lg:pr-8">
                            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                {item.name}{' '}
                                <span className="rounded-full bg-muted p-2 text-sm font-thin text-muted-foreground">
                                    {item.category}
                                </span>
                            </h1>
                            <Button
                                onClick={() => {
                                    setAttributes(item.attributes || {});
                                    // Ambil location_values dari props item
                                    setLocationValues(
                                        item.location_values || {},
                                    );
                                    setOpenEdit(true);
                                }}
                                variant="default"
                                size="lg"
                            >
                                <SquarePenIcon className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </div>

                        <div className="mt-4 max-h-80 lg:row-span-3 lg:mt-0">
                            <img
                                src={
                                    item.files
                                        ? `/storage/${item.files}`
                                        : '/assets/placeholder.svg'
                                }
                                alt={item.name}
                                className="row-span-2 aspect-3/4 size-full object-cover sm:rounded-lg lg:aspect-square"
                                loading="lazy"
                            />
                        </div>

                        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-primary">
                                        Kode Barang
                                    </label>
                                    <input
                                        type="text"
                                        value={item.code}
                                        disabled
                                        className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-primary">
                                        NUP
                                    </label>
                                    <input
                                        type="text"
                                        value={item.nup}
                                        disabled
                                        className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-primary">
                                        Kondisi
                                    </label>
                                    <input
                                        type="text"
                                        value={item.condition}
                                        disabled
                                        className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-primary">
                                        Status Barang
                                    </label>
                                    <input
                                        type="text"
                                        value={item.status}
                                        disabled
                                        className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-primary">
                                        Pengguna Barang
                                    </label>
                                    <input
                                        type="text"
                                        value={item.user}
                                        disabled
                                        className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-primary">
                                        Penanggung Jawab
                                    </label>
                                    <input
                                        type="text"
                                        value={item.responsible}
                                        disabled
                                        className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                    />
                                </div>
                            </div>

                            {/* LOCATION ACCORDION */}
                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenLocation(!openLocation)
                                    }
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/40 px-4 py-3 text-left transition-all duration-300 hover:bg-muted"
                                >
                                    <span className="text-sm font-medium">
                                        Detil Lokasi
                                    </span>
                                    <ChevronDownIcon
                                        className={`h-4 w-4 transition-transform duration-300 ${openLocation ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`grid transition-all duration-300 ${openLocation ? 'mt-4 grid-rows-[1fr] opacity-100' : 'invisible h-0 grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="grid grid-cols-1 gap-4 pb-2 md:grid-cols-2">
                                            {Object.entries(safeLocationValues)
                                                .length > 0 ? (
                                                Object.entries(
                                                    safeLocationValues,
                                                ).map(([key, value]) => (
                                                    <div key={key}>
                                                        <label className="mb-1 block text-sm font-medium text-primary capitalize">
                                                            {locationLabels[
                                                                key
                                                            ] ||
                                                                key.replace(
                                                                    /_/g,
                                                                    ' ',
                                                                )}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={String(
                                                                value || '-',
                                                            )}
                                                            disabled
                                                            className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm italic">
                                                    Data lokasi tidak tersedia.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ATTRIBUTE ACCORDION */}
                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() => setOpen(!open)}
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border bg-muted/40 px-4 py-3 text-left transition-all duration-300 hover:bg-muted"
                                >
                                    <span className="text-sm font-medium">
                                        Atribut
                                    </span>
                                    <ChevronDownIcon
                                        className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`grid transition-all duration-300 ${open ? 'mt-4 grid-rows-[1fr] opacity-100' : 'invisible h-0 grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="space-y-6 pb-2">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {Object.entries(safeAttributes)
                                                    .filter(
                                                        ([key, value]) =>
                                                            String(value)
                                                                .length <= 50 &&
                                                            !key
                                                                .toLowerCase()
                                                                .includes(
                                                                    'spec',
                                                                ),
                                                    )
                                                    .map(([key, value]) => (
                                                        <div key={key}>
                                                            <label className="mb-1 block text-sm font-medium text-primary capitalize">
                                                                {attributeLabels[
                                                                    key
                                                                ] ||
                                                                    key.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={String(
                                                                    value,
                                                                )}
                                                                disabled
                                                                className="w-full rounded-md bg-secondary p-2 text-sm text-muted-foreground"
                                                            />
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="space-y-4">
                                                {Object.entries(safeAttributes)
                                                    .filter(
                                                        ([key, value]) =>
                                                            String(value)
                                                                .length > 50 ||
                                                            key
                                                                .toLowerCase()
                                                                .includes(
                                                                    'spec',
                                                                ),
                                                    )
                                                    .map(([key, value]) => (
                                                        <div key={key}>
                                                            <label className="mb-1 block text-sm font-medium text-primary capitalize">
                                                                {attributeLabels[
                                                                    key
                                                                ] ||
                                                                    key.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                            </label>
                                                            <textarea
                                                                rows={4}
                                                                value={String(
                                                                    value,
                                                                )}
                                                                disabled
                                                                className="w-full resize-none rounded-md bg-secondary p-3 text-sm leading-relaxed text-muted-foreground"
                                                            />
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ItemsLayout>
            <ItemsFormLayout
                open={openEdit}
                onOpenChange={setOpenEdit}
                title="Edit Barang"
                footer={
                    <>
                        <Button
                            onClick={() => setOpenEdit(false)}
                            variant="destructive"
                            size="lg"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            form="item-main-form" // Panggil ID Form secara langsung
                            variant="default"
                            size="lg"
                        >
                            Simpan
                        </Button>
                    </>
                }
            >
                <ItemForm
                    formId="item-main-form"
                    initialValues={mapItemToForm(item)}
                    itemReferences={props.itemReferences || []}
                    categories={categories}
                    statuses={statuses}
                    users={props.users}
                    conditions={conditions}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    locationValues={locationValues}
                    setLocationValues={setLocationValues}
                    onSubmit={onSubmit}
                />
            </ItemsFormLayout>
        </AppLayout>
    );
}
