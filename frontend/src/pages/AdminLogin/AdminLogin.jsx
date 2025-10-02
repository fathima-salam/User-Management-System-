import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../../redux-toolkit/adminDataReducer";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const isAuthenticated = useSelector((state) => state.adminData.isAuthenticated);
    const loading = useSelector((state) => state.adminData.loading)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated])

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(adminLogin({ email, password })).unwrap()
            .then((res) => {
                toast.success(res.message);
                navigate('/dashboard');
            })
            .catch((err) => {
                toast.error(err.message || 'Something went wrong, please try again.')
                console.log(err);
            })

    };

    return (
        <div className="font-sans text-gray-900 antialiased">
            {
                loading && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                            <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg font-semibold text-gray-800">Loading...</span>
                        </div>
                    </div>
                )
            }

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">
                <div>
                    <a href="/">
                        <h2 className="font-bold text-3xl">
                            ADMIN{" "}
                            <span className="bg-[#f84525] text-white px-2 rounded-md">
                                LOGIN
                            </span>
                        </h2>
                    </a>
                </div>

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md sm:rounded-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="py-8">
                            <center>
                                <span className="text-2xl font-semibold">Log In</span>
                            </center>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block font-medium text-sm text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block font-medium text-sm text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center justify-between mt-4">
                            <a
                                className="hover:underline text-sm text-gray-600 hover:text-gray-900"
                            >
                            </a>

                            <button
                                type="submit"
                                className="ms-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 transition ease-in-out duration-150"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
