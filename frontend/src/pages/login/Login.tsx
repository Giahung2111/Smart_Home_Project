import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { getRandomColor, getRandomRole } from "../../utils/util";
import { IGoogleJwtPayload } from "../../services/accounts/IAccounts";
import { ILoginProps } from "./ILogin";
import axios from "axios";
import { AuthAPI } from "../../services/auth/authAPI";


export const Login = () => {
    const onNavigate = useNavigate();
    const loginUrl = AuthAPI.login;
    const [showPassword, setShowPassword] = useState(true);
    const [login, setLogin] = useState<ILoginProps>({
        username: "",
        password: ""
    });

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        const { credential } = credentialResponse;
        if (credential) {
            const decodedToken = jwtDecode<IGoogleJwtPayload>(credential);
            const randomRole = getRandomRole()
            const userAvatarColor = getRandomColor()

            const data = {
                Username: decodedToken.name,
                FullName: decodedToken.name,
                Email: decodedToken.email,
                GoogleCredential: true,
                Password: "",
                Role: randomRole,
                Status: true,
                Phone: "",
                Avatar: userAvatarColor,
            }

            try {
                const response = await axios.post(loginUrl, data)
                if (response.data.status === 200 || response.data.status === 201) {
                    console.log(response.data)
                    const { id, username, avatar, role } = response.data.data;
                    const userData = {
                        id: id,
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

    const loginWithoutGoogle = async (e: React.FormEvent) => {
        e.preventDefault();
        if(login.username.length == 0 || login.password.length == 0) {
            alert("Please fill in all inputs")
        } else {

            const data = {
                Username: login.username,
                Password: login.password,
                GoogleCredential: false,
            }
    
            try {
                const response = await axios.post(loginUrl, data);
                console.log(response.data)
                if (response.data.status === 200 || response.data.status === 201) {
                    const { id, username, avatar, role } = response.data.data;
                    const userData = {
                        id: id,
                        username: username,
                        avatar: avatar,
                        role: role
                    }
                    localStorage.setItem("user", JSON.stringify(userData))
                    onNavigate('/');
                } else {
                    alert('Wrong username or password. Please try again.');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('The account associated with this email existed. Change another email.');
            }
        }
    }

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form className="bg-primary p-6 rounded-md shadow">
                    <h2 className="text-left text-2xl font-bold mb-5">Login</h2>
                    <input 
                        type="text" 
                        placeholder="UserName" 
                        className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
                        value={login.username}
                        onChange={(e) => setLogin({...login, username: e.target.value})}
                    />
                    <div className="relative mb-5">
                    <input 
                        type={showPassword ? "password" : "text"} 
                        placeholder="Password" 
                        className="block w-full text-sm mb-5 p-2 pr-10 border rounded-lg shadow-md"
                        value={login.password}
                        onChange={(e) => setLogin({...login, password: e.target.value})}
                    />
                    <button 
                            type="button" 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-secondary text-white p-2 mb-5 text-sm rounded-lg shadow-md"
                        onClick={loginWithoutGoogle}
                    >
                        Login
                    </button>

                    <GoogleLogin onSuccess={handleLoginSuccess}/>
                    <p className="text-left">You don't have account? <Link to="/register" className="text-secondary no-underline hover:underline">Register</Link></p>
                </form>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;

