import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

('use client');

/**
 * Cart page built with Tailwind + shadcn/ui components.
 * Save as: /resources/js/pages/cart.tsx
 */

export type CartItem = {
    id: string;
    name: string;
    price: number;
    qty: number;
    img?: string;
    desc?: string;
};

const initialItems: CartItem[] = [
    {
        id: 'sku-1',
        name: 'Silk Pillowcase',
        price: 34.0,
        qty: 1,
        img: 'https://images.unsplash.com/photo-1601297138373-3f2f2b2a4f2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b5f8d216d9de5a8abf2b1f3f9b2a1a4',
        desc: 'Luxury mulberry silk pillowcase — cool & gentle.',
    },
    {
        id: 'sku-2',
        name: 'Aromatic Candle',
        price: 18.5,
        qty: 2,
        img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3f6b9c8b6b1c3a7f1f2f8e9c6b4a1a2b',
        desc: 'Hand-poured soy wax candle — calm & cozy.',
    },
];

function formatCurrency(n: number) {
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [coupon, setCoupon] = useState('');
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);

    const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
    const discount = useMemo(() => (coupon.trim().toLowerCase() === 'save10' ? subtotal * 0.1 : 0), [coupon, subtotal]);
    const shipping = useMemo(() => (subtotal > 75 || subtotal === 0 ? 0 : 6.5), [subtotal]);
    const total = subtotal - discount + shipping;

    function updateQty(id: string, delta: number) {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p)).filter(Boolean));
    }

    function removeItem(id: string) {
        setItems((prev) => prev.filter((p) => p.id !== id));
    }

    function clearCart() {
        setItems([]);
    }

    function handleCheckout() {
        setCheckoutOpen(true);
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                            <ShoppingCart className="h-6 w-6 text-sky-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">Your Cart</h1>
                            <p className="text-sm text-slate-500">Review items, apply coupons, and checkout securely.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="px-3 py-2">
                            {items.length} items
                        </Badge>
                        <Button variant="ghost" onClick={clearCart} className="hidden sm:inline-flex">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                </header>

                <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="lg:col-span-2">
                        <Card className="overflow-hidden p-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-medium">Items</h2>
                                <p className="mb-4 text-sm text-slate-500">Items in your cart are reserved for a limited time.</p>

                                <ScrollArea className="max-h-[520px]">
                                    <ul className="space-y-4">
                                        {items.length === 0 && (
                                            <li className="py-12 text-center text-slate-500">Your cart is empty — add some delightful items.</li>
                                        )}

                                        {items.map((item) => (
                                            <li key={item.id} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                                                <img src={item.img} alt={item.name} className="h-20 w-20 flex-shrink-0 rounded-md object-cover" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-medium">{item.name}</h3>
                                                            <p className="max-w-[420px] truncate text-sm text-slate-500">{item.desc}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold">{formatCurrency(item.price)}</div>
                                                            <div className="text-sm text-slate-400">each</div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between gap-4">
                                                        <div className="flex items-center rounded-md bg-slate-100 p-1">
                                                            <button
                                                                aria-label="decrease"
                                                                onClick={() => updateQty(item.id, -1)}
                                                                className="rounded p-2 hover:bg-slate-200"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <div className="px-3 font-medium">{item.qty}</div>
                                                            <button
                                                                aria-label="increase"
                                                                onClick={() => updateQty(item.id, +1)}
                                                                className="rounded p-2 hover:bg-slate-200"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="mr-3 text-sm text-slate-500">{formatCurrency(item.price * item.qty)}</div>
                                                            <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </div>
                        </Card>
                    </section>

                    <aside>
                        <Card className="p-6">
                            <h3 className="mb-3 text-lg font-medium">Summary</h3>

                            <div className="mb-4 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Discount</span>
                                    <span className="text-emerald-600">-{formatCurrency(discount)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-slate-500">Total</div>
                                        <div className="text-xl font-semibold">{formatCurrency(total)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Input placeholder="Coupon code (try: SAVE10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                                <Button className="w-full" onClick={handleCheckout} disabled={items.length === 0}>
                                    Checkout
                                </Button>

                                <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
                                    <DialogTrigger asChild>
                                        {/* Invisible trigger handled by state; kept for a11y */}

                                        <span />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Confirm Purchase</DialogTitle>
                                            <DialogDescription>
                                                You are about to pay {formatCurrency(total)}. This is a mock checkout for demo purposes.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-4">
                                            <ul className="space-y-2">
                                                {items.map((it) => (
                                                    <li key={it.id} className="flex justify-between text-sm">
                                                        <span>
                                                            {it.name} x {it.qty}
                                                        </span>
                                                        <span>{formatCurrency(it.price * it.qty)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setCheckoutOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setCheckoutOpen(false);
                                                    clearCart();
                                                }}
                                                className="ml-2"
                                            >
                                                Pay {formatCurrency(total)}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                    </aside>
                </main>

                <footer className="mt-8 text-center text-sm text-slate-500">
                    Tip: Use coupon code <span className="font-medium">SAVE10</span> for 10% off.
                </footer>
            </div>
        </div>
    );
}
