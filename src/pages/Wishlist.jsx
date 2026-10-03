import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";

import { createSlug } from "../utils/slug";
import { productImages } from "../constants/productImages";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 text-white">

        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-3xl">
            ❤️
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Your Wishlist is Empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Save your favorite gaming products here.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-block rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Explore Products →
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              NEXUS Wishlist
            </p>

            <h1 className="mt-1 text-2xl font-black">
              My Wishlist
            </h1>

          </div>

          <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">

            <span className="text-xs text-slate-400">

              <span className="font-bold text-cyan-400">
                {wishlistItems.length}
              </span>{" "}

              {wishlistItems.length === 1
                ? "item"
                : "items"}

            </span>

          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {wishlistItems.map((product) => {

            const image =
              productImages[product.id] ||
              product.image;

            const productUrl =
              `/products/${createSlug(product.name)}`;

            const isOutOfStock =
              Number(product.stock) <= 0;

            const isInCart =
              cartItems.some(
                (item) =>
                  String(item.id) ===
                  String(product.id)
              );

            return (
              <div
                key={product.id}
                className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <Link to={productUrl}>

                  <div className="relative h-40 overflow-hidden bg-slate-800 sm:h-44">

                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute right-2.5 top-2.5 rounded-full bg-slate-950/85 px-2.5 py-1.5 text-sm">
                      ❤️
                    </div>

                  </div>

                </Link>

                <div className="p-3.5">

                  <p className="text-xs text-slate-500">
                    {product.brand}
                  </p>

                  <Link to={productUrl}>

                    <h2 className="mt-0.5 line-clamp-1 text-base font-bold text-white transition hover:text-cyan-400">
                      {product.name}
                    </h2>

                  </Link>

                  <div className="mt-2">

                    <p className="text-lg font-black text-cyan-400">
                      ₹{product.price}
                    </p>

                  </div>

                  <div className="mt-2">

                    {isOutOfStock ? (

                      <span className="inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                        Out of Stock
                      </span>

                    ) : (

                      <span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                        ✓ {product.stock} in stock
                      </span>

                    )}

                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          addToCart({
                            ...product,
                            image
                          })
                        )
                      }
                      disabled={
                        isOutOfStock ||
                        isInCart
                      }
                      className={
                        isOutOfStock ||
                        isInCart
                          ? "cursor-not-allowed rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-500"
                          : "rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
                      }
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : isInCart
                          ? "✓ Added to Cart"
                          : "🛒 Add to Cart"}
                    </button>

                    <Link
                      to={productUrl}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          removeFromWishlist(
                            product.id
                          )
                        )
                      }
                      className="col-span-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
                    >
                      Remove from Wishlist
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Wishlist;