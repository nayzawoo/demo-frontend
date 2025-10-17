// Update the import path below to the correct location of useIsMobile or create the hook if it doesn't exist
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import ProductList from '../components/ui/ProductList';
// import Inertia client lazily to avoid type conflicts in some environments
let Inertia: any;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    Inertia = require('@inertiajs/inertia');
} catch (e) {
    // fallback: will attempt to navigate via location if Inertia is unavailable
    Inertia = null;
}

export default function Welcome() {
    return (
        <>
            <div className="mb-4 flex w-full justify-end">
                <button
                    type="button"
                    aria-label="Open cart"
                    className="relative m-2 inline-flex items-center rounded-md p-2 hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    onClick={async (e) => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        const badge = btn.querySelector('[data-badge]') as HTMLSpanElement | null;
                        try {
                            const res = await fetch('http://demo.test/api/view_cart', {
                                method: 'GET',
                                headers: { Accept: 'application/json' },
                                credentials: 'same-origin',
                            });
                            if (!res.ok) throw new Error(`viewCart failed: ${res.status}`);
                            const data = await res.json();
                            const count = Number(data?.count ?? (Array.isArray(data?.items) ? data.items.length : 0)) || 0;
                            if (badge) badge.textContent = String(count);
                            console.log('viewCart:', data);
                            // navigate to the cart page (prefer Inertia, fallback to location)
                            if (Inertia?.visit) Inertia.visit('/cart');
                            else window.location.href = '/cart';
                        } catch (err) {
                            console.error(err);
                        }
                    }}
                >
                    <span className="text-2xl" aria-hidden>
                        🛒
                    </span>
                    <span
                        data-badge
                        className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white"
                    >
                        0
                    </span>
                </button>
            </div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <ProductList />
        </>
    );
}
