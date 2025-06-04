import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-fields">
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="form-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;