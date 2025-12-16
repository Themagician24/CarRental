import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const { setShowLogin, axios, setToken, navigate } = useAppContext();
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    // Reset form when switching between login/register
    useEffect(() => {
        if (state === "login") {
            setName("");
        }
    }, [state]);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setIsLoading(true);

            // Validation simple
            if (!email || !password || (state === "register" && !name)) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                toast.error("Please fill all fields");
                setIsLoading(false);
                return;
            }

            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                toast.error("Please enter a valid email address");
                setIsLoading(false);
                return;
            }

            const { data } = await axios.post(`/api/user/${state}`, {
                name,
                email,
                password,
            });

            if (data.success) {
                // Succès avec animation
                toast.success(state === "login" ? "Welcome back!" : "Account created successfully!");

                // Petite animation avant la navigation
                await new Promise(resolve => setTimeout(resolve, 300));

                setToken(data.token);
                localStorage.setItem('token', data.token);

                // Animation de fermeture
                setShowLogin(false);

                // Navigation légèrement retardée pour l'effet
                setTimeout(() => navigate('/'), 100);
            } else {
                toast.error(data.message);
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Animation de sortie
        const modal = document.querySelector('.login-modal');
        if (modal) {
            modal.style.animation = 'slideOut 0.3s ease forwards';
        }
        setTimeout(() => setShowLogin(false), 300);
    };

    const switchMode = (newState) => {
        // Animation de transition entre login/register
        const form = document.querySelector('.login-form');
        if (form) {
            form.style.opacity = '0';
            form.style.transform = 'translateY(10px)';

            setTimeout(() => {
                setState(newState);
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }, 200);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.form
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{
                        scale: shake ? [1, 1.02, 1] : 1,
                        opacity: 1,
                        y: 0,
                        rotate: shake ? [0, -1, 1, -1, 0] : 0
                    }}
                    transition={{
                        duration: 0.3,
                        scale: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    onSubmit={onSubmitHandler}
                    onClick={(e) => e.stopPropagation()}
                    className="login-modal login-form relative w-full max-w-md bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    {/* Décoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <div className="absolute top-4 right-4 w-16 h-16 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" />
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20" />

                    <div className="relative z-10 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center"
                            >
                                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold text-gray-800"
                            >
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {state === "login" ? "Welcome Back" : "Create Account"}
                                </span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-500 mt-2"
                            >
                                {state === "login" ? "Sign in to continue" : "Join us today"}
                            </motion.p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                {state === "register" && (
                                    <motion.div
                                        key="name-field"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    onChange={(e) => setName(e.target.value)}
                                                    value={name}
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                                                    type="text"
                                                    required
                                                />
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                                        type="email"
                                        required
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                                        type="password"
                                        required
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mode Switch */}
                        <div className="mt-6 text-center">
                            <motion.p
                                whileHover={{ scale: 1.05 }}
                                className="text-gray-600"
                            >
                                {state === "register" ? (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => switchMode("login")}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => switchMode("register")}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                )}
                            </motion.p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{state === "register" ? "Create Account" : "Sign In"}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </motion.button>

                        {/* Close Button */}
                        <motion.button
                            whileHover={{ rotate: 90 }}
                            type="button"
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>
                </motion.form>
            </motion.div>
        </AnimatePresence>
    );
};

export default Login;
