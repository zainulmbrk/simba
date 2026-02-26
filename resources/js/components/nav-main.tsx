import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [open, setOpen] = useState<string | null>(null);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // ✅ JIKA ADA SUBMENU
                    if (item.children && item.children.length > 0) {
                        const isOpen = open === item.title;

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    onClick={() =>
                                        setOpen(isOpen ? null : item.title)
                                    }
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronDown
                                        className={`ml-auto h-4 w-4 transition ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </SidebarMenuButton>

                                {isOpen &&
                                    item.children.map((child) =>
                                        child.href ? (
                                            <SidebarMenuItem
                                                key={child.title}
                                                className="ml-6"
                                            >
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={page.url.startsWith(
                                                        resolveUrl(child.href),
                                                    )}
                                                >
                                                    <Link
                                                        href={child.href}
                                                        prefetch
                                                    >
                                                        <span>
                                                            {child.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ) : null,
                                    )}
                            </SidebarMenuItem>
                        );
                    }

                    // ✅ MENU NORMAL (TANPA SUB)
                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.href ? (
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(
                                        resolveUrl(item.href),
                                    )}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton
                                    onClick={() =>
                                        setOpen(
                                            open === item.title
                                                ? null
                                                : item.title,
                                        )
                                    }
                                    tooltip={{ children: item.title }}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
