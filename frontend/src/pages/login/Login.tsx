import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthAPI } from "../../services/auth/authAPI";
import { message } from "antd";
export const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await AuthAPI.Login(username, password);
      console.log("Login thành công");
      // localStorage.setItem('token', response.data.token); // Ví dụ lưu token
      // navigate('/dashboard'); // Nếu muốn chuyển trang
    } catch (error) {
      console.error("Login thất bại:", error);
      message.error('Đăng nhập thất bại')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-primary p-6 rounded-md shadow"
        onSubmit={handleSubmit}
      >
        <h2 className="text-left text-2xl font-bold mb-5">Login</h2>
        <input
          type="text"
          placeholder="UserName"
          className="block w-full text-sm mb-5 p-2 border rounded-lg shadow-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-5">
          <input
            type={showPassword ? "password" : "text"}
            placeholder="Password"
            className="block w-full text-sm mb-5 p-2 pr-10 border rounded-lg shadow-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="w-5 h-5"
            />
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-secondary text-white p-2 mb-5 text-sm rounded-lg shadow-md"
        >
          Login
        </button>
        <p className="text-left">
          You don't have account?{" "}
          <Link
            to="/register"
            className="text-secondary no-underline hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
