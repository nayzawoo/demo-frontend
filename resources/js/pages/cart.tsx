import axios from 'axios';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

type CartItem = {
    id: string;
    title: string;
    price: number; // cents
    quantity: number;
    image?: string;
    sku?: string;
};

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items?: Crumb[] }) {
    const crumbs: Crumb[] = items ?? [{ href: '/', label: 'Home' }, { label: 'Cart' }];

    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: 12 }}>
            <ol
                style={{
                    display: 'flex',
                    gap: 8,
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    alignItems: 'center',
                    color: '#6b7280',
                    fontSize: 13,
                }}
            >
                {crumbs.map((c, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        {i > 0 && <span style={{ margin: '0 8px', color: '#e5e7eb' }}>/</span>}
                        {c.href ? (
                            <a href={c.href} style={{ color: '#6b7280', textDecoration: 'none' }}>
                                {c.label}
                            </a>
                        ) : (
                            <span style={{ color: '#111827', fontWeight: 600 }}>{c.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
const formatPrice = (cents: number) => (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' });

export default function Cart(): ReactElement {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const initialLoadRef = useRef(true);

    // Load from API using axios
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        axios
            .get<CartItem[]>('http://demo.test/api/view_cart', { signal: controller.signal })
            .then((res) => {
                setItems(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                setError(err?.message ?? 'Failed to load cart');
                // Optional fallback: seed demo data when API fails
                setItems([
                    { id: 'prod_1', title: 'Classic Tee', price: 1999, quantity: 2, sku: 'CT-001' },
                    { id: 'prod_2', title: 'Canvas Tote', price: 1499, quantity: 1, sku: 'TO-002' },
                ]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, []);

    // Persist to API whenever items change (skip the initial load)
    useEffect(() => {
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }

        const controller = new AbortController();
        const save = async () => {
            try {
                await axios.put('/api/cart', items, {
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                });
            } catch {
                // Ignore save errors for demo; you could setError here or retry
            }
        };
        save();
        return () => controller.abort();
    }, [items]);

    const updateQuantity = useCallback((id: string, delta: number) => {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(0, it.quantity + delta) } : it)).filter((it) => it.quantity > 0),
        );
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shipping = subtotal > 0 ? 500 : 0; // flat $5 shipping for demo
    const tax = Math.round(subtotal * 0.08); // 8% demo tax
    const total = subtotal + shipping + tax;

    const handleCheckout = useCallback(() => {
        alert(`Checkout not implemented.\nTotal: ${formatPrice(total)}`);
    }, [total]);

    return (
        <div
            style={{
                maxWidth: 960,
                margin: '32px auto',
                padding: 16,
                fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
            }}
        >
            <Breadcrumbs />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Your Cart</h1>
                <small style={{ color: '#666' }}>
                    {items.length} item{items.length !== 1 ? 's' : ''}
                </small>
            </header>

            {loading ? (
                <section style={{ textAlign: 'center', padding: 40 }}>Loading...</section>
            ) : error ? (
                <section style={{ textAlign: 'center', padding: 40, color: 'crimson' }}>{error}</section>
            ) : items.length === 0 ? (
                <section style={{ textAlign: 'center', padding: 40, border: '1px dashed #ddd', borderRadius: 8 }}>
                    <p style={{ margin: 0 }}>Your cart is empty.</p>
                    <p style={{ marginTop: 12, color: '#666' }}>Browse products and add them to your cart.</p>
                </section>
            ) : (
                <main style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                    <section>
                        {items.map((item) => (
                            <article
                                key={item.id}
                                style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderBottom: '1px solid #f0f0f0' }}
                            >
                                <div
                                    style={{
                                        width: 72,
                                        height: 72,
                                        background: '#fafafa',
                                        border: '1px solid #eee',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                    }}
                                >
                                    <span style={{ color: '#888', fontSize: 12 }}>Image</span>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                                            {item.sku && <div style={{ fontSize: 12, color: '#666' }}>{item.sku}</div>}
                                        </div>
                                        <div style={{ fontWeight: 700 }}>{formatPrice(item.price)}</div>
                                    </div>

                                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
                                            <button
                                                aria-label={`Decrease quantity of ${item.title}`}
                                                onClick={() => updateQuantity(item.id, -1)}
                                                style={{ padding: '6px 10px', background: 'white', border: 'none', cursor: 'pointer' }}
                                            >
                                                −
                                            </button>
                                            <div style={{ padding: '6px 12px', minWidth: 44, textAlign: 'center' }}>{item.quantity}</div>
                                            <button
                                                aria-label={`Increase quantity of ${item.title}`}
                                                onClick={() => updateQuantity(item.id, 1)}
                                                style={{ padding: '6px 10px', background: 'white', border: 'none', cursor: 'pointer' }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{ background: 'transparent', border: 'none', color: '#d00', cursor: 'pointer', fontSize: 13 }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    <aside style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0 }}>Summary</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <div style={{ color: '#666' }}>Subtotal</div>
                            <div>{formatPrice(subtotal)}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <div style={{ color: '#666' }}>Shipping</div>
                            <div>{shipping === 0 ? 'Free' : formatPrice(shipping)}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <div style={{ color: '#666' }}>Estimated Tax</div>
                            <div>{formatPrice(tax)}</div>
                        </div>

                        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                            <div>Total</div>
                            <div>{formatPrice(total)}</div>
                        </div>

                        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                            <button
                                onClick={handleCheckout}
                                style={{
                                    flex: 1,
                                    background: '#111827',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 12px',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                }}
                            >
                                Checkout
                            </button>

                            <button
                                onClick={clearCart}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #ddd',
                                    padding: '10px 12px',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </aside>
                </main>
            )}
        </div>
    );
}
