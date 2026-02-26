import AppLayout from '@/layouts/app-layout';
import ItemsLayout from '@/layouts/items/layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'List Barang', href: '/items' },
];

export default function CreateItem() {
    const { categories } = usePage().props as any;

    const [categoryId, setCategoryId] = useState<number | null>(null);

    const selectedCategory = categories.find((c: any) => c.id === categoryId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ItemsLayout>
                <div>
                    <h1>Create Item</h1>

                    {/* SELECT KATEGORI */}
                    <div>
                        <label>Kategori</label>
                        <select
                            value={categoryId ?? ''}
                            onChange={(e) =>
                                setCategoryId(Number(e.target.value))
                            }
                        >
                            <option value="">-- pilih kategori --</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {selectedCategory?.attributes?.length > 0 && (
                            <div>
                                <h3>Detail Atribut</h3>

                                {selectedCategory.attributes.map(
                                    (attr: any) => (
                                        <div key={attr.key}>
                                            <label>
                                                {attr.name}
                                                {attr.is_required && ' *'}
                                            </label>

                                            <input
                                                type={attr.type ?? 'text'}
                                                name={`attributes.${attr.key}`}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>

                    {/* DEBUG */}
                    <pre>{JSON.stringify(selectedCategory, null, 2)}</pre>
                </div>
            </ItemsLayout>
        </AppLayout>
    );
}
