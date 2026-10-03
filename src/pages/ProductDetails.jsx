import { useEffect, useState } from "react";

import {
  Link,
  useParams,
  useNavigate
} from "react-router-dom";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  productImages
} from "../constants/productImages";

import {
  createSlug
} from "../utils/slug";

import {
  addToCart
} from "../redux/slices/cartSlice";

import {
  addToWishlist
} from "../redux/slices/wishlistSlice";

import {
  fetchProducts
} from "../redux/slices/productSlice";

import LoadingState from "../components/LoadingState";

import ErrorMessage from "../components/ErrorMessage";

function ProductDetails() {
  const [
    quantity,
    setQuantity
  ] = useState(1);

  const {
    slug
  } = useParams();

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    products,
    loading,
    error
  } = useSelector(
    (state) =>
      state.products
  );

  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
    );

  const wishlistItems =
    useSelector(
      (state) =>
        state.wishlist.items
    );

  useEffect(() => {
    if (
      products.length === 0
    ) {
      dispatch(
        fetchProducts()
      );
    }
  }, [
    dispatch,
    products.length
  ]);

  if (loading) {
    return (
      <LoadingState
        message="Loading Product..."
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to Load Product"
        message={error}
      />
    );
  }

  const product =
    products.find(
      (product) =>
        createSlug(
          product.name
        ) === slug
    );

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">
            🔍
          </div>

          <h1 className="text-2xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            The product you're looking for doesn't exist or is no longer available.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (
    product.isDeleted === true
  ) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">
            🚫
          </div>

          <h1 className="text-2xl font-bold">
            Product Not Available
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            This product is no longer available in our store.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const image =
    productImages[
      product.id
    ] || product.image;

  const isInCart =
    cartItems.some(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

  const isInWishlist =
    wishlistItems.some(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

  const handleAddToCart =
    () => {
      if (
        product.isDeleted === true
      ) {
        return;
      }

      if (isInCart) {
        return;
      }

      if (
        product.stock <= 0
      ) {
        return;
      }

      dispatch(
        addToCart({
          ...product,
          image
        })
      );
    };

  const handleBuyNow =
    () => {
      if (
        product.isDeleted === true
      ) {
        return;
      }

      if (
        product.stock <= 0
      ) {
        return;
      }

      const productWithImage =
        {
          ...product,
          image
        };

      for (
        let i = 0;
        i < quantity;
        i++
      ) {
        dispatch(
          addToCart(
            productWithImage
          )
        );
      }

      navigate(
        "/checkout"
      );
    };

  const handleAddToWishlist =
    () => {
      if (
        product.isDeleted === true
      ) {
        return;
      }

      if (isInWishlist) {
        return;
      }

      dispatch(
        addToWishlist({
          ...product,
          image
        })
      );
    };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl flex-col">

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">

          <Link
            to="/"
            className="transition hover:text-cyan-400"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            to="/products"
            className="transition hover:text-cyan-400"
          >
            Products
          </Link>

          <span>›</span>

          <span className="max-w-[220px] truncate text-slate-300">
            {product.name}
          </span>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-5 flex w-fit items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-400"
        >
          ← Back
        </button>

        <div className="grid flex-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">

          <div className="flex h-full items-center justify-center">

            <div className="group relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900 shadow-2xl shadow-cyan-500/10">

              <div className="relative aspect-[4/3] overflow-hidden">

                <img
                  src={image}
                  alt={product.name}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

                <div className="absolute left-4 top-4">

                  {product.stock >
                  0 ? (

                    <span className="rounded-full bg-green-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      ✓ In Stock
                    </span>

                  ) : (

                    <span className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      Out of Stock
                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>

          <div className="flex flex-col justify-center py-2">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              {product.brand}
            </p>

            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4">

              <p className="text-xs text-slate-500">
                Price
              </p>

              <p className="mt-0.5 text-3xl font-black text-cyan-400 sm:text-4xl">
                ₹{product.price}
              </p>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                🎮 {product.category}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                🏷️ {product.brand}
              </span>

            </div>

            <div className="mt-4 border-t border-slate-800 pt-4">

              <h2 className="text-base font-bold">
                Product Description
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                {product.description}
              </p>

            </div>

            {product.stock >
            0 ? (

              <div className="mt-4 border-t border-slate-800 pt-4">

                <div className="mb-3 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    Availability
                  </span>

                  <span className="text-sm font-semibold text-green-400">
                    {product.stock} units available
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-sm font-medium text-slate-300">
                    Quantity
                  </p>

                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-900">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          Math.max(
                            1,
                            quantity - 1
                          )
                        )
                      }
                      disabled={
                        quantity ===
                        1
                      }
                      className="px-4 py-2 text-lg font-bold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-12 border-x border-slate-700 px-3 py-2 text-center font-bold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            product.stock,
                            quantity + 1
                          )
                        )
                      }
                      disabled={
                        quantity ===
                        product.stock
                      }
                      className="px-4 py-2 text-lg font-bold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

                  {isInCart ? (

                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-xl bg-slate-700 px-4 py-3 text-sm font-bold text-slate-400"
                    >
                      ✓ Added to Cart
                    </button>

                  ) : (

                    <button
                      type="button"
                      onClick={
                        handleAddToCart
                      }
                      className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      🛒 Add to Cart
                    </button>

                  )}

                  <button
                    type="button"
                    onClick={
                      handleBuyNow
                    }
                    className="rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20"
                  >
                    ⚡ Buy Now
                  </button>

                  {isInWishlist ? (

                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-500"
                    >
                      ✓ In Wishlist
                    </button>

                  ) : (

                    <button
                      type="button"
                      onClick={
                        handleAddToWishlist
                      }
                      className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold transition hover:border-cyan-400 hover:bg-cyan-400/5 hover:text-cyan-400"
                    >
                      ❤️ Wishlist
                    </button>

                  )}

                </div>

              </div>

            ) : (

              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">

                <p className="font-bold text-red-400">
                  ❌ This product is currently out of stock.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please check back later.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;