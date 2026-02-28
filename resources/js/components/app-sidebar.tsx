import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Folder,
    LayoutGrid,
    List,
    ScanQrCodeIcon,
    ShieldCheckIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const userRole = auth.user.role;

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light';
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 1. Menu Utama (Tanpa Accordion)
    const generalNav: NavItem[] = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Scan Item', href: '/scan', icon: ScanQrCodeIcon },
        { title: 'Daftar Barang', href: '/items', icon: List },
    ];

    // 2. Administrasi & Master Data (Dengan Accordion)
    const adminNav: NavItem[] = [
        {
            title: 'Administrasi',
            icon: ShieldCheckIcon,
            isActive: false, // ⬅️ UBAH INI JADI FALSE ATAU HAPUS SAJA
            items: [
                { title: 'Manajemen User', href: '/manage-users' },
                { title: 'Log Aktivitas', href: '/admin/activity-logs' },
                { title: 'Laporan BMN', href: '/reports/bmn' },
            ],
        },
        {
            title: 'Konfigurasi Master',
            icon: Folder,
            items: [
                { title: 'Kategori Barang', href: '/master/categories' },
                { title: 'Status Barang', href: '/master/statuses' },
                { title: 'Kondisi Barang', href: '/master/conditions' },
                { title: 'Data Pegawai (User)', href: '/master/user' },
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2 px-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <button
                        onClick={() =>
                            setTheme((prev) =>
                                prev === 'dark' ? 'light' : 'dark',
                            )
                        }
                        className="cursor-pointer rounded-md border px-2 py-1 text-sm hover:bg-muted"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* GRUP MENU UTAMA */}
                <SidebarGroup>
                    <SidebarGroupLabel>Utama</SidebarGroupLabel>
                    <NavMain items={generalNav} />
                </SidebarGroup>

                {/* GRUP KHUSUS ADMIN DENGAN ACCORDION */}
                {userRole === 'admin' && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
                        <NavMain items={adminNav} />
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
