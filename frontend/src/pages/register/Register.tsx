import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getRandomColor, getRandomRole } from "../../utils/util";
import { IGoogleJwtPayload } from "../../services/accounts/IAccounts";
import { IRegisterProps } from "./IRegister";

export const Register = () => {
    const onNavigate = useNavigate();
    const registerUrl = 'http://127.0.0.1:8000/api/users/register'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [user, setUser] = useState<IRegisterProps>({  Username: '',
                                                        Fullname: '',
                                                        Password: '',
                                                        ConfirmPassword: '',
                                                        Email: '',
                                                        Phone: '',
                                                        Role: '',
                                                        Status: false,
                                                        GoogleCredential: false
                                                    });

    const handleSignUpSuccess = async (credentialResponse : CredentialResponse) => {
        const { credential } = credentialResponse;
        if (credential) {
            const decodedToken = jwtDecode<IGoogleJwtPayload>(credential);
            const userRole = getRandomRole();
            const userAvatar = getRandomColor();

            const data = {
                Username: decodedToken.name,
                FullName: decodedToken.name,
                Email: decodedToken.email,
                GoogleCredential: true,
                Password: "",
                Role: userRole,
                Status: true,
                Phone: "",
                Avatar: userAvatar,
            }

            try {
                const response = await axios.post(registerUrl, data)
                if (response.data.status === 201) {
                    const { username, avatar, role } = response.data.data;
                    const userData = {
                        username: username,
                        avatar: avatar,
                        role: role
                    }
                    localStorage.setItem("user", JSON.stringify(userData))
                    onNavigate('/');
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again.');
            }
        }
        
    }

    const registerWithoutGoogle = async (e : React.FormEvent) => {
        e.preventDefault();
        if(user.Fullname.length < 5) {
            alert("Username must have at least 5 characters")
        }

        else if(!user.Email) {
            alert("Email is required")
        }

        else if(user.Password.length < 8) {
            alert("Password lengths must be at least 8")
        }

        else if(user.Password != user.ConfirmPassword) {
            alert("Password and Confirm Password have to be the same")
        } else {
            const randomColor = getRandomColor();
            const userRole = getRandomRole();
            const data = {
                Username: user.Fullname,
                FullName: user.Fullname,
                Password: user.Password,
                Email: user.Email,
                Phone: user.Phone,
                Role: userRole,
                Status: true,
                GoogleCredential: false,
                Avatar: randomColor,
            }
    
            try {
                const response = await axios.post(registerUrl, data)
                if (response.data.status === 201) {
                    const { username, avatar, role } = response.data.data;
                    const userData = {
                        username: username,
                        avatar: avatar,
                        role: role
                    }
                    localStorage.setItem("user", JSON.stringify(userData))
                    onNavigate('/');
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again.');
            }
        }
    }

    return (
        <GoogleOAuthProvider clientId="372755668749-qsgi9n8h94i7lcguugpm89lurt9kmsl2.apps.googleusercontent.com">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form className="bg-primary p-6 rounded-md shadow w-1/4">
                    <h2 className="text-left text-2xl font-bold mb-5">Register</h2>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                        value={user?.Fullname}
                        onChange={(e) => setUser({...user, Fullname: e.target.value})}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                        value={user.Email}
                        onChange={(e) => setUser({...user, Email: e.target.value})}
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone" 
                        className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                        value={user.Phone}
                        onChange={(e) => setUser({...user, Phone: e.target.value})}
                    />
                    <div className="relative mb-5">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            className="block w-full text-sm p-2 border rounded-lg shadow-md pr-10"
                            value={user.Password}
                            onChange={(e) => setUser({...user, Password: e.target.value})}
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
                            value={user.ConfirmPassword}
                            onChange={(e) => setUser({...user, ConfirmPassword: e.target.value})}
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
                        onClick={registerWithoutGoogle}
                    >
                        Register
                    </button>

                    <GoogleLogin onSuccess={handleSignUpSuccess} text="signup_with"/>
                    <p className="text-left">Already have an account? <Link to="/login" className="text-secondary no-underline hover:underline">Login</Link></p>
                </form>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Register;