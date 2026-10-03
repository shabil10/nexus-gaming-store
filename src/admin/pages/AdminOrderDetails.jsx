import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  editOrderStatus
} from "../../redux/slices/orderSlice";

import { getOrders } from "../../services/orderService";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        setError("");

        const orders = await getOrders();

        const foundOrder = orders.find(
          (item) =>
            String(item.id) === String(id)
        );

        if (!foundOrder) {
          setError("Order not found");
          return;
        }

        setOrder(foundOrder);
        setStatus(foundOrder.status || "Pending");
      } catch (error) {
        console.error(error);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || !status) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedOrder =
        await dispatch(
          editOrderStatus({
            id: order.id,
            status
          })
        ).unwrap();

      setOrder(updatedOrder);

      setSuccess(
        "Order status updated successfully"
      );
    } catch (error) {
      console.error(error);
      setError(
        "Failed to update order status"
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (orderStatus) => {
    if (orderStatus === "Delivered") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (orderStatus === "Cancelled") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (orderStatus === "Shipped") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }

    if (orderStatus === "Processing") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-400">
          Loading order...
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-xl font-semibold text-white">
          Order Not Found
        </h2>

        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/orders")
          }
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const customer =
    order.customer || {};

  const items =
    order.items || [];

  const discount =
    Number(order.discount || 0);

  const coupon =
    order.coupon || null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 pb-8">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
            className="mb-3 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Orders
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Order #{order.id}
            </h1>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            View complete order information
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Order Date
          </p>

          <p className="mt-1 text-sm font-medium text-white">
            {order.orderDate
              ? new Date(
                  order.orderDate
                ).toLocaleString()
              : "Not available"}
          </p>
        </div>

      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">
            {success}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-semibold text-white">
              Order Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Basic information about this order
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Order ID
              </p>

              <p className="mt-1 font-medium text-white">
                #{order.id}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                User ID
              </p>

              <p className="mt-1 font-medium text-white">
                #{order.userId}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Payment Method
              </p>

              <p className="mt-1 font-medium capitalize text-white">
                {order.payment || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Status
              </p>

              <span
                className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-semibold text-white">
              Update Status
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Change the current order status
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">

            <div className="flex-1">
              <label
                htmlFor="orderStatus"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Order Status
              </label>

              <select
                id="orderStatus"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              >
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

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={
                saving ||
                status === order.status
              }
              className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Updating..."
                : "Update Status"}
            </button>

          </div>

        </div>

      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-semibold text-white">
            Customer Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Customer details and delivery address
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Name
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {customer.fullName ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Phone
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {customer.phone ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              City
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {customer.city ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Pincode
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {customer.pincode ||
                "Not provided"}
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Address
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-300">
              {customer.address ||
                "Not provided"}
            </p>
          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 p-5">
          <h2 className="text-xl font-semibold text-white">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Products included in this order
          </p>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">
              No products found in this order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Price
                  </th>

                  <th className="px-5 py-4">
                    Quantity
                  </th>

                  <th className="px-5 py-4 text-right">
                    Total
                  </th>

                </tr>
              </thead>

              <tbody>
                {items.map(
                  (item, index) => {
                    const price =
                      Number(
                        item.price || 0
                      );

                    const quantity =
                      Number(
                        item.quantity || 0
                      );

                    const itemTotal =
                      price * quantity;

                    return (
                      <tr
                        key={`${item.id}-${index}`}
                        className="border-b border-slate-800 transition hover:bg-slate-800/40 last:border-0"
                      >

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg border border-slate-700 object-cover"
                              />
                            )}

                            <div>
                              <p className="font-medium text-white">
                                {item.name}
                              </p>

                              {item.category && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {item.category}
                                </p>
                              )}
                            </div>

                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium text-white">
                          ₹{price}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {quantity}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold text-white">
                          ₹{itemTotal}
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>
          </div>
        )}

      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Payment Summary
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Complete breakdown of this order
            </p>
          </div>

          <div className="w-fit rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="text-sm font-semibold text-green-400">
              {order.payment || "Payment"}
            </span>
          </div>

        </div>

        <div className="mt-5 space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Subtotal
            </span>

            <span className="text-sm font-medium text-white">
              ₹{order.subtotal || 0}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Shipping
            </span>

            <span className="text-sm font-medium text-white">
              ₹{order.shipping || 0}
            </span>
          </div>

          {coupon && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-400">
                    Coupon Applied
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Code: {coupon.code}
                  </p>
                </div>

                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                  {coupon.type === "percentage"
                    ? `${coupon.value}% OFF`
                    : `₹${coupon.value} OFF`}
                </span>
              </div>
            </div>
          )}

          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Coupon Discount
              </span>

              <span className="text-sm font-semibold text-green-400">
                -₹{discount}
              </span>
            </div>
          )}

          <div className="border-t border-slate-800 pt-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-lg font-semibold text-white">
                  Total
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Final order amount
                </p>
              </div>

              <p className="text-2xl font-bold text-cyan-400">
                ₹{order.total || 0}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminOrderDetails;