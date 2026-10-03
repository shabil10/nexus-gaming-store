import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";
import { clearCart } from "../redux/slices/cartSlice";
import { clearWishlist } from "../redux/slices/wishlistSlice";

function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const orders = useSelector(
    (state) => state.orders.orders
  );

  const cartCount = cartItems.length;

  // Only count orders belonging to the logged-in user
  const userOrders = user
    ? orders.filter(
        (order) =>
          String(order.userId) === String(user.id)
      )
    : [];

  const handleLogout = () => {
    const state = store.getState();

    const currentUser = state.auth.user;

    if (currentUser?.id) {
      localStorage.setItem(
        `cart_${currentUser.id}`,
        JSON.stringify(state.cart.items)
      );

      localStorage.setItem(
        `wishlist_${currentUser.id}`,
        JSON.stringify(state.wishlist.items)
      );
    }

    dispatch(logout());

    dispatch(clearCart());

    dispatch(clearWishlist());

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) =>
    `relative px-3 py-2 text-sm font-medium transition ${
      isActive(path)
        ? "text-cyan-400"
        : "text-slate-300 hover:text-cyan-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white shadow-lg backdrop-blur-md">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}

        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center"
        >
          <span className="text-2xl font-black tracking-[0.18em] text-cyan-400 transition group-hover:text-cyan-300">
            NEXUS
          </span>
        </Link>


        {/* Desktop Navigation */}

        <div className="hidden items-center md:flex">

          {/* HOME */}

          <Link
            to="/"
            className={navLinkClass("/")}
          >
            Home

            {isActive("/") && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyan-400" />
            )}
          </Link>


          {/* PRODUCTS */}

          <Link
            to="/products"
            className={navLinkClass("/products")}
          >
            Products

            {isActive("/products") && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyan-400" />
            )}
          </Link>


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className={navLinkClass("/wishlist")}
          >
            <span className="mr-1">♡</span>
            Wishlist

            {wishlistItems.length > 0 && (
              <span className="ml-1.5 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                {wishlistItems.length}
              </span>
            )}

            {isActive("/wishlist") && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyan-400" />
            )}
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className={navLinkClass("/cart")}
          >
            <span className="mr-1">🛒</span>
            Cart

            {cartCount > 0 && (
              <span className="ml-1.5 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                {cartCount}
              </span>
            )}

            {isActive("/cart") && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyan-400" />
            )}
          </Link>


          {/* ORDERS */}

          {isAuthenticated && (
            <Link
              to="/orders"
              className={navLinkClass("/orders")}
            >
              <span className="mr-1">📦</span>
              Orders

              {userOrders.length > 0 && (
                <span className="ml-1.5 rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-200">
                  {userOrders.length}
                </span>
              )}

              {isActive("/orders") && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          )}

        </div>


        {/* Desktop User Section */}

        <div className="hidden items-center gap-3 md:flex">

          {isAuthenticated ? (

            <>

              {/* Profile Link */}

              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-cyan-400"
              >

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="max-w-28 truncate text-sm font-medium text-slate-300">
                  {user.name}
                </span>

              </Link>


              {/* Logout */}

              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-cyan-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Register
              </Link>

            </>

          )}

        </div>


        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-lg transition hover:border-cyan-400 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>


      {/* Mobile Menu */}

      {menuOpen && (

        <div className="border-t border-slate-800 bg-slate-900 md:hidden">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <div className="flex flex-col gap-1">


              {/* HOME */}

              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive("/")
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`}
              >
                🏠 Home
              </Link>


              {/* PRODUCTS */}

              <Link
                to="/products"
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive("/products")
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`}
              >
                🎮 Products
              </Link>


              {/* WISHLIST */}

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive("/wishlist")
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`}
              >

                <span>♡ Wishlist</span>

                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                  {wishlistItems.length}
                </span>

              </Link>


              {/* CART */}

              <Link
                to="/cart"
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive("/cart")
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }`}
              >

                <span>🛒 Cart</span>

                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                  {cartCount}
                </span>

              </Link>


              {/* ORDERS */}

              {isAuthenticated && (

                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive("/orders")
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                  }`}
                >

                  <span>📦 Orders</span>

                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                    {userOrders.length}
                  </span>

                </Link>

              )}


              <div className="my-3 border-t border-slate-800" />


              {/* USER */}

              {isAuthenticated ? (

                <>

                  <div className="flex items-center gap-3 px-4 py-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Account
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>

                </>

              ) : (

                <>

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-1 rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Create Account
                  </Link>

                </>

              )}

            </div>

          </div>

        </div>

      )}

    </nav>
  );
}

export default Navbar;