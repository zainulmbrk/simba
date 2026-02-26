import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ItemsLayout from '@/layouts/items/layout';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

type Attribute = {
    id: number;
    name: string;
    key: string;
    type: string;
    is_required: boolean;
};

type LocationField = {
    // Gunakan nama LocationField agar tidak bentrok dengan keyword window
    id: number;
    name: string;
    key: string;
};

type Category = {
    id: number;
    name: string;
    attributes?: Attribute[];
    locations?: LocationField[];
};

export default function MasterCategoryList() {
    const { categories, flash } = usePage<{
        categories: Category[];
        flash?: { success?: string };
    }>().props;

    // kategori
    const [name, setName] = useState('');

    // attribute
    const [attrCategoryId, setAttrCategoryId] = useState<number | null>(null);
    const [attrName, setAttrName] = useState('');
    const [attrKey, setAttrKey] = useState('');
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editAttrId, setEditAttrId] = useState<number | null>(null);
    const [editAttrName, setEditAttrName] = useState('');
    const [editAttrKey, setEditAttrKey] = useState('');

    // location
    const [locCategoryId, setLocCategoryId] = useState<number | null>(null);
    const [locName, setLocName] = useState('');
    const [locKey, setLocKey] = useState('');

    const [editLocId, setEditLocId] = useState<number | null>(null);
    const [editLocName, setEditLocName] = useState('');
    const [editLocKey, setEditLocKey] = useState('');

    const submit = () => {
        router.post(
            '/master/categories',
            { name },
            {
                onSuccess: () => setName(''),
            },
        );
    };

    //submit attribute
    const submitAttribute = () => {
        if (!attrCategoryId) return;

        router.post(
            `/master-categories/${attrCategoryId}/attributes`,
            {
                name: attrName,
                key: attrKey,
                type: 'text',
                is_required: true,
            },
            {
                onSuccess: () => {
                    setAttrName('');
                    setAttrKey('');
                    setAttrCategoryId(null);
                },
            },
        );
    };

    //submit location
    const submitLocation = () => {
        if (!locCategoryId) return;
        router.post(
            `/master-categories/${locCategoryId}/locations`, // Pastikan route ini ada di Laravel
            { name: locName, key: locKey },
            {
                onSuccess: () => {
                    setLocName('');
                    setLocKey('');
                    setLocCategoryId(null);
                },
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Master Category', href: '/master/categories' },
            ]}
        >
            <ItemsLayout>
                <Head title="Master Category" />

                <div className="space-y-4">
                    <h1 className="text-xl font-semibold">Master Category</h1>

                    {flash?.success && (
                        <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* FORM TAMBAH KATEGORI */}
                    <div className="flex gap-2">
                        <input
                            className="w-64 rounded border px-3 py-2"
                            placeholder="Nama kategori"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button onClick={submit}>Tambah</Button>
                    </div>

                    {/* TABLE */}
                    <table className="w-full border text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="w-10 border px-3 py-2 text-left">
                                    No
                                </th>
                                <th className="border px-3 py-2 text-left">
                                    Nama
                                </th>
                                <th className="w-2xl border px-3 py-2 text-left">
                                    Attributes
                                </th>
                                <th className="border bg-blue-50/50 px-3 py-2 text-left">
                                    Locations (Detail)
                                </th>
                                {/* <th className="border px-3 py-2 text-left">
                                    Aksi
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, i) => (
                                <tr key={cat.id}>
                                    <td className="border px-3 py-2">
                                        {i + 1}
                                    </td>

                                    <td className="border px-3 py-2">
                                        {editCategoryId === cat.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className="rounded border px-2 py-1 text-sm"
                                                    value={editName}
                                                    onChange={(e) =>
                                                        setEditName(
                                                            e.target.value,
                                                        )
                                                    }
                                                />

                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        router.put(
                                                            `/master/categories/${cat.id}`,
                                                            { name: editName },
                                                            {
                                                                onSuccess:
                                                                    () => {
                                                                        setEditCategoryId(
                                                                            null,
                                                                        );
                                                                        setEditName(
                                                                            '',
                                                                        );
                                                                    },
                                                            },
                                                        );
                                                    }}
                                                >
                                                    Simpan
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditCategoryId(null);
                                                        setEditName('');
                                                    }}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{cat.name}</span>

                                                <button
                                                    onClick={() => {
                                                        setEditCategoryId(
                                                            cat.id,
                                                        );
                                                        setEditName(cat.name);
                                                    }}
                                                    className="text-muted-foreground hover:text-foreground"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    {/* ATTRIBUTE */}
                                    <td className="border px-3 py-2">
                                        <ul className="mb-2 space-y-1 text-xs">
                                            {cat.attributes?.length ? (
                                                cat.attributes.map((attr) => (
                                                    <li
                                                        key={attr.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {editAttrId ===
                                                        attr.id ? (
                                                            <>
                                                                <input
                                                                    className="w-24 rounded border px-2 py-1 text-xs"
                                                                    value={
                                                                        editAttrName
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEditAttrName(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <input
                                                                    className="w-24 rounded border px-2 py-1 text-xs"
                                                                    value={
                                                                        editAttrKey
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEditAttrKey(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        router.put(
                                                                            `/master-categories/attributes/${attr.id}`,
                                                                            {
                                                                                name: editAttrName,
                                                                                key: editAttrKey,
                                                                            },
                                                                            {
                                                                                onSuccess:
                                                                                    () => {
                                                                                        setEditAttrId(
                                                                                            null,
                                                                                        );
                                                                                        setEditAttrName(
                                                                                            '',
                                                                                        );
                                                                                        setEditAttrKey(
                                                                                            '',
                                                                                        );
                                                                                    },
                                                                            },
                                                                        );
                                                                    }}
                                                                >
                                                                    Simpan
                                                                </Button>

                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setEditAttrId(
                                                                            null,
                                                                        );
                                                                        setEditAttrName(
                                                                            '',
                                                                        );
                                                                        setEditAttrKey(
                                                                            '',
                                                                        );
                                                                    }}
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>
                                                                    •{' '}
                                                                    {attr.name}{' '}
                                                                    ({attr.key})
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditAttrId(
                                                                            attr.id,
                                                                        );
                                                                        setEditAttrName(
                                                                            attr.name,
                                                                        );
                                                                        setEditAttrKey(
                                                                            attr.key,
                                                                        );
                                                                    }}
                                                                    className="text-muted-foreground hover:text-foreground"
                                                                >
                                                                    <PencilIcon className="h-3 w-3" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-muted-foreground">
                                                    Belum ada attribute
                                                </li>
                                            )}
                                        </ul>

                                        {/* FORM TAMBAH ATTRIBUTE */}
                                        <div className="flex gap-2">
                                            <input
                                                className="w-24 rounded border px-2 py-1 text-xs"
                                                placeholder="Nama"
                                                value={
                                                    attrCategoryId === cat.id
                                                        ? attrName
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    setAttrCategoryId(cat.id);
                                                    setAttrName(e.target.value);
                                                }}
                                            />
                                            <input
                                                className="w-24 rounded border px-2 py-1 text-xs"
                                                placeholder="Key"
                                                value={
                                                    attrCategoryId === cat.id
                                                        ? attrKey
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    setAttrCategoryId(cat.id);
                                                    setAttrKey(e.target.value);
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={submitAttribute}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>

                                    {/* LOCATIONS */}
                                    <td className="border px-3 py-2">
                                        <ul className="mb-2 space-y-1 text-xs">
                                            {cat.locations?.length ? (
                                                cat.locations.map((loc) => (
                                                    <li
                                                        key={loc.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {editLocId ===
                                                        loc.id ? (
                                                            <>
                                                                <input
                                                                    className="w-24 rounded border px-2 py-1 text-xs"
                                                                    value={
                                                                        editLocName
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEditLocName(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <input
                                                                    className="w-24 rounded border px-2 py-1 text-xs"
                                                                    value={
                                                                        editLocKey
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEditLocKey(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        router.put(
                                                                            `/master-categories/locations/${loc.id}`,
                                                                            {
                                                                                name: editLocName,
                                                                                key: editLocKey,
                                                                            },
                                                                            {
                                                                                onSuccess:
                                                                                    () => {
                                                                                        setEditLocId(
                                                                                            null,
                                                                                        );
                                                                                        setEditLocName(
                                                                                            '',
                                                                                        );
                                                                                        setEditLocKey(
                                                                                            '',
                                                                                        );
                                                                                    },
                                                                            },
                                                                        );
                                                                    }}
                                                                >
                                                                    Simpan
                                                                </Button>

                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setEditLocId(
                                                                            null,
                                                                        );
                                                                        setEditLocName(
                                                                            '',
                                                                        );
                                                                        setEditLocKey(
                                                                            '',
                                                                        );
                                                                    }}
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>
                                                                    • {loc.name}{' '}
                                                                    ({loc.key})
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditLocId(
                                                                            loc.id,
                                                                        );
                                                                        setEditLocName(
                                                                            loc.name,
                                                                        );
                                                                        setEditLocKey(
                                                                            loc.key,
                                                                        );
                                                                    }}
                                                                    className="text-muted-foreground hover:text-foreground"
                                                                >
                                                                    <PencilIcon className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                'Apakah Anda yakin ingin menghapus field lokasi ini?',
                                                                            )
                                                                        ) {
                                                                            router.delete(
                                                                                `/master-categories/locations/${loc.id}`,
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="text-muted-foreground hover:text-red-600"
                                                                >
                                                                    <Trash2Icon className="h-3 w-3" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-muted-foreground">
                                                    Belum ada lokasi
                                                </li>
                                            )}
                                        </ul>

                                        {/* FORM TAMBAH LOCATION */}
                                        <div className="flex gap-2">
                                            <input
                                                className="w-24 rounded border px-2 py-1 text-xs"
                                                placeholder="Nama"
                                                value={
                                                    locCategoryId === cat.id
                                                        ? locName
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    setLocCategoryId(cat.id);
                                                    setLocName(e.target.value);
                                                }}
                                            />
                                            <input
                                                className="w-24 rounded border px-2 py-1 text-xs"
                                                placeholder="Key"
                                                value={
                                                    locCategoryId === cat.id
                                                        ? locKey
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    setLocCategoryId(cat.id);
                                                    setLocKey(e.target.value);
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={submitLocation}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ItemsLayout>
        </AppLayout>
    );
}
