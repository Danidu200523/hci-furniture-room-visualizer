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

     
      <div className="logo">
        <h2>Hello</h2>
        <span>Room Planner</span>
      </div>

      
      <h1 className="title">
        Furniture <span>Room</span> Visualiser
      </h1>

      <div className="login-container">

        
        <div className="login-image">
          <img src="/room2.png" alt="furniture" />
        </div>

        
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

          <p className="terms"style={{marginTop:"10px", fontSize:"14px"}}>
Demo login → designer@hci.com / 1234
</p>

        </div>
      </div>
    </div>
  );
}

export default Login;