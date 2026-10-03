import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

import {
    fetchProducts
} from "../../redux/slices/productSlice";

import {
    updateProduct,
    getProducts
} from "../../services/productService";

function AdminProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [
        deleteProduct,
        setDeleteProduct
    ] = useState(null);

    const [
        restoreProduct,
        setRestoreProduct
    ] = useState(null);

    const [
        allProducts,
        setAllProducts
    ] = useState([]);

    const [
        searchTerm,
        setSearchTerm
    ] = useState("");

    const [
        category,
        setCategory
    ] = useState("all");

    const [
        sortOption,
        setSortOption
    ] = useState("default");

    const [
        productView,
        setProductView
    ] = useState("active");

    const debouncedSearchTerm =
        useDebounce(searchTerm, 500);

    const {
        products,
        loading,
        error
    } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        if (products.length === 0) {
            dispatch(
                fetchProducts()
            );
        }
    }, [
        dispatch,
        products.length
    ]);

    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            try {
                const data =
                    await getProducts();

                if (!cancelled) {
                    setAllProducts(
                        [...data].reverse()
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load all products:",
                    error
                );
            }
        };

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    const categories = [
        ...new Set(
            allProducts
                .map(
                    (product) =>
                        product.category
                )
                .filter(Boolean)
        )
    ];

    const filteredProducts =
        allProducts
            .filter((product) => {
                if (
                    productView ===
                    "active"
                ) {
                    return (
                        product.isDeleted !==
                        true
                    );
                }

                return (
                    product.isDeleted ===
                    true
                );
            })
            .filter((product) => {
                const matchesSearch =
                    product.name
                        ?.toLowerCase()
                        .includes(
                            debouncedSearchTerm.toLowerCase()
                        );

                const matchesCategory =
                    category === "all" ||
                    product.category ===
                        category;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            })
            .sort((a, b) => {
                if (
                    sortOption ===
                    "price-low"
                ) {
                    return (
                        Number(a.price) -
                        Number(b.price)
                    );
                }

                if (
                    sortOption ===
                    "price-high"
                ) {
                    return (
                        Number(b.price) -
                        Number(a.price)
                    );
                }

                if (
                    sortOption ===
                    "name-az"
                ) {
                    return a.name.localeCompare(
                        b.name
                    );
                }

                if (
                    sortOption ===
                    "name-za"
                ) {
                    return b.name.localeCompare(
                        a.name
                    );
                }

                return 0;
            });

    const handleSoftDelete =
        async () => {
            if (!deleteProduct) {
                return;
            }

            try {
                await updateProduct(
                    deleteProduct.id,
                    {
                        isDeleted: true
                    }
                );

                const data =
                    await getProducts();

                setAllProducts(
                    [...data].reverse()
                );

                dispatch(
                    fetchProducts()
                );

                setDeleteProduct(
                    null
                );
            } catch (error) {
                console.error(
                    "Failed to delete product:",
                    error
                );
            }
        };

    const handleRestore =
        async () => {
            if (!restoreProduct) {
                return;
            }

            try {
                await updateProduct(
                    restoreProduct.id,
                    {
                        isDeleted: false
                    }
                );

                const data =
                    await getProducts();

                const restoredProduct =
                    data.find(
                        (product) =>
                            String(product.id) ===
                            String(
                                restoreProduct.id
                            )
                    );

                const otherProducts =
                    data.filter(
                        (product) =>
                            String(product.id) !==
                            String(
                                restoreProduct.id
                            )
                    );

                setAllProducts([
                    restoredProduct,
                    ...otherProducts.reverse()
                ]);

                dispatch(
                    fetchProducts()
                );

                setRestoreProduct(
                    null
                );
            } catch (error) {
                console.error(
                    "Failed to restore product:",
                    error
                );
            }
        };

    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Products
                    </h1>

                    <p className="mt-1 text-slate-400">
                        Manage your store products
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/products/add"
                        )
                    }
                    className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                    Add Product
                </button>

            </div>

            <div className="flex flex-wrap gap-2">

                <button
                    type="button"
                    onClick={() =>
                        setProductView(
                            "active"
                        )
                    }
                    className={
                        productView ===
                        "active"
                            ? "rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                            : "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                    }
                >
                    Active Products
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setProductView(
                            "deleted"
                        )
                    }
                    className={
                        productView ===
                        "deleted"
                            ? "rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                            : "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-400"
                    }
                >
                    Deleted Products
                </button>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(
                            event.target.value
                        )
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />

                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(
                            event.target.value
                        )
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                    <option value="all">
                        All Categories
                    </option>

                    {categories.map(
                        (item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        )
                    )}

                </select>

                <select
                    value={sortOption}
                    onChange={(event) =>
                        setSortOption(
                            event.target.value
                        )
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                    <option value="default">
                        Sort By
                    </option>

                    <option value="price-low">
                        Price: Low to High
                    </option>

                    <option value="price-high">
                        Price: High to Low
                    </option>

                    <option value="name-az">
                        Name: A to Z
                    </option>

                    <option value="name-za">
                        Name: Z to A
                    </option>

                </select>

            </div>

            {loading && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                    <p className="text-slate-400">
                        Loading products...
                    </p>

                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">

                    <p className="text-red-400">
                        {error}
                    </p>

                </div>
            )}

            {!loading &&
                !error &&
                filteredProducts.length ===
                    0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

                        <p className="text-slate-400">
                            {productView ===
                            "deleted"
                                ? "No deleted products found."
                                : "No products found."}
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                filteredProducts.length >
                    0 && (
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>

                                    <tr className="border-b border-slate-800 text-left text-sm text-slate-400">

                                        <th className="px-5 py-4">
                                            Product
                                        </th>

                                        <th className="px-5 py-4">
                                            Category
                                        </th>

                                        <th className="px-5 py-4">
                                            Price
                                        </th>

                                        <th className="px-5 py-4">
                                            Stock
                                        </th>

                                        <th className="px-5 py-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredProducts.map(
                                        (product) => (

                                            <tr
                                                key={
                                                    product.id
                                                }
                                                className="border-b border-slate-800 transition hover:bg-slate-800/50 last:border-0"
                                            >

                                                <td className="px-5 py-4 font-medium">
                                                    {
                                                        product.name
                                                    }
                                                </td>

                                                <td className="px-5 py-4 text-slate-400">
                                                    {
                                                        product.category
                                                    }
                                                </td>

                                                <td className="px-5 py-4 font-medium">
                                                    ₹
                                                    {
                                                        product.price
                                                    }
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={
                                                            Number(
                                                                product.stock
                                                            ) <=
                                                            5
                                                                ? "text-red-400"
                                                                : "text-green-400"
                                                        }
                                                    >
                                                        {
                                                            product.stock
                                                        }
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4">

                                                    {productView ===
                                                    "active" ? (

                                                        <div className="flex gap-2">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/products/edit/${product.id}`
                                                                    )
                                                                }
                                                                className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeleteProduct(
                                                                        product
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setRestoreProduct(
                                                                    product
                                                                )
                                                            }
                                                            className="rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/20"
                                                        >
                                                            Restore
                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

            {deleteProduct && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

                    <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">

                        <h2 className="text-xl font-bold">
                            Delete Product
                        </h2>

                        <p className="mt-3 text-slate-400">

                            Are you sure you want to delete{" "}

                            <strong className="text-white">
                                {
                                    deleteProduct.name
                                }
                            </strong>

                            ?

                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteProduct(
                                        null
                                    )
                                }
                                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleSoftDelete
                                }
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                            >
                                Yes, Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {restoreProduct && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

                    <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">

                        <h2 className="text-xl font-bold">
                            Restore Product
                        </h2>

                        <p className="mt-3 text-slate-400">

                            Are you sure you want to restore{" "}

                            <strong className="text-white">
                                {
                                    restoreProduct.name
                                }
                            </strong>

                            ?

                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            This product will become available in the store again.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setRestoreProduct(
                                        null
                                    )
                                }
                                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleRestore
                                }
                                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-green-400"
                            >
                                Yes, Restore
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminProducts;