// Update the import path below to the correct location of useIsMobile or create the hook if it doesn't exist
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ShoppingCart } from 'lucide-react';
import ProductList from '../components/ui/ProductList';
import { useCart } from '../stores/useCartStore';
let Inertia: any;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    Inertia = require('@inertiajs/inertia');
} catch (e) {
    // fallback: will attempt to navigate via location if Inertia is unavailable
    Inertia = null;
}

export default function Home() {
    const addCart = useCart((state) => state.addCart);
    const cart = useCart((state) => state.cart);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    console.log(cart);

    return (
        <>
            <NavigationMenu className="w-full">
                <NavigationMenuList className="mx-auto flex w-full max-w-5xl flex-row justify-between bg-blue-200">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/" className="inline-flex items-center gap-2">
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"
                                />
                            </svg>
                            <span>Home</span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/cart" className="inline-flex items-center gap-2">
                            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
                            <span>Cart ({totalItems})</span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <ProductList />
        </>
    );
}
