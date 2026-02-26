import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    BriefcaseIcon,
    PhoneIcon,
    PlusIcon,
    ShieldCheckIcon,
    SquarePenIcon,
    TrashIcon,
    UserIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function UserManagement() {
    const { users, filters } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        email: '',
        nip: '', // Tambahan NIP
        job_title: '', // Tambahan Jabatan
        phone: '', // Tambahan Telepon
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen User', href: '/manage-users' },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        router.get(
            '/manage-users',
            { search: e.target.value },
            { preserveState: true, replace: true },
        );
    };

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            nip: user.nip || '',
            job_title: user.job_title || '',
            phone: user.phone || '',
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            // Mengirim ke route update: /manage-users/{id}
            put(`/manage-users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            // Mengirim ke route store: /manage-users
            post('/manage-users', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
            destroy(`/manage-users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Manajemen User"
                        description="Kelola akun dan detail profil pegawai"
                    />
                    <Button onClick={openCreateModal}>
                        <PlusIcon className="mr-2 h-4 w-4" /> Tambah Akun
                    </Button>
                </div>

                <div className="flex justify-end">
                    <input
                        type="text"
                        placeholder="Cari nama, NIP, atau jabatan..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full max-w-sm rounded border px-3 py-2 text-sm shadow-sm"
                    />
                </div>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50 font-medium text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-center">No</th>
                                <th className="px-4 py-3">Nama / NIP</th>
                                <th className="px-4 py-3">Jabatan</th>
                                <th className="px-4 py-3">Kontak</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user: any, index: number) => (
                                <tr
                                    key={user.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-center text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-gray-900">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            NIP. {user.nip || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <BriefcaseIcon className="mr-2 h-3 w-3 text-gray-400" />
                                            {user.job_title || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-gray-600">
                                            {user.email}
                                        </div>
                                        <div className="mt-0.5 flex items-center text-xs text-gray-400">
                                            <PhoneIcon className="mr-1 h-3 w-3" />{' '}
                                            {user.phone || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                user.role === 'admin'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {user.role === 'admin' ? (
                                                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                                            ) : (
                                                <UserIcon className="mr-1 h-3 w-3" />
                                            )}
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="space-x-1 px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditModal(user)}
                                        >
                                            <SquarePenIcon className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                        >
                                            <TrashIcon className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="mb-6 border-b pb-3 text-xl font-bold text-gray-800">
                            {editingUser
                                ? 'Edit Profil User'
                                : 'Tambah Akun Baru'}
                        </h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-[10px] text-red-500 italic">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        NIP
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData('nip', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Jabatan
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.job_title}
                                        onChange={(e) =>
                                            setData('job_title', e.target.value)
                                        }
                                        placeholder="Contoh: Sekretaris"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Email Login
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-[10px] text-red-500 italic">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Hak Akses (Role)
                                    </label>
                                    <select
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.role}
                                        onChange={(e) =>
                                            setData('role', e.target.value)
                                        }
                                    >
                                        <option value="user">User Biasa</option>
                                        <option value="admin">
                                            Administrator
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        {editingUser
                                            ? 'Ganti Password'
                                            : 'Password'}
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder={
                                            editingUser
                                                ? 'Kosongkan jika tak ganti'
                                                : ''
                                        }
                                    />
                                    {errors.password && (
                                        <p className="text-[10px] text-red-500 italic">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">
                                        Konfirmasi Password
                                    </label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-6">
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
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {editingUser
                                        ? 'Simpan Perubahan'
                                        : 'Daftarkan Akun'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
