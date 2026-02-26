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

// BEFOR ADD USER TABLE
// export interface Item {
//     id: number;
//     name: string;
//     code: string;
//     category: string;       // category name
//     category_id: number;    // category id
//     status: string;         // status name
//     status_id: number;      // status id
//     condition: string;      // condition name
//     condition_id: number;   // condition id
//     location: string;
//     user: string;
//     responsible: string;
//     files?: string;
//     attributes?: Record<string, string>;

// }

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
    attributes?: Record<string, string>;
    location_values: Record<string, any> | null;
}

//BEFORE ADD USER TABLES
// export type ItemFormValues = {
//   name: string;
//   code: string;
//   category: string;       
//   status: string;         
//   condition: string;      
//   location: string;
//   user: string;
//   responsible: string;
//   photo?: FileList;
//   attributes?: Record<string, string>;
// };

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
  attributes?: Record<string, string>;
};

export type ItemAttribute =
    | string
    | {
          name: string;
          value: string;
      };

export type ItemAttributes = Record<string, ItemAttribute>;
