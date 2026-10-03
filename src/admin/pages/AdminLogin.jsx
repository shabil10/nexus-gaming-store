import { useState } from "react";
import { getAdmins } from "../../services/adminService";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/adminAuthSlice";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        if (email.trim() === "") {
            setError("Email is required");
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            setError("Enter a valid email address");
            return;
        }

        if (password.trim() === "") {
            setError("Password is required");
            return;
        }

        const passwordPattern =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordPattern.test(password)) {
            setError(
                "Password must contain 8+ characters, a letter, a number and a special character"
            );
            return;
        }

        setLoading(true);

        try {
            const admins = await getAdmins();

            const admin = admins.find(
                (item) =>
                    item.email.toLowerCase() ===
                        email.trim().toLowerCase() &&
                    item.password === password
            );

            if (!admin) {
                setError("Invalid email or password");
                return;
            }

            dispatch(login(admin));

            navigate("/admin");
        } catch (error) {
            console.error(error);

            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">

                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
                        <span className="text-2xl font-bold text-cyan-400">
                            N
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-wide text-white">
                        NEXUS
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Admin Panel
                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            Admin Login
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Sign in to manage your store
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                            <p className="text-sm text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter admin password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Signing in..."
                                : "Login"}
                        </button>

                    </form>

                </div>

                <p className="mt-6 text-center text-xs text-slate-600">
                    NEXUS Gaming Store Admin Panel
                </p>

            </div>

        </div>
    );
}

export default AdminLogin;