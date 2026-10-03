import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchOrders } from "../../redux/slices/orderSlice";

function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] =
    useState("all");

  const {
    orders,
    loading,
    error
  } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.status === statusFilter
        );

  const getStatusClass = (status) => {
    if (status === "Delivered") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "Cancelled") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    if (status === "Shipped") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    if (status === "Processing") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage and track customer orders
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-xs text-slate-500">
            Total Orders
          </p>

          <p className="mt-1 text-lg font-bold text-cyan-400">
            {orders.length}
          </p>
        </div>

      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-white">
              Filter Orders
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Filter orders by their current status
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 sm:w-56"
          >
            <option value="all">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </div>

      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-slate-400">
            Loading orders...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

            <h2 className="text-xl font-semibold text-white">
              No Orders
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              There are no customer orders yet.
            </p>

          </div>
        )}

      {!loading &&
        !error &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

            <h2 className="text-xl font-semibold text-white">
              No Matching Orders
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              No orders match the selected status.
            </p>

          </div>
        )}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg">

            <div className="border-b border-slate-800 p-5">

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Order List
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {filteredOrders.length} order
                    {filteredOrders.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>

                {statusFilter !== "all" && (
                  <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                    {statusFilter}
                  </span>
                )}

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-left text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-5 py-4">
                      Order ID
                    </th>

                    <th className="px-5 py-4">
                      User ID
                    </th>

                    <th className="px-5 py-4">
                      Coupon
                    </th>

                    <th className="px-5 py-4">
                      Discount
                    </th>

                    <th className="px-5 py-4">
                      Total
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Date
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order.id}`
                          )
                        }
                        className="cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/40 last:border-0"
                      >

                        <td className="px-5 py-4">

                          <span className="font-semibold text-white">
                            #{order.id}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                            #{order.userId}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          {order.coupon?.code ? (
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                              {order.coupon.code}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600">
                              No coupon
                            </span>
                          )}

                        </td>

                        <td className="px-5 py-4 font-semibold text-green-400">
                          {Number(order.discount || 0) > 0
                            ? `-₹${order.discount}`
                            : "₹0"}
                        </td>

                        <td className="px-5 py-4 font-semibold text-white">
                          ₹{order.total}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {order.orderDate
                            ? new Date(
                                order.orderDate
                              ).toLocaleDateString()
                            : "Not available"}
                        </td>

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              navigate(
                                `/admin/orders/${order.id}`
                              );
                            }}
                            className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
}

export default AdminOrders;
