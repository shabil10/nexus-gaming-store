import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchOrders,
  cancelOrder
} from "../redux/slices/orderSlice";

import { productImages } from "../constants/productImages";

function Orders() {
  const dispatch = useDispatch();

  const {
    orders,
    loading,
    error
  } = useSelector(
    (state) => state.orders
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const userOrders = user
    ? orders.filter(
        (order) =>
          String(order.userId) ===
          String(user.id)
      )
    : [];

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        cancelOrder(orderId)
      ).unwrap();
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );

      alert(
        "Failed to cancel the order. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-3 text-xs text-slate-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-3xl">
            📦
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            NEXUS ORDERS
          </p>

          <h1 className="mt-2 text-2xl font-black">
            No Orders Yet
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-block rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Start Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              NEXUS ORDERS
            </p>

            <h1 className="mt-1 text-2xl font-black">
              My Orders
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              View your previous purchases.
            </p>
          </div>

          <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
            <span className="text-xs text-slate-400">
              <span className="font-bold text-cyan-400">
                {userOrders.length}
              </span>{" "}
              {userOrders.length === 1
                ? "order"
                : "orders"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {userOrders.map((order) => {
            const orderDate = new Date(
              order.orderDate
            );

            const isCancelled =
              order.status === "Cancelled";

            const isDelivered =
              order.status === "Delivered";

            const canCancel =
              !isCancelled &&
              !isDelivered;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md"
              >

                <div className="border-b border-slate-800 px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold text-white">
                          Order #{order.id}
                        </p>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            order.status === "Delivered"
                              ? "bg-green-500/10 text-green-400"
                              : order.status === "Cancelled"
                                ? "bg-red-500/10 text-red-400"
                                : order.status === "Shipped"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : order.status === "Processing"
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {orderDate.toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }
                        )}{" "}
                        •{" "}
                        {orderDate.toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-black text-cyan-400">
                        ₹{order.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4">

                  <div className="mb-4 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">
                        Shipping Address
                      </p>

                      <div className="mt-2 space-y-0.5 text-xs text-slate-400">
                        <p className="font-semibold text-white">
                          {order.customer?.fullName}
                        </p>

                        <p>
                          {order.customer?.address}
                        </p>

                        <p>
                          {order.customer?.city} -{" "}
                          {order.customer?.pincode}
                        </p>

                        <p className="text-slate-500">
                          {order.customer?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">
                        Payment
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {order.payment}
                      </p>
                    </div>

                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Order Items
                    </p>

                    <div className="space-y-2">
                      {order.items?.map((item) => {
                        const image =
                          productImages[item.id] ||
                          item.image;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-2.5"
                          >
                            <img
                              src={image}
                              alt={item.name}
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] text-slate-500">
                                {item.brand}
                              </p>

                              <h2 className="truncate text-xs font-bold text-white">
                                {item.name}
                              </h2>

                              <p className="mt-0.5 text-[10px] text-slate-500">
                                ₹{item.price} ×{" "}
                                {item.quantity}
                              </p>
                            </div>

                            <p className="shrink-0 text-xs font-bold text-cyan-400">
                              ₹
                              {item.price *
                                item.quantity}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-800 pt-3">
                    <div className="ml-auto max-w-xs space-y-2">

                      <div className="flex justify-between text-xs text-slate-500">
                        <span>
                          Subtotal
                        </span>

                        <span className="text-slate-300">
                          ₹{order.subtotal}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-slate-500">
                        <span>
                          Shipping
                        </span>

                        <span className="text-slate-300">
                          {order.shipping === 0
                            ? "FREE"
                            : `₹${order.shipping}`}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-slate-800 pt-2">
                        <span className="text-sm font-bold">
                          Total
                        </span>

                        <span className="text-lg font-black text-cyan-400">
                          ₹{order.total}
                        </span>
                      </div>

                    </div>
                  </div>

                  {canCancel && (
                    <div className="mt-4 flex justify-end border-t border-slate-800 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleCancelOrder(
                            order.id
                          )
                        }
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="mt-4 flex justify-end border-t border-slate-800 pt-3">
                      <span className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400">
                        Order Cancelled
                      </span>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Orders;