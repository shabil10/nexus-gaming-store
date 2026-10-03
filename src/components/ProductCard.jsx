import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { createSlug } from "../utils/slug";
import { productImages } from "../constants/productImages";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const image =
    productImages[product.id] ||
    product.image;

  const isInCart = cartItems.some(
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

  const handleAddToCart = () => {
    if (isInCart) {
      return;
    }

    if (product.stock <= 0) {
      return;
    }

    dispatch(
      addToCart({
        ...product,
        image
      })
    );
  };

  const handleAddToWishlist = () => {
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
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <Link
        to={`/products/${createSlug(product.name)}`}
      >
        <div className="h-40 overflow-hidden bg-slate-800 sm:h-44">

          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

        </div>
      </Link>

      <button
        type="button"
        onClick={handleAddToWishlist}
        disabled={isInWishlist}
        className={
          isInWishlist
            ? "absolute right-2.5 top-2.5 cursor-not-allowed rounded-full bg-slate-950/85 px-2.5 py-1.5 text-sm opacity-50"
            : "absolute right-2.5 top-2.5 rounded-full bg-slate-950/85 px-2.5 py-1.5 text-sm transition hover:scale-110"
        }
        title={
          isInWishlist
            ? "Already in Wishlist"
            : "Add to Wishlist"
        }
      >
        ❤️
      </button>

      <div className="p-3.5">

        <p className="mb-0.5 text-xs text-slate-500">
          {product.brand}
        </p>

        <Link
          to={`/products/${createSlug(product.name)}`}
        >
          <h2 className="mb-2 line-clamp-1 text-base font-semibold text-white transition hover:text-cyan-400">
            {product.name}
          </h2>
        </Link>

        <div className="mb-2">
          <p className="text-lg font-bold text-cyan-400">
            ₹{product.price}
          </p>
        </div>

        <p
          className={
            product.stock > 0
              ? "mb-3 text-xs text-green-400"
              : "mb-3 text-xs text-red-400"
          }
        >
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Out of Stock"}
        </p>

        {product.stock <= 0 ? (

          <button
            type="button"
            disabled
            className="mb-2 w-full cursor-not-allowed rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-400"
          >
            Out of Stock
          </button>

        ) : isInCart ? (

          <button
            type="button"
            disabled
            className="mb-2 w-full cursor-not-allowed rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-400"
          >
            ✓ Added to Cart
          </button>

        ) : (

          <button
            type="button"
            onClick={handleAddToCart}
            className="mb-2 w-full rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            🛒 Add to Cart
          </button>

        )}

        <Link
          to={`/products/${createSlug(product.name)}`}
          className="block w-full rounded-lg border border-slate-700 px-3 py-2 text-center text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;