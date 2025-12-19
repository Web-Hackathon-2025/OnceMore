import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../axiosInstance"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [userType, setUserType] = useState("");
    const [serviceCategory, setServiceCategory] = useState("");
    const [experience, setExperience] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Service categories for service providers
    const serviceCategories = [
        "Electrician",
        "Plumber",
        "Carpenter",
        "Painter",
        "AC Repair",
        "Appliance Repair",
        "Cleaning",
        "Pest Control",
        "Mason",
        "Gardener",
        "Driver",
        "Cook",
        "Beautician",
        "Tailor",
        "Other"
    ];

    const notify = () => toast.success("Signup Successful!", { position: "bottom-left", autoClose: 3000 });
    const notifyError = (message) => toast.error(message, { position: "bottom-left", autoClose: 3000 });

    // Extract userType from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get("userType");
        if (type === "customer" || type === "serviceProvider") {
            setUserType(type);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Basic validation
        if (!email || !password || !confirmPassword || !fullName || !phoneNumber) {
            setError("Please fill in all required fields.");
            notifyError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            notifyError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (phoneNumber.length < 10) {
            setError("Please enter a valid phone number.");
            notifyError("Please enter a valid phone number.");
            setLoading(false);
            return;
        }

        // Additional validation for service providers
        if (userType === "serviceProvider") {
            if (!serviceCategory) {
                setError("Please select a service category.");
                notifyError("Please select a service category.");
                setLoading(false);
                return;
            }
            if (!experience) {
                setError("Please enter your experience.");
                notifyError("Please enter your experience.");
                setLoading(false);
                return;
            }
        }

        try {
            console.log("Sending signup request to backend...");

            const userData = {
                fullName,
                email,
                password,
                phoneNumber,
                userType,
                ...(userType === "serviceProvider" && {
                    serviceCategory,
                    experience: parseInt(experience),
                    address
                })
            };

            const response = await API.post(`/auth/signup`, userData, {
                headers: { "Content-Type": "application/json" }
            });

            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userType", user.userType);

            console.log("Signup successful:", response);

            if (response.status === 201) {
                notify();

                // Delay navigation slightly to allow toast to appear
                setTimeout(() => {
                    // Redirect based on user type
                    if (user.userType === "serviceProvider") {
                        navigate("/provider/dashboard");
                    } else {
                        navigate("/customer/dashboard");
                    }
                }, 2500);
            }
        } catch (err) {
            console.error("Error during signup:", err);
            const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
            setError(errorMessage);
            notifyError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Helmet>
            <title>Karigar - Signup</title>
        </Helmet>
        <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl mt-20">
                {/* Left Section */}
                <div
                    data-aos="fade-right"
                    className="w-full lg:w-2/5 flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white dark:from-orange-700 dark:to-orange-800 p-8 sm:p-10"
                >
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Karigar</h1>
                        <p className="text-xl mb-6">Find trusted service providers</p>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4">Join as</h3>
                            <div className="space-y-3">
                                <div className="bg-white/20 p-4 rounded-lg">
                                    <h4 className="font-bold">Customer</h4>
                                    <p className="text-sm">Find and book services</p>
                                </div>
                                <div className="bg-white/20 p-4 rounded-lg">
                                    <h4 className="font-bold">Service Provider</h4>
                                    <p className="text-sm">Offer your services and earn</p>
                                </div>
                            </div>
                        </div>
                        <p className="mb-6">Already have an account?</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* Right Section (Signup Form) */}
                <div className="w-full lg:w-3/5 p-8 sm:p-10">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-2">Create Account</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Join Karigar to find or offer services</p>
                    
                    {/* Show User Type */}
                    {userType && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Signing up as: <span className="font-bold capitalize text-orange-600 dark:text-orange-400">
                                    {userType === "customer" ? "Customer" : "Service Provider"}
                                </span>
                            </p>
                        </div>
                    )}
                    
                    {/* User Type Selection */}
                    {!userType && (
                        <div className="mb-8">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">Select Your Role:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setUserType("customer")}
                                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${userType === "customer" 
                                        ? 'border-orange-500 bg-orange-50 dark:bg-gray-700' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'}`}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">👨‍💼</div>
                                        <h3 className="font-bold text-lg mb-2">Customer</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Book services for your needs
                                        </p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType("serviceProvider")}
                                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${userType === "serviceProvider" 
                                        ? 'border-orange-500 bg-orange-50 dark:bg-gray-700' 
                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'}`}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🔧</div>
                                        <h3 className="font-bold text-lg mb-2">Service Provider</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Offer your skills and services
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</p>}

                    {userType && (
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="peer block w-full p-4 text-black border-2 dark:focus:border-orange-400 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 focus:border-2 pt-5 dark:text-gray-100 transition-all duration-300"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${fullName || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                            } ${fullName ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                    >
                                        Full Name *
                                    </label>
                                </div>

                                {/* Email Input */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="peer block w-full p-4 text-black border-2 dark:focus:border-orange-400 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 focus:border-2 pt-5 dark:text-gray-100 transition-all duration-300"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${email || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                            } ${email ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                    >
                                        Email Address *
                                    </label>
                                </div>

                                {/* Phone Number Input */}
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="peer block w-full p-4 text-black border-2 dark:focus:border-orange-400 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 focus:border-2 pt-5 dark:text-gray-100 transition-all duration-300"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${phoneNumber || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                            } ${phoneNumber ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                    >
                                        Phone Number *
                                    </label>
                                </div>

                                {/* Service Category (for service providers) */}
                                {userType === "serviceProvider" && (
                                    <div className="relative">
                                        <select
                                            value={serviceCategory}
                                            onChange={(e) => setServiceCategory(e.target.value)}
                                            className="block w-full p-4 text-black border-2 dark:focus:border-orange-400 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 focus:border-2 dark:text-gray-100 transition-all duration-300 appearance-none"
                                            required
                                        >
                                            <option value="">Select Service Category *</option>
                                            {serviceCategories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Password Input */}
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="peer block w-full p-4 text-gray-800 border-2 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 pt-5 dark:text-gray-100 focus:border-2 transition-all"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${password || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                            } ${password ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                    >
                                        Password *
                                    </label>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="peer block w-full p-4 text-gray-800 border-2 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 dark:text-gray-100 pt-5 dark:focus:border-orange-400 focus:border-2 transition-all"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${confirmPassword || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                            } ${confirmPassword ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                    >
                                        Confirm Password *
                                    </label>
                                </div>

                                {/* Experience (for service providers) */}
                                {userType === "serviceProvider" && (
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="peer block w-full p-4 text-black border-2 dark:focus:border-orange-400 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 focus:border-2 pt-5 dark:text-gray-100 transition-all duration-300"
                                            placeholder=" "
                                            required
                                        />
                                        <label
                                            className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${experience || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                                } ${experience ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                        >
                                            Years of Experience *
                                        </label>
                                    </div>
                                )}

                                {/* Address (for service providers) */}
                                {userType === "serviceProvider" && (
                                    <div className="relative md:col-span-2">
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="peer block w-full p-4 text-black border-2 dark:focus:border-orange-400 border-orange-300 rounded-lg bg-transparent focus:outline-none focus:border-orange-500 focus:border-2 pt-5 dark:text-gray-100 transition-all duration-300 resize-none"
                                            placeholder=" "
                                            rows="3"
                                        />
                                        <label
                                            className={`absolute left-3 transition-all duration-300 ease-in-out text-orange-500 bg-white dark:bg-gray-800 px-1 ${address || "peer-focus:text-orange-600 peer-focus:top-2 peer-focus:text-sm dark:peer-focus:text-orange-400"
                                                } ${address ? "top-2 text-sm" : "top-4 text-[16px]"}`}
                                        >
                                            Address
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-600 hover:to-orange-700'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    `Sign Up as ${userType === 'customer' ? 'Customer' : 'Service Provider'}`
                                )}
                            </button>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </form>
                    )}

                    {/* Back button if user type is selected */}
                    {userType && (
                        <button
                            onClick={() => setUserType("")}
                            className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition"
                        >
                            ← Back to role selection
                        </button>
                    )}
                </div>
            </div>
            {/* Toast Notification Container */}
            <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
        </div>
        </>
    );
};

export default Signup;