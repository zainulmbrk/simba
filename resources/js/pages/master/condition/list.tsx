import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ItemsLayout from '@/layouts/items/layout';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

type Condition = {
    id: number;
    name: string;
};

export default function MasterConditionList() {
    const { conditions, flash } = usePage<{
        conditions: Condition[];
        flash?: { success?: string };
    }>().props;

    const [name, setName] = useState('');

    const submit = () => {
        router.post(
            '/master/conditions',
            { name },
            {
                onSuccess: () => setName(''),
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Master Condition', href: '/master/conditions' },
            ]}
        >
            <ItemsLayout>
                <Head title="Master Condition" />

                <div className="space-y-4">
                    <h1 className="text-xl font-semibold">Master Condition</h1>

                    {flash?.success && (
                        <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            className="w-64 rounded border px-3 py-2"
                            placeholder="Nama kondisi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button onClick={submit}>Tambah</Button>
                    </div>

                    <table className="w-full border text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="border px-3 py-2">No</th>
                                <th className="border px-3 py-2">Nama</th>
                                <th className="border px-3 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conditions.map((condition, i) => (
                                <tr key={condition.id}>
                                    <td className="border px-3 py-2">
                                        {i + 1}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {condition.name}
                                    </td>
                                    <td className="flex gap-4 border px-3 py-2">
                                        <button>
                                            <PencilIcon className="inline h-4 w-4 cursor-pointer" />
                                        </button>
                                        <button>
                                            <TrashIcon className="inline h-4 w-4 cursor-pointer" />
                                        </button>
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
