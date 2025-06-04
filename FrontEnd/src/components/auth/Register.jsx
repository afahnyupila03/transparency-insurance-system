import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../../App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ email, password, name });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-fields">
        <input
          type="text"
          placeholder="Name"
          className="form-input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;