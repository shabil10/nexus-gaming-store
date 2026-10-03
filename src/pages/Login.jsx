import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { login as adminLogin } from "../redux/slices/adminAuthSlice";
import { setCart } from "../redux/slices/cartSlice";
import { setWishlist } from "../redux/slices/wishlistSlice";
import { getUsers } from "../services/userService";
import { getAdmins } from "../services/adminService";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setError("");

            const users = await getUsers();

            const user = users.find(
                (item) =>
                    item.email.toLowerCase() ===
                        data.email.trim().toLowerCase() &&
                    item.password === data.password &&
                    item.isDeleted !== true
            );

            if (user) {
                const savedCart =
                    JSON.parse(
                        localStorage.getItem(
                            `cart_${user.id}`
                        )
                    ) || [];

                const savedWishlist =
                    JSON.parse(
                        localStorage.getItem(
                            `wishlist_${user.id}`
                        )
                    ) || [];

                dispatch(setCart(savedCart));
                dispatch(setWishlist(savedWishlist));
                dispatch(login(user));

                navigate("/");
                return;
            }

            const admins = await getAdmins();

            const admin = admins.find(
                (item) =>
                    item.email.toLowerCase() ===
                        data.email.trim().toLowerCase() &&
                    item.password === data.password
            );

            if (admin) {
                dispatch(adminLogin(admin));
                navigate("/admin");
                return;
            }

            setError("Invalid email or password");
        } catch (error) {
            console.error(error);

            setError(
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] bg-slate-950 px-4 py-12 text-white">
            <div className="mx-auto max-w-md">

                <div className="mb-8 text-center">
                    <div className="mb-4 text-5xl">
                        🎮
                    </div>

                    <h1 className="text-3xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Login to your Nexus Gaming account
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
                >

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required:
                                    "Email is required",

                                pattern: {
                                    value:
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                    message:
                                        "Enter a valid email address"
                                }
                            })}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                        />

                        {errors.email && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.email.message}
                            </p>
                        )}

                    </div>

                    <div className="mb-6">

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                {...register("password", {
                                    required:
                                        "Password is required",

                                    pattern: {
                                        value:
                                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,

                                        message:
                                            "Password must contain 8+ characters, a letter, a number and a special character"
                                    }
                                })}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                            />

                            <button
                                type="button"
                                onMouseEnter={() =>
                                    setShowPassword(true)
                                }
                                onMouseLeave={() =>
                                    setShowPassword(false)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-white"
                            >
                                👁
                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.password.message}
                            </p>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Logging in..."
                            : "Login"}
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                        >
                            Create Account
                        </Link>
                    </p>

                </form>

            </div>
        </div>
    );
}

export default Login;