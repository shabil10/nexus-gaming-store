import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} from "../redux/slices/cartSlice";

import {
  fetchProducts
} from "../redux/slices/productSlice";

import {
  createSlug
} from "../utils/slug";

import {
  productImages
} from "../constants/productImages";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const products = useSelector(
    (state) => state.products.products
  );

  const productsLoading = useSelector(
    (state) => state.products.loading
  );

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [
    dispatch,
    products.length
  ]);

  const activeCartItems =
    cartItems.filter((item) => {
      const product = products.find(
        (product) =>
          String(product.id) ===
          String(item.id)
      );

      return product;
    });

  const unavailableCartItems =
    cartItems.filter((item) => {
      const product = products.find(
        (product) =>
          String(product.id) ===
          String(item.id)
      );

      return (
        !product ||
        product.isDeleted === true
      );
    });

  const subtotal =
    activeCartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

  const shipping =
    subtotal >= 5000 ? 0 : 100;

  const total =
    subtotal + shipping;

  const handleRemoveUnavailable =
    (id) => {
      dispatch(
        removeFromCart(id)
      );
    };

  if (
    productsLoading &&
    products.length === 0
  ) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <div className="text-4xl">
            ⏳
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Checking your cart...
          </p>
        </div>
      </div>
    );
  }

  if (
    cartItems.length === 0
  ) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-4xl">
            🛒
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            NEXUS Cart
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Your gaming setup is waiting. Browse our collection and find something you like.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-block rounded-lg bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Start Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            NEXUS Cart
          </p>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Review your gaming gear before checkout.
              </p>
            </div>

            <div className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2">
              <p className="text-xs text-slate-400">
                <span className="font-bold text-cyan-400">
                  {activeCartItems.length}
                </span>{" "}
                {activeCartItems.length === 1
                  ? "item"
                  : "items"}
              </p>
            </div>
          </div>
        </section>

        {unavailableCartItems.length >
          0 && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-red-400">
                  Some products are no longer available.
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  These products were removed from the store and cannot be purchased.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {unavailableCartItems.map(
                  (item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleRemoveUnavailable(
                          item.id
                        )
                      }
                      className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                    >
                      Remove {item.name}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-7 lg:grid-cols-[1fr_360px]">

          <section className="space-y-4">

            {activeCartItems.map(
              (item) => {
                const image =
                  productImages[
                    item.id
                  ] || item.image;

                const currentProduct =
                  products.find(
                    (product) =>
                      String(
                        product.id
                      ) ===
                      String(item.id)
                  );

                const currentStock =
                  Number(
                    currentProduct?.stock ??
                      item.stock
                  );

                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:border-slate-700 hover:shadow-xl"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col gap-5 sm:flex-row">

                        <Link
                          to={`/products/${createSlug(
                            item.name
                          )}`}
                          className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-32 sm:w-32"
                        >
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              {item.brand}
                            </p>

                            <Link
                              to={`/products/${createSlug(
                                item.name
                              )}`}
                            >
                              <h2 className="mt-1 text-base font-bold text-white transition hover:text-cyan-400 sm:text-lg">
                                {item.name}
                              </h2>
                            </Link>

                            <p className="mt-2 text-lg font-bold text-cyan-400">
                              ₹{item.price}
                            </p>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-4">

                            <div className="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950">

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    decreaseQuantity(
                                      item.id
                                    )
                                  )
                                }
                                disabled={
                                  item.quantity ===
                                  1
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                −
                              </button>

                              <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-700 px-2 text-sm font-bold">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    increaseQuantity(
                                      item.id
                                    )
                                  )
                                }
                                disabled={
                                  item.quantity >=
                                  currentStock
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                +
                              </button>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  removeFromCart(
                                    item.id
                                  )
                                )
                              }
                              className="text-xs font-semibold text-red-400 transition hover:text-red-300"
                            >
                              Remove
                            </button>

                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 sm:border-0 sm:pt-0 sm:text-right">
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Item Total
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            ₹
                            {Number(
                              item.price
                            ) *
                              Number(
                                item.quantity
                              )}
                          </p>
                        </div>

                      </div>

                      <div className="mt-4 border-t border-slate-800 pt-3">
                        <p className="text-xs text-slate-500">
                          {item.quantity <
                          currentStock
                            ? `${
                                currentStock -
                                item.quantity
                              } more available`
                            : "Maximum available quantity selected"}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              }
            )}

          </section>

          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6 lg:sticky lg:top-24">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <span className="text-xl">
                🧾
              </span>
            </div>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  Subtotal
                </span>

                <span className="text-slate-200">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  Shipping
                </span>

                <span
                  className={
                    shipping === 0
                      ? "font-semibold text-green-400"
                      : "text-slate-200"
                  }
                >
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-black text-cyan-400">
                    ₹{total}
                  </span>
                </div>
              </div>

            </div>

            {subtotal < 5000 ? (
              <div className="mt-5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-3">
                <p className="text-xs leading-5 text-cyan-400">
                  🚚 Add{" "}
                  <span className="font-bold">
                    ₹{5000 - subtotal}
                  </span>{" "}
                  more to unlock free shipping.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-green-500/10 bg-green-500/5 p-3">
                <p className="text-xs font-semibold text-green-400">
                  ✓ You've unlocked free shipping!
                </p>
              </div>
            )}

            {activeCartItems.length >
              0 ? (
              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-lg bg-cyan-500 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Proceed to Checkout →
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 block w-full cursor-not-allowed rounded-lg bg-slate-700 px-5 py-3 text-center text-sm font-bold text-slate-500"
              >
                No Products Available
              </button>
            )}

            <Link
              to="/products"
              className="mt-3 block w-full rounded-lg border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              ← Continue Shopping
            </Link>

          </aside>

        </div>
      </div>
    </div>
  );
}

export default Cart;