import { DeleteConfirmDialog } from '@/components/delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Building } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PlusIcon, SquarePenIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    buildings: Building[];
}

export default function BuildingIndex({ buildings }: Props) {
    const [open, setOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(
        null,
    );
    const [name, setName] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Gedung', href: '/master/buildings' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBuilding) {
            router.put(`/master/buildings/${editingBuilding.id}`, { name });
        } else {
            router.post('/master/buildings', { name });
        }
        resetForm();
    };

    const resetForm = () => {
        setOpen(false);
        setEditingBuilding(null);
        setName('');
    };

    const handleDelete = () => {
        if (idToDelete) {
            router.delete(`/master/buildings/${idToDelete}`, {
                onSuccess: () => setIsDeleteDialogOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Gedung" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Master Gedung"
                        description="Kelola daftar gedung kantor KPU"
                    />
                    <Button onClick={() => setOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" /> Tambah Gedung
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="w-16 px-4 py-3 text-left">No</th>
                                <th className="px-4 py-3 text-left">
                                    Nama Gedung
                                </th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buildings.map((b, i) => (
                                <tr key={b.id} className="border-t">
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {b.name}
                                    </td>
                                    <td className="space-x-2 px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditingBuilding(b);
                                                setName(b.name);
                                                setOpen(true);
                                            }}
                                        >
                                            <SquarePenIcon className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIdToDelete(b.id);
                                                setIsDeleteDialogOpen(true);
                                            }}
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

            {/* Modal Form Sederhana */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-bold">
                            {editingBuilding ? 'Edit' : 'Tambah'} Gedung
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Nama Gedung
                                </label>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Gedung A"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Batal
                                </Button>
                                <Button type="submit">Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
