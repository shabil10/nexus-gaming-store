import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAdminUserById } from "../../services/adminUserService";
import { getOrders } from "../../services/orderService";

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminUserById(id);

        setUser(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  useEffect(() => {
    async function fetchUserOrders() {
      try {
        setOrdersLoading(true);

        const allOrders = await getOrders();

        const userOrders = allOrders.filter(
          (order) =>
            String(order.userId) === String(id)
        );

        setOrders(userOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchUserOrders();
  }, [id]);

  const totalSpent = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
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

  const addresses = user?.addresses || [];

  const defaultAddress =
    addresses.find(
      (address) => address.isDefault === true
    ) ||
    addresses[0] ||
    user?.address ||
    null;

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
        <p className="text-slate-400">
          Loading user...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-xl font-semibold text-white">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/users")
          }
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Back to Users
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h2 className="text-xl font-semibold text-white">
          User Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          The requested user does not exist.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/users")
          }
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/admin/users")
            }
            className="mb-3 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Users
          </button>

          <h1 className="text-3xl font-bold text-white">
            User Details
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            View customer information and order history
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/users/${id}/edit`
            )
          }
          className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Edit User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="text-sm text-slate-400">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {orders.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="text-sm text-slate-400">
            Total Spent
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            ₹{totalSpent}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="text-sm text-slate-400">
            User ID
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            #{user.id}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Customer account information
            </p>
          </div>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                {user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </p>

              <p className="mt-1 break-all text-sm text-slate-300">
                {user.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Phone
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {user.phone || "Not provided"}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Address Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Customer delivery address
            </p>
          </div>

          <div className="mt-6 space-y-5">

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Full Name
              </p>

              <p className="mt-1 text-sm text-white">
                {defaultAddress?.fullName ||
                  "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Address
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                {defaultAddress?.address ||
                  "Not provided"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  City
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {defaultAddress?.city ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Pincode
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {defaultAddress?.pincode ||
                    "Not provided"}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Order History
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Orders placed by this customer
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
            <p className="text-xs text-slate-500">
              Total Orders
            </p>

            <p className="mt-1 text-lg font-bold text-cyan-400">
              {orders.length}
            </p>
          </div>

        </div>

        {ordersLoading && (
          <div className="p-10 text-center">
            <p className="text-slate-400">
              Loading orders...
            </p>
          </div>
        )}

        {!ordersLoading &&
          orders.length === 0 && (
            <div className="p-10 text-center">

              <h3 className="text-lg font-semibold text-white">
                No Orders
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                This user has not placed any orders yet.
              </p>

            </div>
          )}

        {!ordersLoading &&
          orders.length > 0 && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-left text-xs uppercase tracking-wider text-slate-500">

                    <th className="px-5 py-4">
                      Order ID
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

                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() =>
                        navigate(
                          `/admin/orders/${order.id}`
                        )
                      }
                      className="cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/40 last:border-0"
                    >

                      <td className="px-5 py-4 font-medium text-white">
                        #{order.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-white">
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
                  ))}

                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
}

export default AdminUserDetails;