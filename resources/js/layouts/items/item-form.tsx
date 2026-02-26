import { ItemFormValues } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type ItemFormProps = {
    initialValues: ItemFormValues;
    categories: any[];
    statuses: any[];
    conditions: any[];
    users: any[];
    attributes: Record<string, string>;
    setAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    locationValues: Record<string, string>;
    setLocationValues: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;
    onSubmit: (data: ItemFormValues) => void;
    formId: string;
    itemReferences: { code: string; name: string }[];
};

export function ItemForm({
    initialValues,
    categories = [],
    statuses = [],
    conditions = [],
    users = [],
    attributes,
    setAttributes,
    locationValues,
    setLocationValues,
    onSubmit,
    formId,
    itemReferences,
}: ItemFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset, // Digunakan untuk update data saat mode Edit
        watch,
        formState: { errors },
    } = useForm<ItemFormValues>({
        defaultValues: initialValues,
    });

    /* =================== STATE =================== */
    const [searchTerm, setSearchTerm] = useState(initialValues.name || '');
    const [showSuggestions, setShowSuggestions] = useState(false);

    /* =================== EFFECT: SYNC DATA (MODAL EDIT) =================== */
    // Kode ini yang sebelumnya tidak ketemu. Ini diletakkan di bagian atas agar
    // Form langsung terisi saat modal dibuka.
    useEffect(() => {
        if (initialValues) {
            // 1. Reset nilai di dalam react-hook-form (termasuk dropdown)
            reset(initialValues);

            // 2. Sync pencarian nama barang
            setSearchTerm(initialValues.name || '');

            // 3. Sync state eksternal untuk Atribut
            if (initialValues.attributes) {
                setAttributes(initialValues.attributes);
            }

            // 4. Sync state eksternal untuk Lokasi
            const locValues = (initialValues as any).location_values || {};
            setLocationValues(locValues);
        }
    }, [initialValues, reset, setAttributes, setLocationValues]);

    /* =================== LOGIKA NUP OTOMATIS =================== */
    const watchCode = watch('code');

    const suggestions =
        searchTerm.length >= 2
            ? itemReferences
                  .filter((ref) =>
                      ref.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .slice(0, 10)
            : [];

    /* =================== SHOW CATEGORY & DINAMIS =================== */
    const selectedCategoryId = watch('category');
    const selectedCategory = categories.find(
        (c) => c.id.toString() === selectedCategoryId?.toString(),
    );

    useEffect(() => {
        if (!selectedCategory) return;

        setAttributes((prev) => {
            const next: Record<string, string> = {};
            selectedCategory.attributes?.forEach((attr: any) => {
                next[attr.key] = prev[attr.key] ?? '';
            });
            return next;
        });
    }, [selectedCategory, setAttributes]);

    useEffect(() => {
        if (!selectedCategory) return;

        setLocationValues((prev) => {
            const next: Record<string, string> = { ...prev };
            selectedCategory.locations?.forEach((loc: any) => {
                if (!(loc.key in next)) {
                    next[loc.key] = '';
                }
            });
            return next;
        });
    }, [selectedCategory, setLocationValues]);

    /* =================== FILTER SEKRETARIS =================== */
    const secretaries = users.filter((u) => {
        const jabatan = u.job_title || '';
        return jabatan.toLowerCase().includes('sekretaris');
    });

    const { auth } = usePage().props as any;
    const isAdmin = auth.user.role === 'admin';

    return (
        <form
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
            className="max-h-[65vh] space-y-4 overflow-y-auto px-1 py-2"
        >
            {/* Nama & Kode Barang */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label className="text-xs font-medium text-muted-foreground">
                        Nama Barang
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        placeholder="Ketik minimal 2 huruf..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setValue('name', e.target.value);
                            setShowSuggestions(true);
                        }}
                        onBlur={() =>
                            setTimeout(() => setShowSuggestions(false), 200)
                        }
                    />
                    {/* DROPDOWN SARAN BARANG */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-xl">
                            {suggestions.map((ref, idx) => (
                                <li
                                    key={idx}
                                    className="cursor-pointer border-b px-4 py-2 text-sm last:border-0 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => {
                                        setSearchTerm(ref.name);
                                        setValue('name', ref.name, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                        setValue('code', ref.code, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });

                                        fetch(`/items/next-nup/${ref.code}`)
                                            .then((response) => response.json())
                                            .then((data) => {
                                                setValue('nup', data.next_nup, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                            });
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <div className="font-semibold">
                                        {ref.name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        {ref.code}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="text-xs font-medium text-muted-foreground">
                        Kode Barang
                    </label>
                    <input
                        className="w-full rounded border bg-gray-50 px-3 py-2 font-mono text-sm"
                        {...register('code', { required: 'Wajib diisi' })}
                        placeholder="Otomatis terisi..."
                        readOnly
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground">
                        NUP (No. Urut)
                    </label>
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2 text-sm"
                        {...register('nup')}
                        placeholder="Otomatis"
                    />
                </div>
            </div>

            {/* Kategori */}
            <div>
                <label className="text-xs font-medium text-muted-foreground">
                    Kategori
                </label>
                <select
                    className="w-full rounded border px-3 py-2 text-sm"
                    {...register('category', { required: 'Wajib diisi' })}
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((opt) => (
                        <option key={opt.id} value={opt.id.toString()}>
                            {opt.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Input Dinamis Attributes */}
            {selectedCategory?.attributes?.map((attr: any) => (
                <div key={attr.id} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        {attr.name}
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={attributes[attr.key] || ''}
                        onChange={(e) =>
                            setAttributes((prev) => ({
                                ...prev,
                                [attr.key]: e.target.value,
                            }))
                        }
                        required={attr.is_required}
                    />
                </div>
            ))}

            {/* Status & Kondisi */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-muted-foreground">
                        Status
                    </label>
                    <select
                        className="w-full rounded border px-3 py-2 text-sm"
                        {...register('status', { required: true })}
                    >
                        <option value="">Pilih Status</option>
                        {statuses.map((opt) => (
                            <option key={opt.id} value={opt.id.toString()}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground">
                        Kondisi
                    </label>
                    <select
                        className="w-full rounded border px-3 py-2 text-sm"
                        {...register('condition', { required: true })}
                    >
                        <option value="">Pilih Kondisi</option>
                        {conditions.map((opt) => (
                            <option key={opt.id} value={opt.id.toString()}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Foto */}
            <div>
                <label className="text-xs font-medium text-muted-foreground">
                    Foto Barang
                </label>
                <input
                    type="file"
                    accept="image/*"
                    className="w-full cursor-pointer rounded border px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-accent file:px-2 file:py-1 file:text-xs"
                    {...register('photo')}
                />
            </div>

            {/* Detil Lokasi Dinamis */}
            {selectedCategory?.locations?.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h3 className="border-b pb-1 text-sm font-bold">
                        Detil Lokasi
                    </h3>
                    {selectedCategory.locations.map((loc: any) => (
                        <div key={loc.id}>
                            <label className="text-xs font-medium text-muted-foreground capitalize">
                                {loc.name}
                            </label>
                            <input
                                className="w-full rounded border p-2 text-sm"
                                value={locationValues[loc.key] || ''}
                                onChange={(e) =>
                                    setLocationValues({
                                        ...locationValues,
                                        [loc.key]: e.target.value,
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pengguna Barang (Khusus Admin) */}
            {isAdmin && (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Pengguna Barang
                    </label>
                    <select
                        {...register('user_id')}
                        className="w-full rounded border px-3 py-2 text-sm"
                    >
                        <option value="">-- Pilih Pengguna --</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id.toString()}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {errors.user_id && (
                        <span className="text-[10px] text-red-500">
                            {errors.user_id.message}
                        </span>
                    )}
                </div>
            )}

            {/* Penanggung Jawab */}
            <div>
                <label className="text-xs font-medium text-muted-foreground">
                    Penanggung Jawab
                </label>
                <select
                    className="w-full rounded border px-3 py-2 text-sm"
                    {...register('responsible', {
                        required: 'Wajib pilih penanggung jawab',
                    })}
                >
                    <option value="">Pilih </option>
                    {secretaries.map((s) => (
                        <option key={s.id} value={s.name}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    );
}
