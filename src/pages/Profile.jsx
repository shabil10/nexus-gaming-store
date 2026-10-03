import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateUser } from "../redux/slices/authSlice";
import { updateUser as updateUserAPI } from "../services/userService";

function Profile() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: {
      fullName:
        user?.address?.fullName || "",
      address:
        user?.address?.address || "",
      city:
        user?.address?.city || "",
      pincode:
        user?.address?.pincode || ""
    }
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Please login first.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value
      }
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      address: {
        fullName:
          user.address?.fullName || "",
        address:
          user.address?.address || "",
        city:
          user.address?.city || "",
        pincode:
          user.address?.pincode || ""
      }
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        address: formData.address
      };

      const response =
        await updateUserAPI(
          user.id,
          updatedUser
        );

      dispatch(updateUser(response));

      setIsEditing(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            NEXUS Account
          </p>

          <h1 className="mt-1 text-3xl font-black">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your account information and shopping address.
          </p>
        </div>


        {/* PROFILE CARD */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          {/* ACCOUNT INFORMATION */}

          <div className="mb-8">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Account Information
              </h2>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  Edit Profile
                </button>
              )}

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-cyan-400"
                />
              </div>


              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-cyan-400"
                />
              </div>


              {/* USER ID */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  User ID
                </label>

                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </div>

            </div>

          </div>


          {/* SHOPPING ADDRESS */}

          <div className="border-t border-slate-800 pt-8">

            <h2 className="mb-5 text-xl font-bold">
              Shopping Address
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* FULL NAME */}

              <div className="sm:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.address.fullName
                  }
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-cyan-400"
                />

              </div>


              {/* ADDRESS */}

              <div className="sm:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address.address
                  }
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                  rows="3"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-cyan-400"
                />

              </div>


              {/* CITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={
                    formData.address.city
                  }
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="Enter city"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-cyan-400"
                />

              </div>


              {/* PINCODE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-400">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={
                    formData.address.pincode
                  }
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="Enter pincode"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-70 focus:border-cyan-400"
                />

              </div>

            </div>

          </div>


          {/* SAVE / CANCEL */}

          {isEditing && (

            <div className="mt-8 flex gap-3 border-t border-slate-800 pt-6">

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500"
              >
                Cancel
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;