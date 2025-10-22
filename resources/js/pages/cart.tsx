import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Home, Minus, Plus, Trash } from 'lucide-react';
import { JSX } from 'react';
import { useCart } from '../stores/useCartStore';

const Icons = {
    home: Home,
    chevronRight: ChevronRight,
    trash: Trash,
    minus: Minus,
    plus: Plus,
};

export default function CartPage(): JSX.Element {
    const cart = useCart((state) => state.cart);
    const addCart = useCart((state) => state.addCart);
    const getTotalPrice = useCart((state) => state.getTotalPrice);
    const removeCart = useCart((state) => state.removeCart);
    const clearCart = useCart((state) => state.clearCart);
    const updateQty = useCart((state) => state.updateQuantity);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
                <a href="/" className="inline-flex items-center hover:underline">
                    <span className="sr-only">Home</span>
                    <Icons.home className="mr-2 h-4 w-4" />
                    Home
                </a>
                <Icons.chevronRight className="mx-3 h-4 w-4" />
                <span className="font-medium">Cart</span>
            </nav>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Items list */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary">{cart.length} items</Badge>
                            <Button variant="ghost" size="sm" onClick={clearCart} disabled={cart.length === 0}>
                                <Icons.trash className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </div>

                    <Card className="space-y-4 p-4">
                        {cart.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">Your cart is empty.</div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    {/* Avatar wrapper removed; using inner div below */}
                                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-muted">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="font-medium">{item.title.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium">{item.title}</div>
                                                {/* <div className="mt-1 text-xs text-muted-foreground">SKU: {item.sku}</div> */}
                                            </div>

                                            <div className="text-right">
                                                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                                <div className="text-xs text-muted-foreground">${item.price} each</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex items-center overflow-hidden rounded-md border">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => updateQty(item.id, item.quantity - 1)}
                                                >
                                                    <Icons.minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    className="w-16 border-0 text-center"
                                                    value={String(item.quantity)}
                                                    onChange={(e) => {
                                                        const v = parseInt(e.target.value || '1', 10);
                                                        if (!Number.isNaN(v)) updateQty(item.id, v);
                                                    }}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => updateQty(item.id, item.quantity + 1)}
                                                >
                                                    <Icons.plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <Button variant="ghost" size="sm" onClick={() => removeCart(item.id)} className="text-destructive">
                                                <Icons.trash className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </div>

                {/* Summary */}
                <aside>
                    <Card className="space-y-4 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Order Summary</h3>
                            <Badge variant="outline">{cart.length} items</Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>NewYork</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>$20</span>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground">Total</div>
                                <div className="text-2xl font-semibold">${getTotalPrice().toFixed(2)}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button disabled={cart.length === 0}>Proceed to Checkout</Button>
                                <Button variant="ghost">Continue Shopping</Button>
                            </div>
                        </div>
                    </Card>

                    {/* <Card className="mt-4 text-sm text-muted-foreground">
                        <div className="mb-2 font-medium">Shipping & Returns</div>
                        <p>Shipping calculated at checkout. Returns accepted within 30 days of delivery.</p>
                    </Card> */}
                </aside>
            </div>
        </div>
    );
}
