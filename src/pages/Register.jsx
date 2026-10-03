import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUser,
    getUsers
} from "../services/userService";

function Register() {
    const navigate = useNavigate();

    const [registerError, setRegisterError] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setRegisterError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const users = await getUsers();

            const emailExists = users.some(
                (user) =>
                    user.email.toLowerCase() ===
                    data.email.trim().toLowerCase()
            );

            if (emailExists) {
                setRegisterError(
                    "An account with this email already exists."
                );
                return;
            }

            const userData = {
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password
            };

            await createUser(userData);

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.error(
                "Registration failed:",
                error
            );

            setRegisterError(
                "Unable to create your account. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-950 px-4 py-10 text-white">

            <div className="w-full max-w-md">

                <div className="mb-7 text-center">

                    <Link
                        to="/"
                        className="text-2xl font-black tracking-[0.3em] text-cyan-400 transition hover:text-cyan-300"
                    >
                        NEXUS
                    </Link>

                    <div className="mx-auto mt-4 h-px w-12 bg-cyan-400/50" />

                    <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                        Create Your Account
                    </h1>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        Join NEXUS and start building your ultimate gaming setup.
                    </p>

                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

                    {registerError && (
                        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            <p className="text-xs leading-5 text-red-400">
                                ⚠️ {registerError}
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                            <p className="text-xs leading-5 text-green-400">
                                ✅ {success}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-300">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                {...register("name", {
                                    required:
                                        "Name is required",

                                    minLength: {
                                        value: 2,
                                        message:
                                            "Name must be at least 2 characters"
                                    },

                                    pattern: {
                                        value:
                                            /^[A-Za-z ]+$/,
                                        message:
                                            "Name should contain only letters"
                                    }
                                })}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                            />

                            {errors.name && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-300">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
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
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-300">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
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
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                                />

                                <button
                                    type="button"
                                    onMouseEnter={() =>
                                        setShowPassword(true)
                                    }
                                    onMouseLeave={() =>
                                        setShowPassword(false)
                                    }
                                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-xl text-slate-400 hover:text-white"
                                >
                                    👁
                                </button>

                            </div>

                            {errors.password && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-300">
                                Confirm Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    {...register(
                                        "confirmPassword",
                                        {
                                            required:
                                                "Please confirm your password",

                                            validate: (value) =>
                                                value ===
                                                    getValues(
                                                        "password"
                                                    ) ||
                                                "Passwords do not match"
                                        }
                                    )}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                                />

                                <button
                                    type="button"
                                    onMouseEnter={() =>
                                        setShowConfirmPassword(
                                            true
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setShowConfirmPassword(
                                            false
                                        )
                                    }
                                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-xl text-slate-400 hover:text-white"
                                >
                                    👁
                                </button>

                            </div>

                            {errors.confirmPassword && (
                                <p className="mt-2 text-xs text-red-400">
                                    {
                                        errors
                                            .confirmPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 w-full rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Creating Account..."
                                : "Create Account →"}
                        </button>

                    </form>

                    <div className="mt-6 border-t border-slate-800 pt-6 text-center">

                        <p className="text-xs text-slate-500">
                            Already have an account?
                        </p>

                        <Link
                            to="/login"
                            className="mt-2 inline-block text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                        >
                            Login to NEXUS →
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;