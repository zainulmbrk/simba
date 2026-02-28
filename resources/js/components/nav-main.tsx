'use client';

import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    /**
     * State untuk melacak menu mana saja yang sedang terbuka.
     * Inisialisasi: Cek semua item, jika ada sub-item yang URL-nya cocok dengan
     * halaman saat ini, masukkan title-nya ke dalam list "open".
     */
    const [openMenus, setOpenMenus] = useState<string[]>(() => {
        return items
            .filter((item) => {
                const subItems = item.items || item.children;
                return subItems?.some((child) =>
                    child.href
                        ? page.url.startsWith(resolveUrl(child.href))
                        : false,
                );
            })
            .map((item) => item.title);
    });

    /**
     * Fungsi untuk buka-tutup menu secara manual saat diklik
     */
    const toggleMenu = (title: string) => {
        setOpenMenus((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title],
        );
    };

    return (
        <SidebarMenu>
            {items.map((item) => {
                const subItems = item.items || item.children;
                const hasSubmenu = subItems && subItems.length > 0;
                const isOpen = openMenus.includes(item.title);

                // --- RENDERING MENU DENGAN SUB-MENU (ACCORDION) ---
                if (hasSubmenu) {
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                onClick={() => toggleMenu(item.title)}
                                className="cursor-pointer"
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span className="font-medium">
                                    {item.title}
                                </span>
                                <ChevronDown
                                    className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                        isOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </SidebarMenuButton>

                            {/* Tampilkan sub-menu jika isOpen true */}
                            {isOpen && (
                                <SidebarMenuSub>
                                    {subItems.map((child) => (
                                        <SidebarMenuSubItem key={child.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={
                                                    child.href
                                                        ? page.url.startsWith(
                                                              resolveUrl(
                                                                  child.href,
                                                              ),
                                                          )
                                                        : false
                                                }
                                            >
                                                <Link href={child.href || '#'}>
                                                    <span>{child.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                }

                // --- RENDERING MENU NORMAL (TANPA ANAK) ---
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={
                                item.href
                                    ? page.url.startsWith(resolveUrl(item.href))
                                    : false
                            }
                            tooltip={item.title}
                        >
                            <Link href={item.href || '#'}>
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
