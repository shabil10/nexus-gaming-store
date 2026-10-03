import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import { categories } from "../constants/categories";

function Home() {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error
  } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const recentProducts =
    products.slice(0, 4);

  const featuredCategories =
    categories;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-white">

      <section className="relative overflow-hidden border-b border-slate-800">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                NEXUS GAMING STORE
              </p>

              <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Build Your
                <span className="text-cyan-400">
                  {" "}Ultimate Setup
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Discover gaming gear, accessories and
                gaming essentials designed to improve
                your gaming experience.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to="/products"
                  className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  Shop Now →
                </Link>

                <Link
                  to="/products"
                  className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Explore Products
                </Link>

              </div>

              <div className="mt-8 flex items-center gap-6">

                <div>

                  <p className="text-xl font-bold sm:text-2xl">
                    {products.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Gaming Products
                  </p>

                </div>

                <div className="border-l border-slate-800 pl-6">

                  <p className="text-xl font-bold sm:text-2xl">
                    {categories.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Categories
                  </p>

                </div>

              </div>

            </div>

            <div className="hidden lg:block">

              <div className="relative mx-auto flex h-[400px] max-w-lg items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

                <div className="absolute h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative text-center">

                  <div className="text-8xl">
                    🎮
                  </div>

                  <h2 className="mt-5 text-2xl font-black">
                    NEXUS
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Gaming Store
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="mb-5 flex items-end justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Browse
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Shop by Category
            </h2>

          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            View All →
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {featuredCategories.map(
            (category) => (

              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group rounded-xl border border-slate-800 bg-slate-900 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-2xl transition group-hover:scale-110">
                  🎮
                </div>

                <h3 className="mt-3 line-clamp-1 text-sm font-bold text-white transition group-hover:text-cyan-400">
                  {category}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Explore →
                </p>

              </Link>

            )
          )}

        </div>

      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="mb-5 flex items-end justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Latest
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Recently Added Products
            </h2>

          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            View All →
          </Link>

        </div>

        {loading && (
          <LoadingState />
        )}

        {!loading && error && (
          <ErrorMessage
            message={error}
          />
        )}

        {!loading &&
          !error &&
          products.length === 0 && (

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

              <p className="text-sm text-slate-500">
                No products available.
              </p>

            </div>

          )}

        {!loading &&
          !error &&
          recentProducts.length > 0 && (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {recentProducts.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                )
              )}

            </div>

          )}

      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center sm:p-10">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Ready to upgrade?
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Find Your Perfect Gaming Gear
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Explore our complete collection of gaming
            products and build your ultimate setup.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-block rounded-lg bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Browse All Products →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;