import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

import { fetchProducts } from "../redux/slices/productSlice";

import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";

import { categories } from "../constants/categories";

function Products() {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const {
        products,
        loading,
        error
    } = useSelector(
        (state) => state.products
    );

    const [searchTerm, setSearchTerm] =
        useState("");

    const [sort, setSort] =
        useState("default");

    const debouncedSearchTerm =
        useDebounce(searchTerm, 500);

    const productsPerPage = 6;

    const category =
        searchParams.get("category") || "all";

    const currentPage =
        Math.max(
            1,
            Number(searchParams.get("page")) || 1
        );

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const updateUrl = ({
        categoryValue = category,
        page = 1
    }) => {
        const params = {};

        if (categoryValue !== "all") {
            params.category = categoryValue;
        }

        params.page = String(page);

        setSearchParams(params);
    };

    const handleCategoryChange = (value) => {
        updateUrl({
            categoryValue: value,
            page: 1
        });
    };

    const handlePageChange = (page) => {
        updateUrl({
            categoryValue: category,
            page
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);

        updateUrl({
            categoryValue: category,
            page: 1
        });
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);

        updateUrl({
            categoryValue: category,
            page: 1
        });
    };

    const filteredProducts = products
        .filter((product) => {
            const productName =
                product.name || "";

            const productCategory =
                product.category || "";

            const matchesSearch =
                productName
                    .toLowerCase()
                    .includes(
                        debouncedSearchTerm.toLowerCase()
                    );

            const matchesCategory =
                category === "all" ||
                productCategory.toLowerCase() ===
                    category.toLowerCase();

            return (
                matchesSearch &&
                matchesCategory
            );
        })
        .sort((a, b) => {
            if (sort === "lowToHigh") {
                return (
                    Number(a.price) -
                    Number(b.price)
                );
            }

            if (sort === "highToLow") {
                return (
                    Number(b.price) -
                    Number(a.price)
                );
            }

            return 0;
        });

    const totalPages = Math.ceil(
        filteredProducts.length /
            productsPerPage
    );

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(
                currentPage,
                totalPages
            )
            : 1;

    const startIndex =
        (safeCurrentPage - 1) *
        productsPerPage;

    const currentProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );

    const clearFilters = () => {
        setSearchTerm("");
        setSort("default");

        setSearchParams({
            page: "1"
        });
    };

    if (loading) {
        return (
            <LoadingState
                message="Loading Products..."
            />
        );
    }

    if (error) {
        return (
            <ErrorMessage
                title="Unable to Load Products"
                message={error}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                <div className="mb-6">

                    <h1 className="text-2xl font-black sm:text-3xl">
                        Gaming Products
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Find the right gear for your gaming setup.
                    </p>

                </div>

                <div className="mb-7 grid gap-3 md:grid-cols-3">

                    <div className="relative md:col-span-1">

                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                        />

                    </div>

                    <select
                        value={category}
                        onChange={(event) =>
                            handleCategoryChange(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                    >

                        <option value="all">
                            All Categories
                        </option>

                        {categories.map(
                            (cat) => (
                                <option
                                    key={cat}
                                    value={cat}
                                >
                                    {cat}
                                </option>
                            )
                        )}

                    </select>

                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                    >

                        <option value="default">
                            Sort Products
                        </option>

                        <option value="lowToHigh">
                            Price: Low to High
                        </option>

                        <option value="highToLow">
                            Price: High to Low
                        </option>

                    </select>

                </div>

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-lg font-bold">
                        {category === "all"
                            ? "All Products"
                            : category}
                    </h2>

                    <span className="text-sm text-slate-500">
                        {filteredProducts.length} products
                    </span>

                </div>

                {currentProducts.length > 0 ? (

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {currentProducts.map(
                            (product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            )
                        )}

                    </div>

                ) : (

                    <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 px-6 text-center">

                        <div>

                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-2xl">
                                🔍
                            </div>

                            <h2 className="text-xl font-bold">
                                No products found
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your search or category.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                            >
                                Clear Filters
                            </button>

                        </div>

                    </div>

                )}

                {totalPages > 1 && (

                    <div className="mt-8 flex items-center justify-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage - 1
                                )
                            }
                            disabled={
                                safeCurrentPage === 1
                            }
                            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            ← Previous
                        </button>

                        <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold">

                            <span className="text-cyan-400">
                                {safeCurrentPage}
                            </span>

                            <span className="mx-2 text-slate-600">
                                /
                            </span>

                            <span className="text-slate-400">
                                {totalPages}
                            </span>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage + 1
                                )
                            }
                            disabled={
                                safeCurrentPage ===
                                totalPages
                            }
                            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Next →
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Products;