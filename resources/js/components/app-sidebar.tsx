import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ActivityIcon,
    FileTextIcon,
    Folder,
    LayoutGrid,
    List,
    ScanQrCodeIcon,
    ShieldCheckIcon,
    UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

export function AppSidebar() {
    // Ambil data auth dari props global Inertia
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

    // Definisi Menu Utama dengan Logika Role
    const mainNavItems: NavItem[] = [
        {
            title: 'Scan Item',
            href: '/scan',
            icon: ScanQrCodeIcon,
        },
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Daftar Barang',
            href: '/items',
            icon: List,
        },
        // HANYA MUNCUL JIKA ADMIN
        ...(userRole === 'admin'
            ? [
                  {
                      title: 'Manajemen User',
                      href: '/manage-users',
                      icon: ShieldCheckIcon,
                  },
                  {
                      title: 'Log Aktivitas',
                      href: '/admin/activity-logs',
                      icon: ActivityIcon,
                  },
                  {
                      title: 'Laporan BMN',
                      href: '/reports/bmn',
                      icon: FileTextIcon,
                  },
                  {
                      title: 'Master Data',
                      icon: Folder,
                      children: [
                          {
                              title: 'Category',
                              href: '/master/categories',
                          },
                          {
                              title: 'Status',
                              href: '/master/statuses',
                          },
                          {
                              title: 'Condition',
                              href: '/master/conditions',
                          },
                          {
                              title: 'Master User',
                              href: '/master/user',
                              icon: UserIcon,
                          },
                      ],
                  },
              ]
            : []),
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
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
