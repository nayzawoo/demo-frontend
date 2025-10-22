import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";
import axios from "axios";
import { useCart } from '../../stores/useCartStore';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const handleAddToCard = (product: Product) => {
        useCart.getState().addCart({
            id: product.id,
            image: product.picture || "",
            title: product.name || "Untitled",
            price: product.price || 0,
            quantity: 1,
        });

        // console.log("Added to cart:", product);
        (async () => {
            try {
                const { createRoot } = await import("react-dom/client");


                const container = document.createElement("div");
                document.body.appendChild(container);
                const root = createRoot(container);

                const Dialog: React.FC = () => {
                    const [open, setOpen] = React.useState(true);

                    return (
                        <AlertDialog
                            open={open}
                            onOpenChange={(v) => {
                                setOpen(v);
                                if (!v) {
                                    // cleanup after close
                                    setTimeout(() => {
                                        try {
                                            root.unmount();
                                        } catch {}
                                        container.remove();
                                    }, 0);
                                }
                            }}
                        >
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Added to cart</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {product.name} has been added to your cart.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setOpen(false)}>
                                        Continue shopping
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            // navigate to cart
                                            window.location.href = "/cart";
                                        }}
                                    >
                                        View cart
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    );
                };

                root.render(<Dialog />);
            } catch (err) {
                console.error("Failed to show alert dialog:", err);
            }
        })();
    };

    useEffect(() => {
        fetch("http://demo.test/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.data);
                // console.log("Fetched products:", data.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    function getVisiblePageCount() {
        const totalPages = Math.ceil(products.length / 10); // Assuming 10 products per page
        return Math.min(totalPages, 10); // Show a maximum of 5 page numbers
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <Card key={product.id}>
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {product.picture && (
                            <img
                                src={product.picture}
                                alt={product.name}
                                className="mb-4 w-full h-40 object-cover rounded"
                            />
                        )}
                        <p className="text-sm text-muted-foreground mb-2">
                            {product.description}
                        </p>
                        <div className="font-bold text-lg">${product.price}</div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" aria-label="Submit" onClick={() => handleAddToCard(product)}>
                            Add to Cart
                            <PlusIcon />
                        </Button>
                    </CardFooter>
                </Card>
            ))}

            {(() => {
                const getCurrentPage = () => {
                    const params = new URLSearchParams(window.location.search);
                    const p = Number(params.get("page") || "1");
                    return Number.isFinite(p) && p > 0 ? p : 1;
                };

                const fetchPage = async (page: number) => {
                    setLoading(true);
                    try {
                        const res = await axios.get(`http://demo.test/api/products?page=${page}`);
                        setProducts(res.data.data ?? res.data);
                        const url = new URL(window.location.href);
                        url.searchParams.set("page", String(page));
                        window.history.pushState({}, "", url.toString());
                    } catch (err) {
                        console.error("Error fetching page:", err);
                    } finally {
                        setLoading(false);
                    }
                };

                const currentPage = getCurrentPage();
                const visibleCount = getVisiblePageCount();
                const start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
                const pages = Array.from({ length: visibleCount }, (_, i) => start + i);

                return (
                    <div className="w-full col-span-1 sm:col-span-2 md:col-span-3 flex items-center justify-center mt-4">
                        <nav className="inline-flex items-center space-x-2" aria-label="Pagination">
                            <button
                                onClick={() => fetchPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage <= 1}
                                className="px-3 py-1 rounded border hover:bg-muted-foreground disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {pages.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => fetchPage(p)}
                                    aria-current={p === currentPage ? "page" : undefined}
                                    className={`px-3 py-1 rounded border hover:bg-muted-foreground ${p === currentPage ? "font-bold bg-muted" : ""}`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => fetchPage(currentPage + 1)}
                                className="px-3 py-1 rounded border hover:bg-muted-foreground"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                );
            })()}
        </div>
    );
};

export default ProductList;
