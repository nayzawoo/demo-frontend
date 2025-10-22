import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";
import axios from "axios";
import { useCart } from '../../stores/useCartStore';

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
    };

    useEffect(() => {
        // Replace with your actual API endpoint
        fetch("http://demo.test/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.data);
                console.log("Fetched products:", data.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
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
                        // adapt to your API shape (res.data.data vs res.data)
                        setProducts(res.data.data ?? res.data);
                        // update the URL so refresh/bookmarks keep the page
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
                // simple window-based windowing: show current ±2 pages
                const visibleCount = 5;
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
