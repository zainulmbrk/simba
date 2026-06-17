import { DeleteConfirmDialog } from '@/components/delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Building, Room } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PlusIcon, SquarePenIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    rooms: Room[];
    buildings: Building[];
}

export default function RoomIndex({ rooms, buildings }: Props) {
    const [open, setOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    // Form States
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [buildingId, setBuildingId] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Master Ruangan', href: '/master/rooms' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { name, code, master_building_id: buildingId };

        if (editingRoom) {
            router.put(`/master/rooms/${editingRoom.id}`, data);
        } else {
            router.post('/master/rooms', data);
        }
        resetForm();
    };

    const resetForm = () => {
        setOpen(false);
        setEditingRoom(null);
        setName('');
        setCode('');
        setBuildingId('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Ruangan" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Master Ruangan"
                        description="Kelola daftar ruangan per gedung"
                    />
                    <Button onClick={() => setOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" /> Tambah Ruangan
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="w-16 px-4 py-3 text-left">No</th>
                                <th className="px-4 py-3 text-left">Gedung</th>
                                <th className="px-4 py-3 text-left">
                                    Nama Ruangan
                                </th>
                                <th className="px-4 py-3 text-left">Kode</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((r, i) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {(r as any).building?.name}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {r.name}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">
                                        {r.code || '-'}
                                    </td>
                                    <td className="space-x-1 px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditingRoom(r);
                                                setName(r.name);
                                                setCode(r.code || '');
                                                setBuildingId(
                                                    r.master_building_id.toString(),
                                                );
                                                setOpen(true);
                                            }}
                                        >
                                            <SquarePenIcon className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIdToDelete(r.id);
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

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-bold">
                            {editingRoom ? 'Edit' : 'Tambah'} Ruangan
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase">
                                    Gedung
                                </label>
                                <select
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                    value={buildingId}
                                    onChange={(e) =>
                                        setBuildingId(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">-- Pilih Gedung --</option>
                                    {buildings.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase">
                                    Nama Ruangan
                                </label>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Ruang Aula"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase">
                                    Kode Ruangan (Opsional)
                                </label>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2 font-mono text-sm"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Contoh: R-01"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
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
                onConfirm={() => {
                    if (idToDelete)
                        router.delete(`/master/rooms/${idToDelete}`, {
                            onSuccess: () => setIsDeleteDialogOpen(false),
                        });
                }}
            />
        </AppLayout>
    );
}
