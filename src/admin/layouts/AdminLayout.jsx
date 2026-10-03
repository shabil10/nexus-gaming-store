import {
  Link,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { logout } from "../../redux/slices/adminAuthSlice";
import { showToast } from "../../redux/slices/toastSlice";

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const handleLogout = () => {
    dispatch(logout());

    dispatch(
      showToast({
        message: "Admin logged out successfully",
        type: "success"
      })
    );

    navigate("/admin/login");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">

      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-800 bg-slate-900">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setSidebarOpen((previous) => !previous)
              }
              className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
            >
              ☰
            </button>

            <Link
              to="/admin"
              onClick={closeSidebar}
              className="text-lg font-bold tracking-wide text-cyan-400 sm:text-xl"
            >
              NEXUS Admin
            </Link>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 sm:px-4 sm:text-sm"
          >
            Logout
          </button>

        </div>
      </header>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-slate-800 bg-slate-900 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="flex flex-col gap-2 p-4">

          <Link
            to="/admin"
            onClick={closeSidebar}
            className={`rounded-lg px-4 py-3 transition ${
              isActive("/admin")
                ? "bg-cyan-500 font-semibold text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            onClick={closeSidebar}
            className={`rounded-lg px-4 py-3 transition ${
              isActive("/admin/products")
                ? "bg-cyan-500 font-semibold text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            Products
          </Link>

          <Link
            to="/admin/users"
            onClick={closeSidebar}
            className={`rounded-lg px-4 py-3 transition ${
              isActive("/admin/users")
                ? "bg-cyan-500 font-semibold text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            Users
          </Link>

          <Link
            to="/admin/orders"
            onClick={closeSidebar}
            className={`rounded-lg px-4 py-3 transition ${
              isActive("/admin/orders")
                ? "bg-cyan-500 font-semibold text-slate-950"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            Orders
          </Link>

        </nav>
      </aside>

      <main className="ml-0 h-screen overflow-y-auto pt-16 lg:ml-64">

        <div className="w-full px-4 py-4 sm:px-6 sm:py-5">

          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminLayout;