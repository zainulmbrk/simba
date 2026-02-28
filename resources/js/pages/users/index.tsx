import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Edit, Plus, Printer, Search, Trash2, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master Pengguna Barang', href: '/master/user' },
];

// Interface disesuaikan dengan field Master User (Pegawai)
interface MasterUser {
    id: number;
    name: string;
    nip: string; // Field NIP
    job_title: string; // Jabatan
    role: string; // Status/Role Pegawai
    notes?: string;
}

interface Props {
    users: MasterUser[];
    pagination: {
        links: any[];
        total: number;
        current_page: number;
        per_page: number;
    };
    filters: {
        search: string;
        sort_column: string;
        sort_direction: string;
    };
}

export default function MasterUserIndex({
    users,
    pagination,
    filters: serverFilters,
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<MasterUser | null>(null);
    const [localSearch, setLocalSearch] = useState(serverFilters?.search || '');

    const { data, setData, post, put, reset, processing, errors, clearErrors } =
        useForm({
            name: '',
            nip: '',
            job_title: '',
            role: 'Pegawai', // Default status
            notes: '',
        });

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/master/user',
                { ...serverFilters, search: value, page: 1 },
                { preserveState: true, replace: true },
            );
        }, 500),
        [serverFilters],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const openModal = (user: MasterUser | null = null) => {
        clearErrors();
        if (user) {
            setEditingUser(user);
            setData({
                name: user.name,
                nip: user.nip || '',
                job_title: user.job_title || '',
                role: user.role || '',
                notes: user.notes || '',
            });
        } else {
            setEditingUser(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/master/user/${editingUser.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/master/user', { onSuccess: () => setIsModalOpen(false) });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Pengguna Barang" />
            <div className="p-6">
                <div className="mb-6 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Master Pengguna Barang
                    </h1>
                    <p className="text-sm text-gray-500">
                        Kelola data pegawai yang bertanggung jawab atas
                        aset/barang.
                    </p>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIP..."
                            value={localSearch}
                            onChange={handleSearchChange}
                            className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm outline-none focus:border-black"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-blue-200 text-blue-600"
                        >
                            <Printer size={16} />
                        </Button>
                        <Button
                            onClick={() => openModal()}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            <Plus size={16} className="mr-2" /> Tambah Pengguna
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">NIP / ID</th>
                                <th className="px-6 py-4">Jabatan</th>
                                <th className="px-6 py-4 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="transition hover:bg-gray-50/50"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {user.nip || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.job_title || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                                            {user.role || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="rounded p-1 text-green-600 hover:bg-green-50"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    confirm('Hapus?') &&
                                                    router.delete(
                                                        `/master/user/${user.id}`,
                                                    )
                                                }
                                                className="rounded p-1 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer Pagination sesuai Gambar SIMBA V.1 */}
                    <div className="flex items-center justify-between border-t border-gray-50 bg-white px-6 py-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                                Menampilkan <b>{users.length}</b> dari{' '}
                                <b>{pagination.total}</b> data
                            </span>
                            <select
                                value={pagination.per_page}
                                onChange={(e) =>
                                    router.get('/master/user', {
                                        ...serverFilters,
                                        per_page: e.target.value,
                                    })
                                }
                                className="cursor-pointer border-none bg-transparent font-bold text-gray-900 focus:ring-0"
                            >
                                <option value="10">10 Baris</option>
                                <option value="25">25 Baris</option>
                            </select>
                        </div>
                        <div className="flex gap-1">
                            {pagination.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded-md px-3 py-1 text-xs ${link.active ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-100'} ${!link.url ? 'pointer-events-none opacity-30' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Master User */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg animate-in overflow-hidden rounded-xl bg-white shadow-xl zoom-in-95">
                        <div className="flex items-center justify-between border-b bg-gray-50/50 px-6 py-4">
                            <h2 className="font-bold text-gray-800">
                                {editingUser
                                    ? 'Edit Data Pegawai'
                                    : 'Tambah Pegawai Baru'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="space-y-4 p-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    Nama Lengkap
                                </label>
                                <input
                                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        NIP / ID Pegawai
                                    </label>
                                    <input
                                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData('nip', e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Status / Role
                                    </label>
                                    <input
                                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                        value={data.role}
                                        onChange={(e) =>
                                            setData('role', e.target.value)
                                        }
                                        placeholder="Contoh: PNS / Honorer"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    Jabatan
                                </label>
                                <input
                                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                    value={data.job_title}
                                    onChange={(e) =>
                                        setData('job_title', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2 border-t pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-black text-white"
                                >
                                    {editingUser
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Pegawai'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
