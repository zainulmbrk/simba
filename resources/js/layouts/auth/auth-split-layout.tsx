import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-red-900" />
                <div className="relative z-20 flex h-full flex-col items-center justify-center gap-4">
                    {/* <p className='font-bold text-5xl'>SIMBA</p> */}
                    <div className="flex gap-8">
                        <img
                            src="/assets/logo-kpu.svg.png"
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                        <div className="flex flex-col justify-between">
                            <p className="text-7xl font-bold">KPU</p>
                            <p className="text-5xl">KOTA BIMA</p>
                        </div>
                    </div>
                    <h1 className="text-center text-xl font-bold tracking-wider">
                        Sistem Informasi Manajemen Barang (SIMBA)
                    </h1>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <div className="flex gap-4">
                            <img
                                src="/assets/logo-kpu.svg.png"
                                alt="Logo"
                                width={75}
                                height={75}
                            />
                            <div className="flex flex-col justify-between">
                                <p className="text-5xl font-bold">KPU</p>
                                <p className="text-3xl">KOTA BIMA</p>
                            </div>
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
