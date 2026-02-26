import { Button } from '@/components/ui/button'; // Jika menggunakan shadcn
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    Plus,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Master Pengguna Barang', href: '/master/user/index' },
];

interface MasterUser {
    id: number;
    name: string;
    employee_id: string;
    employment_status: string;
    job_title: string;
    notes: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    users: MasterUser[];
    pagination: {
        links: PaginationLink[];
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
    const [editingUser, setEditingUser] = useState<MasterUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: serverFilters?.search || '',
        sort_column: serverFilters?.sort_column || 'name',
        sort_direction: serverFilters?.sort_direction || 'asc',
    });

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        const finalFilters = { ...filters, ...newFilters };
        setFilters(finalFilters);

        // Mengirim request ke backend dengan parameter search
        router.get('/master/user', finalFilters, {
            preserveState: true, // Agar modal tidak tertutup otomatis jika sedang terbuka
            replace: true, // Agar tidak memenuhi history browser
        });
    };

    const handleSort = (column: string) => {
        const direction =
            filters.sort_column === column && filters.sort_direction === 'asc'
                ? 'desc'
                : 'asc';

        const newFilters = {
            ...filters,
            sort_column: column,
            sort_direction: direction,
        };

        setFilters(newFilters);
        router.get('/master/user', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (filters.sort_column !== column)
            return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
        return filters.sort_direction === 'asc' ? (
            <ArrowUp size={14} className="ml-1 text-primary" />
        ) : (
            <ArrowDown size={14} className="ml-1 text-primary" />
        );
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm({
        name: '',
        employee_id: '',
        employment_status: '',
        job_title: '',
        notes: '',
    });

    const openModal = (user: MasterUser | null = null) => {
        if (user) {
            setEditingUser(user);
            setData({
                name: user.name,
                employee_id: user.employee_id || '',
                employment_status: user.employment_status || '',
                job_title: user.job_title || '',
                notes: user.notes || '',
            });
        } else {
            setEditingUser(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/master/user',
            {
                ...filters, // Tetap bawa keyword search jika ada
                per_page: e.target.value,
            },
            { preserveState: true, replace: true },
        );
    };

    // const submit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const payload = {
    //         ...data,
    //         _method: editingUser ? 'PUT' : 'POST',
    //     };

    //     if (editingUser) {
    //         // Sesuai contohmu: Gunakan router.post dengan _method PUT
    //         router.post(`/master/user/${editingUser.id}`, payload, {
    //             onSuccess: () => closeModal(),
    //         });
    //     } else {
    //         router.post('/master/user', data, {
    //             onSuccess: () => closeModal(),
    //         });
    //     }
    // };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            // Menggunakan put() bawaan useForm
            put(`/master/user/${editingUser.id}`, {
                onSuccess: () => closeModal(),
                onError: (err) => {
                    console.error('Error Detail:', err);
                    alert('Gagal memperbarui data. Cek validasi!');
                },
            });
        } else {
            post('/master/user', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            // Untuk delete, inertia menyediakan router.delete
            router.delete(`/master/user/${id}`);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Pengguna" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Daftar Pengguna Barang
                    </h1>
                </div>
                <div className="flex items-center justify-between py-4">
                    <input
                        type="text"
                        placeholder="Cari nama atau NIP..."
                        value={filters.search}
                        onChange={(e) =>
                            applyFilters({ search: e.target.value })
                        }
                        className="w-full max-w-sm rounded border px-3 py-2 text-sm"
                    />
                    <Button
                        onClick={() => openModal()}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} /> Tambah Pengguna
                    </Button>
                </div>
                <div className="overflow-hidden border shadow-sm sm:rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted font-medium text-muted-foreground">
                            <tr>
                                <th
                                    className="cursor-pointer px-4 py-3 transition-colors hover:text-primary"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Nama <SortIcon column="name" />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-4 py-3 transition-colors hover:text-primary"
                                    onClick={() => handleSort('employee_id')}
                                >
                                    <div className="flex items-center">
                                        NIP / ID{' '}
                                        <SortIcon column="employee_id" />
                                    </div>
                                </th>
                                <th className="px-4 py-3">Jabatan</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="">
                                    <td className="px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.employee_id || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.job_title || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                            {user.employment_status || '-'}
                                        </span>
                                    </td>
                                    <td className="space-x-2 px-4 py-3 text-right">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="cursor-pointer text-chart-2/70 hover:text-chart-2"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            className="cursor-pointer text-destructive/70 hover:text-destructive"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* FOOTER: INFO & PAGINATION */}
                <div className="flex items-center justify-between px-2 py-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            Menampilkan {users.length} dari {pagination.total}{' '}
                            data
                        </span>

                        <span className="text-sm text-muted-foreground">
                            Tampilkan:
                        </span>

                        <select
                            value={pagination.per_page}
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
                        {pagination.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded border px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-background hover:bg-accent'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Sederhana */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-bold">
                            {editingUser
                                ? 'Edit Pengguna'
                                : 'Tambah Pengguna Baru'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium">
                                    Nama Lengkap
                                </label>
                                <input
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        NIP / ID Employee
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        value={data.employee_id}
                                        onChange={(e) =>
                                            setData(
                                                'employee_id',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Status (PNS/Honorer)
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        value={data.employment_status}
                                        onChange={(e) =>
                                            setData(
                                                'employment_status',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium">
                                    Jabatan
                                </label>
                                <input
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    value={data.job_title}
                                    onChange={(e) =>
                                        setData('job_title', e.target.value)
                                    }
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
