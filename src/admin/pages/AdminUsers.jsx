import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

import {
    fetchUsers,
    softDeleteUser,
    restoreUser
} from "../../redux/slices/userSlice";

function AdminUsers() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [deleteUser, setDeleteUser] =
        useState(null);

    const [restoreUserData, setRestoreUserData] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [userView, setUserView] =
        useState("active");

    const debouncedSearchTerm =
        useDebounce(searchTerm, 500);

    const {
        users,
        loading,
        error
    } = useSelector(
        (state) => state.users
    );

    useEffect(() => {
        if (users.length === 0) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users.length]);

    const filteredUsers = users
        .filter((user) => {
            if (userView === "active") {
                return user.isDeleted !== true;
            }

            return user.isDeleted === true;
        })
        .filter((user) => {
            const search =
                debouncedSearchTerm.toLowerCase();

            return (
                user.name
                    ?.toLowerCase()
                    .includes(search) ||
                user.email
                    ?.toLowerCase()
                    .includes(search)
            );
        });

    const handleDelete = async () => {
        if (!deleteUser) {
            return;
        }

        try {
            await dispatch(
                softDeleteUser(deleteUser.id)
            ).unwrap();

            setDeleteUser(null);
        } catch (error) {
            console.error(
                "Failed to delete user:",
                error
            );
        }
    };

    const handleRestore = async () => {
        if (!restoreUserData) {
            return;
        }

        try {
            await dispatch(
                restoreUser(restoreUserData.id)
            ).unwrap();

            setRestoreUserData(null);
        } catch (error) {
            console.error(
                "Failed to restore user:",
                error
            );
        }
    };

    return (
        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold text-white">
                    Users
                </h1>

                <p className="mt-1 text-slate-400">
                    Manage registered customers
                </p>

            </div>

            <div className="flex flex-wrap gap-2">

                <button
                    type="button"
                    onClick={() =>
                        setUserView("active")
                    }
                    className={
                        userView === "active"
                            ? "rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                            : "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300"
                    }
                >
                    Active Users
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setUserView("deleted")
                    }
                    className={
                        userView === "deleted"
                            ? "rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                            : "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300"
                    }
                >
                    Deleted Users
                </button>

            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="w-full sm:max-w-md">

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />

                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">

                    {userView === "active"
                        ? "Active Users"
                        : "Deleted Users"}

                    :{" "}

                    <span className="font-semibold text-cyan-400">
                        {filteredUsers.length}
                    </span>

                </div>

            </div>

            {loading && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

                    <p className="text-slate-400">
                        Loading users...
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

            {!loading &&
                !error &&
                filteredUsers.length === 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

                        <h2 className="text-lg font-semibold text-white">
                            {userView === "deleted"
                                ? "No Deleted Users"
                                : "No Users Found"}
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            {debouncedSearchTerm
                                ? "No users match your search."
                                : userView === "deleted"
                                    ? "There are no deleted customers."
                                    : "There are no registered customers yet."}
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                filteredUsers.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

                        <div className="border-b border-slate-800 px-5 py-4">

                            <h2 className="text-lg font-semibold text-white">
                                {userView === "active"
                                    ? "Customer List"
                                    : "Deleted Customers"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                {filteredUsers.length} user
                                {filteredUsers.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                displayed
                            </p>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[750px]">

                                <thead>

                                    <tr className="border-b border-slate-800 bg-slate-950/50 text-left text-xs uppercase tracking-wider text-slate-500">

                                        <th className="px-5 py-4">
                                            Name
                                        </th>

                                        <th className="px-5 py-4">
                                            Email
                                        </th>

                                        <th className="px-5 py-4">
                                            Phone
                                        </th>

                                        <th className="px-5 py-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (
                                            <tr
                                                key={user.id}
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/users/${user.id}`
                                                    )
                                                }
                                                className="cursor-pointer border-b border-slate-800 transition hover:bg-slate-800/40 last:border-0"
                                            >

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 font-semibold text-cyan-400">

                                                            {user.name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "U"}

                                                        </div>

                                                        <div>

                                                            <p className="font-medium text-white">
                                                                {user.name ||
                                                                    "Unknown User"}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                ID: {user.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-400">
                                                    {user.email}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-400">
                                                    {user.phone ||
                                                        "Not provided"}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <div className="flex gap-2">

                                                        {userView ===
                                                        "active" ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation();

                                                                        navigate(
                                                                            `/admin/users/${user.id}/edit`
                                                                        );
                                                                    }}
                                                                    className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/20"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation();

                                                                        setDeleteUser(
                                                                            user
                                                                        );
                                                                    }}
                                                                    className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.stopPropagation();

                                                                    setRestoreUserData(
                                                                        user
                                                                    );
                                                                }}
                                                                className="rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20"
                                                            >
                                                                Restore
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

            {deleteUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <h2 className="text-xl font-bold text-white">
                            Delete User
                        </h2>

                        <p className="mt-3 text-slate-400">
                            Are you sure you want to delete{" "}
                            <strong className="text-white">
                                {deleteUser.name}
                            </strong>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            The user will be moved to the deleted users list.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteUser(null)
                                }
                                className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400"
                            >
                                Yes, Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {restoreUserData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <h2 className="text-xl font-bold text-white">
                            Restore User
                        </h2>

                        <p className="mt-3 text-slate-400">
                            Are you sure you want to restore{" "}
                            <strong className="text-white">
                                {restoreUserData.name}
                            </strong>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            This user will become active again.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setRestoreUserData(null)
                                }
                                className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleRestore}
                                className="rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-green-400"
                            >
                                Yes, Restore
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminUsers;