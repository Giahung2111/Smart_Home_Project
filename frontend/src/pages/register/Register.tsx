import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-primary p-6 rounded-md shadow w-1/4">
                <h2 className="text-left text-2xl font-bold mb-5">Register</h2>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                />
                <input 
                    type="tel" 
                    placeholder="Phone" 
                    className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                />
                <div className="relative mb-5">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        className="block w-full text-sm p-2 border rounded-lg shadow-md pr-10"
                    />
                    <button 
                        type="button" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="w-5 h-5" />
                    </button>
                </div>
                <div className="relative mb-5">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm Password" 
                        className="block w-full text-sm p-2 border rounded-lg shadow-md pr-10"
                    />
                    <button 
                        type="button" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className="w-5 h-5" />
                    </button>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-secondary text-white text-sm p-2 mb-5 rounded-lg shadow-md"
                >
                    Register
                </button>
                <p className="text-left">Already have an account? <Link to="/login" className="text-secondary no-underline hover:underline">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;