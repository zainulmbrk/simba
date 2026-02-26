import { ItemFormValues } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type ItemFormProps = {
    initialValues: ItemFormValues;
    categories: any[];
    statuses: any[];
    conditions: any[];
    users: any[]; // Tambahkan props users
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
    users = [], // Default ke array kosong
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

    // STATE
    const [searchTerm, setSearchTerm] = useState(initialValues.name || '');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (initialValues.name) {
            setSearchTerm(initialValues.name);
            // Pastikan react-hook-form juga tahu code-nya saat mulai edit
            setValue('code', initialValues.code);
            setValue('name', initialValues.name);
        } else {
            setSearchTerm('');
        }
    }, [initialValues, setValue]);

    // NUP
    /* =================== LOGIKA NUP OTOMATIS =================== */
    const watchCode = watch('code');

    useEffect(() => {
        // Hanya jalan jika ada code dan bukan dalam mode edit (initialValues.nup kosong)
        if (watchCode && !initialValues.nup) {
            // Opsional: Anda bisa fetch ke API untuk dapat NUP terbaru secara live
            // fetch(`/api/items/next-nup?code=${watchCode}`)
            //     .then(res => res.json())
            //     .then(data => setValue('nup', data.next_nup));
            // Sementara, kita biarkan backend yang handle jika user mengosongkan,
            // atau beri info di UI.
        }
    }, [watchCode, initialValues.nup, setValue]);

    const suggestions =
        searchTerm.length >= 2
            ? itemReferences
                  .filter((ref) =>
                      ref.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .slice(0, 10)
            : [];

    /* =================== SHOW CATEGORY =================== */
    const selectedCategoryId = watch('category');
    const selectedCategory = categories.find(
        (c) => c.id.toString() === selectedCategoryId,
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
    }, [selectedCategory]);

    useEffect(() => {
        if (!selectedCategory) return;

        setLocationValues((prev) => {
            const next: Record<string, string> = { ...prev }; // Ambil data yang sudah ada (dari props edit)

            selectedCategory.locations?.forEach((loc: any) => {
                // Hanya isi dengan string kosong jika kuncinya benar-benar belum ada
                if (!(loc.key in next)) {
                    next[loc.key] = '';
                }
            });
            return next;
        });
    }, [selectedCategory, setLocationValues]); // Tambahkan setLocationValues ke dependency

    /* =================== FILTER SEKRETARIS =================== */
    const secretaries = users.filter((u) => {
        const jabatan = u.job_title || '';
        return jabatan.toLowerCase().includes('sekretaris');
    });

    //GET USER
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
                    {' '}
                    {/* Tambahkan relative untuk dropdown */}
                    <label className="text-xs font-medium text-muted-foreground">
                        Nama Barang
                    </label>
                    <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        placeholder="Ketik minimal 2 huruf..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setValue('name', e.target.value); // Update nilai di react-hook-form
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
                                        // Tambahkan { shouldDirty: true, shouldValidate: true }
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
                        readOnly // Biar user tidak asal ubah kode yang sudah standar
                    />
                </div>
                {/* NUP (Nomor Urut Perolehan) */}
                <div>
                    <label className="text-xs font-medium text-muted-foreground">
                        NUP (No. Urut)
                    </label>
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2 text-sm"
                        {...register('nup')}
                        placeholder="Otomatis" // ⬅️ Biarkan placeholder yang muncul, bukan angka 0
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

            {/* Foto & Lokasi */}
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

            {/* --- BAGIAN LOKASI DINAMIS --- */}
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

            {/* --- PENGGUNA BARANG (DROPDOWN) --- */}
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
                            <option key={u.id} value={u.id}>
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

            {/* --- PENANGGUNG JAWAB (SELECT) --- */}
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

                {/* Feedback jika filter berhasil atau gagal */}
                {errors.responsible && (
                    <p className="mt-1 text-xs text-red-500">
                        Wajib pilih penanggung jawab
                    </p>
                )}
                {secretaries.length === 0 && (
                    <p className="mt-1 text-[10px] text-amber-600 italic">
                        *Data dengan job_title "Sekretaris" tidak ditemukan di
                        array users.
                    </p>
                )}
            </div>
        </form>
    );
}
