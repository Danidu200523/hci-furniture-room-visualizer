import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "designer@hci.com" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/room-setup");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">

      {/* Logo */}
      <div className="logo">
        <h2>Hello</h2>
        <span>Room Planner</span>
      </div>

      {/* Title */}
      <h1 className="title">
        Furniture <span>Room</span> Visualiser
      </h1>

      <div className="login-container">

        {/* Left Image */}
        <div className="login-image">
          <img src="/room2.png" alt="furniture" />
        </div>

        {/* Login Card */}
        <div className="login-card">

          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <label>Username</label>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="login-btn" type="submit">
              Login
            </button>

            {error && <p className="error">{error}</p>}

          </form>

          <p className="terms">
            By continuing, you agree to our Terms of Services and acknowledge our
            Privacy Policy. Standard Messaging rates may apply.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;