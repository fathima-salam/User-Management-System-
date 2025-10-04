import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, setUserData } from "../../../redux-toolkit/userDataReducer";
import { toast } from "react-hot-toast";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.userData.token);
  const loading = useSelector((state) => state.userData.loading);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    type: '',
    message: ''
  });

  function validation(data) {
    const { name, email, password } = data;

    if (!name || name.trim() === "") {
      return { valid: false, message: "Name is required", type: 'name' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { valid: false, message: "Please enter a valid email address", type: 'email' };
    }

    if (!password || password.length < 6) {
      return { valid: false, message: "Password must be at least 6 characters long", type: 'password' };
    }

    return { valid: true, message: "Validation successful" };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationResult = validation(data);
    if (!validationResult.valid) {
      toast.error(validationResult.message);
      setError({type: validationResult.type, message: validationResult.message});
      return;
    }
    dispatch(setUserData(data))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong, please try again.");
        console.log(err);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-gray-800">Loading...</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="bg-gray-900 border-2 border-gray-800 rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-white text-center tracking-wide">REGISTER</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 font-bold text-white text-sm tracking-wide">
                USERNAME
              </label>
              <input
                type="text"
                required
                name="name"
                id="username"
                onChange={handleChange}
                placeholder="username"
                value={data.name}
                className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded"
              />
              {error.type === 'name' ? <p className="text-red-400 mt-2 text-sm">{error.message}</p> : null}
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 font-bold text-white text-sm tracking-wide">
                EMAIL
              </label>
              <input
                type="email"
                required
                name="email"
                onChange={handleChange}
                value={data.email}
                id="email"
                placeholder="your@email.com"
                className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded"
              />
              {error.type === 'email' ? <p className="text-red-400 mt-2 text-sm">{error.message}</p> : null}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 font-bold text-white text-sm tracking-wide">
                PASSWORD
              </label>
              <input
                required
                name="password"
                onChange={handleChange}
                value={data.password}
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded"
              />
              {error.type === 'password' ? <p className="text-red-400 mt-2 text-sm">{error.message}</p> : null}
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-white text-black border-2 border-white text-base font-bold cursor-pointer mt-4 hover:shadow-[6px_6px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rounded tracking-wide"
            >
              SIGN UP
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            You have an account?{" "}
            <a 
              onClick={() => navigate("/login")} 
              className="font-bold text-white underline cursor-pointer hover:text-gray-300 transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          <p>Join thousands of users managing their accounts securely</p>
        </div>
      </div>
    </div>
  );
}

export default Register;