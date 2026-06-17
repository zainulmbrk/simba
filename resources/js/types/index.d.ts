import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>; // ⬅️ OPTIONAL
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[]; // ⬅️ TAMBAH INI
    items?: {
        title: string;
        href: string;
        icon?: LucideIcon;
    }[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

//AFTER ADD USER TABLE
export interface Item {
    id: number;
    name: string;
    code: string;
    nup: number | string;
    category: string;       
    category_id: number;    
    status: string;         
    status_id: number;      
    condition: string;      
    condition_id: number;   
    location: string;
    user_id: number;        // ⬅️ UBAH INI (dari user: string)
    user?: string;          // ⬅️ Opsional: Tambahkan ini untuk menyimpan Nama User saja
    responsible: string;
    files?: string;
    file_bast?: string;
    attributes?: Record<string, string>;
    location_values: Record<string, any> | null;
}

//AFTER ADD USER TABLE
export type ItemFormValues = {
  name: string;
  code: string;
  nup: number | string;
  category: string;       
  status: string;         
  condition: string;      
  location: string;
  user_id: string;        // ⬅️ GANTI 'user' MENJADI 'user_id'
  responsible: string;
  photo?: FileList;
  file_bast?: File | null;
  attributes?: Record<string, string>;
  location_values?: Record<string, any>;
};

export type ItemAttribute =
    | string
    | {
          name: string;
          value: string;
      };

export type ItemAttributes = Record<string, ItemAttribute>;

export interface Room {
    id: number;
    master_building_id: number;
    name: string;
    code?: string;
}

export interface Building {
    id: number;
    name: string;
    rooms: Room[];
}

export interface CategoryLocation {
    id: number;
    name: string;
    key: string;
}

export interface Category {
    id: number;
    name: string;
    locations?: CategoryLocation[]; // Pastikan ini ada
    attributes?: any[]; 
}