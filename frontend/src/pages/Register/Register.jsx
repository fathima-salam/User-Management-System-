import React, { useEffect, useState } from "react";
import "./Register.css";
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
  })

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
      setError({type:validationResult.type,message:validationResult.message})
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
    <div className="register-page">
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-gray-800">Loading...</span>
          </div>
        </div>
      )}
      <div className="login-container">
        <h1 className="text-2xl font-bold mb-7 text-black text-center">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-5">
            <label htmlFor="username" className="block mb-2 font-bold text-black">
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
              className="w-full p-3 border-2 border-black bg-white text-base outline-none focus:shadow-[4px_4px_0px_#000000] transition-all duration-300"
            />
            {error.type === 'name' ? <p className="text-red-500 mt-2">{error.message}</p> : null}
          </div>

          <div className="input-group mb-5">
            <label htmlFor="email" className="block mb-2 font-bold text-black">
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
              className="w-full p-3 border-2 border-black bg-white text-base outline-none focus:shadow-[4px_4px_0px_#000000] transition-all duration-300"
            />
            {error.type === 'email' ? <p className="text-red-500 mt-2">{error.message}</p> : null}
          </div>

          <div className="input-group mb-5">
            <label htmlFor="password" className="block mb-2 font-bold text-black">
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
              className="w-full p-3 border-2 border-black bg-white text-base outline-none focus:shadow-[4px_4px_0px_#000000] transition-all duration-300"
            />
            {error.type === 'password' ? <p className="text-red-500 mt-2">{error.message}</p> : null}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#FF5E5B] text-white border-2 border-black text-base font-bold cursor-pointer mt-2.5 hover:shadow-[4px_4px_0px_#000000] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300"
          >
            SIGN UP
          </button>
        </form>
        <div className="footer mt-5 text-center text-black">
          You have an account?{" "}
          <a onClick={() => navigate("/login")} className="font-bold text-black underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;