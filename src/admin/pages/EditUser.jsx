import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchUsers,
  editUser
} from "../../redux/slices/userSlice";

function UserEditForm({ user, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    fullName: user.address?.fullName || "",
    address: user.address?.address || "",
    city: user.address?.city || "",
    pincode: user.address?.pincode || ""
  }));

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setError("");
    setSaving(true);

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: {
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim()
      }
    };

    try {
      await dispatch(
        editUser({
          id,
          userData
        })
      ).unwrap();

      alert("User updated successfully");

      navigate(`/admin/users/${id}`);
    } catch (error) {
      console.error(error);
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/users/${id}`)
          }
          className="mb-3 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to User
        </button>

        <h1 className="text-3xl font-bold text-white">
          Edit User
        </h1>

        <p className="mt-1 text-slate-400">
          Update customer information and address
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Update the customer's basic details
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label
                htmlFor="name"
                className={labelClass}
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={labelClass}
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="phone"
                className={labelClass}
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-semibold text-white">
              Address Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Update the customer's delivery address
            </p>
          </div>

          <div className="mt-6 space-y-5">

            <div>
              <label
                htmlFor="fullName"
                className={labelClass}
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className={labelClass}
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                rows="4"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label
                  htmlFor="city"
                  className={labelClass}
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className={labelClass}
                >
                  Pincode
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

            </div>

          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(`/admin/users/${id}`)
            }
            className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Updating..."
              : "Update User"}
          </button>

        </div>

      </form>
    </div>
  );
}

function EditUser() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    users,
    loading
  } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const user = users.find(
    (item) =>
      String(item.id) === String(id)
  );

  if (loading && !user) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-400">
          Loading user...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">
          User Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          The requested user does not exist.
        </p>

        <button
          onClick={() =>
            window.history.back()
          }
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <UserEditForm
      key={user.id}
      user={user}
      id={id}
    />
  );
}

export default EditUser;