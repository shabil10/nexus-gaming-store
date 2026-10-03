import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setDashboardData,
  setDashboardLoading,
  setDashboardError
} from "../../redux/slices/adminDashboardSlice";

import { getDashboardData } from "../../services/adminDashboardService";

function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    productsCount,
    usersCount,
    ordersCount,
    revenue,
    lowStockProducts,
    recentOrders,
    loading,
    error
  } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        dispatch(
          setDashboardLoading(true)
        );

        const data =
          await getDashboardData();

        dispatch(
          setDashboardData(data)
        );
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        dispatch(
          setDashboardError(
            "Failed to load dashboard data"
          )
        );
      }
    }

    fetchDashboardData();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-400">
          Welcome to the NEXUS admin panel
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Loading dashboard...
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Total Products
          </p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-400">
            {productsCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Total Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-400">
            {usersCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Total Orders
          </p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-400">
            {ordersCount}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Total Revenue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            ₹{revenue}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-xl font-semibold">
              Low Stock Products
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Products with 5 or fewer items
            </p>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="p-5 text-slate-400">
              No low stock products.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                    <th className="px-5 py-3">
                      Product
                    </th>

                    <th className="px-5 py-3">
                      Stock
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-800 last:border-0"
                      >
                        <td className="px-5 py-4">
                          {product.name}
                        </td>

                        <td className="px-5 py-4 font-semibold text-red-400">
                          {product.stock}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="text-xl font-semibold">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest customer orders
            </p>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-5 text-slate-400">
              No recent orders.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                    <th className="px-5 py-3">
                      Order
                    </th>

                    <th className="px-5 py-3">
                      Total
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b border-slate-800 last:border-0"
                      >
                        <td className="px-5 py-4">
                          #{order.id}
                        </td>

                        <td className="px-5 py-4">
                          ₹{order.total}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;