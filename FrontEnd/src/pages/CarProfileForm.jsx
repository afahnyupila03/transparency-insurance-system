import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/context";
import "../App.css";

const initialState = {
  regNum: "",
  name: "",
  // ...other fields as needed
};

function CarProfileForm({ editMode = false }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode && id) {
      fetch(`/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setForm(data));
    }
  }, [editMode, id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode ? `/api/cars/${id}` : "/api/cars";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save car profile");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{editMode ? "Edit" : "Add"} Car Profile</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-fields">
        <input
          type="text"
          name="regNum"
          placeholder="Registration Number"
          className="form-input"
          value={form.regNum}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Car Name"
          className="form-input"
          value={form.name}
          onChange={handleChange}
          required
        />
        {/* Add more fields as needed */}
        <button className="form-button" type="submit">
          {editMode ? "Update" : "Add"} Car
        </button>
      </form>
    </div>
  );
}

export default CarProfileForm;