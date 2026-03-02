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
        reset,
        watch,
        formState: { errors },
    } = useForm<ItemFormValues>({
        defaultValues: initialValues,
    });

    const [searchTerm, setSearchTerm] = useState(initialValues.name || '');
    const [showSuggestions, setShowSuggestions] = useState(false);

    /* =================== 1. SYNC DATA AWAL (HANYA SEKALI SAAT BUKA) =================== */
    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
            setSearchTerm(initialValues.name || '');

            // Langsung isi state eksternal dari data database
            if (initialValues.attributes) {
                setAttributes(initialValues.attributes);
            }
            if ((initialValues as any).location_values) {
                setLocationValues((initialValues as any).location_values);
            }
        }
    }, [(initialValues as any).id]); // Trigger hanya jika ID barang berubah (saat ganti barang yang diedit)

    const selectedCategoryId = watch('category');
    const selectedCategory = categories.find(
        (c) => c.id.toString() === selectedCategoryId?.toString(),
    );

    /* =================== 2. LOGIKA PROTEKSI LOKASI & ATRIBUT =================== */
    useEffect(() => {
        if (!selectedCategory) return;

        // Update Atribut tanpa menghapus yang sudah ada
        setAttributes((prev) => {
            const next = { ...prev };
            selectedCategory.attributes?.forEach((attr: any) => {
                if (!(attr.key in next)) next[attr.key] = '';
            });
            return next;
        });

        // Update Lokasi tanpa menghapus yang sudah ada
        setLocationValues((prev) => {
            const next = { ...prev };
            selectedCategory.locations?.forEach((loc: any) => {
                // HANYA isi kosong jika benar-benar tidak ada di data database maupun state
                if (!(loc.key in next)) {
                    next[loc.key] = '';
                }
            });
            return next;
        });
    }, [selectedCategory]);

    /* =================== LOGIKA LAINNYA =================== */
    const suggestions =
        searchTerm.length >= 2
            ? itemReferences
                  .filter((r) =>
                      r.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .slice(0, 10)
            : [];

    const secretaries = users.filter((u) =>
        (u.job_title || '').toLowerCase().includes('sekretaris'),
    );
    const { auth } = usePage().props as any;
    const isAdmin = auth.user.role === 'admin';

    return (
        <form
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
            className="max-h-[65vh] space-y-4 overflow-y-auto px-1 py-2"
        >
            {/* Nama, Kode, NUP */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label className="text-xs font-medium text-muted-foreground">
                        Nama Barang
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2 text-sm"
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
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-xl">
                            {suggestions.map((ref, idx) => (
                                <li
                                    key={idx}
                                    className="cursor-pointer border-b px-4 py-2 text-sm hover:bg-blue-50"
                                    onClick={() => {
                                        setSearchTerm(ref.name);
                                        setValue('name', ref.name);
                                        setValue('code', ref.code);
                                        fetch(`/items/next-nup/${ref.code}`)
                                            .then((res) => res.json())
                                            .then((d) =>
                                                setValue('nup', d.next_nup),
                                            );
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
                        className="w-full rounded border bg-gray-50 px-3 py-2 text-sm"
                        {...register('code')}
                        readOnly
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground">
                        NUP
                    </label>
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2 text-sm"
                        {...register('nup')}
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
                    {...register('category', { required: true })}
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((opt) => (
                        <option key={opt.id} value={opt.id.toString()}>
                            {opt.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Field Dinamis: Atribut (Merk, Tipe, dsb) */}
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
                        {statuses.map((o) => (
                            <option key={o.id} value={o.id.toString()}>
                                {o.name}
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
                        {conditions.map((o) => (
                            <option key={o.id} value={o.id.toString()}>
                                {o.name}
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
                    className="w-full border px-3 py-2 text-sm"
                    {...register('photo')}
                />
            </div>

            {/* Tambahkan Input BAST di sini */}
            <div>
                <label className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>File BAST (Berita Acara)</span>
                    <span className="text-[10px] font-normal text-orange-500 italic">
                        * Opsional (Khusus PDF)
                    </span>
                </label>
                <input
                    type="file"
                    accept="application/pdf"
                    className="w-full border bg-white px-3 py-2 text-sm"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setValue('file_bast', e.target.files[0]); // Isi manual ke form
                        }
                    }}
                />
                {errors.file_bast && (
                    <p className="mt-1 text-[10px] text-red-500">
                        Format harus PDF dan max 10MB
                    </p>
                )}
            </div>

            {/* Detil Lokasi Dinamis (Nama Ruangan, Kode Ruangan, dsb) */}
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
                                    setLocationValues((prev) => ({
                                        ...prev,
                                        [loc.key]: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pengguna & Penanggung Jawab */}
            {isAdmin && (
                <div>
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
                </div>
            )}

            <div>
                <label className="text-xs font-medium text-muted-foreground">
                    Penanggung Jawab
                </label>
                <select
                    className="w-full rounded border px-3 py-2 text-sm"
                    {...register('responsible')}
                >
                    <option value="">Pilih</option>
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
