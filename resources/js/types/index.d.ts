export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    picture?: string;
    [key: string]: unknown;
}

export interface CartItem {
    id?: number;
    product?: Product;
    product_id?: number;
    name?: string;
    quantity: number;
    price?: number;
    subtotal?: number;
    [key: string]: unknown;
}

export interface Cart {
    items: CartItem[];
    count: number;
    total: number;
}

export {};
