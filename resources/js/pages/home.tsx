import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { HomeIcon, ShoppingCart } from 'lucide-react';
import ProductList from '../components/ui/ProductList';
import { useCart } from '../stores/useCartStore';
let Inertia: any;
try {
    Inertia = require('@inertiajs/inertia');
} catch (e) {
    Inertia = null;
}

export default function Home() {
    const cart = useCart((state) => state.cart);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    console.log(cart);

    return (
        <>
            <NavigationMenu className="w-full">
                <NavigationMenuList className="mx-auto flex">
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/" className="inline-flex items-center gap-2">
                            <span>
                                <HomeIcon />
                            </span>
                            <span>Home</span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/cart" className="inline-flex items-center gap-2 font-bold text-red-600">
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
