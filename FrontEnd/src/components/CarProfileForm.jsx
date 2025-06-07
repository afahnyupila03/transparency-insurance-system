import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import "../App.css";

const API_BASE = "http://localhost:3000";

const initialState = {
  regNum: "",
  name: "",
  address: "",
  genre: "",
  type: "",
  mark: "",
  chassisNumber: "",
  energy: "",
  hpRating: "",
  numberOfSeats: "",
  carryingCapacity: "",
  firstYear: "",
};

// Example regex and enums (adjust to match your backend schema)
// const REGNUM_REGEX = /^[A-Z]{2}\d{3}[A-Z]{2}$/; // e.g. AB123CD
// const CHASSIS_REGEX = /^[A-Z0-9]{17}$/; // 17 chars, letters/numbers
const GENRE_OPTIONS = ["SUV", "VT", "Truck", "Coupe", "Hatchback"];
const ENERGY_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid", "ESS"];

function CarProfileForm({ editMode = false }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode && id) {
      fetch(`${API_BASE}/api/car/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setForm({
          ...initialState,
          ...data
        }));
    }
  }, [editMode, id, token]);

  const validateForm = () => {
    // if (!REGNUM_REGEX.test(form.regNum)) {
    //   setError("Registration Number must match format (e.g. AB123CD)");
    //   return false;
    // }
    if (!form.name.trim()) {
      setError("Car Name is required.");
      return false;
    }
    if (!form.address.trim()) {
      setError("Address is required.");
      return false;
    }
    if (!GENRE_OPTIONS.includes(form.genre)) {
      setError("Genre must be one of: " + GENRE_OPTIONS.join(", "));
      return false;
    }
    if (!form.type.trim()) {
      setError("Type is required.");
      return false;
    }
    if (!form.mark.trim()) {
      setError("Mark is required.");
      return false;
    }
    // if (!CHASSIS_REGEX.test(form.chassisNumber)) {
    //   setError("Chassis Number must be 17 characters (letters/numbers).");
    //   return false;
    // }
    if (!ENERGY_OPTIONS.includes(form.energy)) {
      setError("Energy must be one of: " + ENERGY_OPTIONS.join(", "));
      return false;
    }
    if (isNaN(form.hpRating) || form.hpRating <= 0) {
      setError("HP Rating must be a positive number.");
      return false;
    }
    if (isNaN(form.numberOfSeats) || form.numberOfSeats <= 0) {
      setError("Number of Seats must be a positive number.");
      return false;
    }
    if (isNaN(form.carryingCapacity) || form.carryingCapacity <= 0) {
      setError("Carrying Capacity must be a positive number.");
      return false;
    }
    if (!(form.firstYear.trim())) {
      setError("First Year must be a valid year (>= 1886).");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode
        ? `${API_BASE}/api/update-car/${id}`
        : `${API_BASE}/api/create`;
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
          placeholder="Registration Number (e.g. AB123CD)"
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
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="form-input"
          value={form.address}
          onChange={handleChange}
          required
        />
        <select
          name="genre"
          className="form-input"
          value={form.genre}
          onChange={handleChange}
          required
        >
          <option value="">Select Genre</option>
          {GENRE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="text"
          name="type"
          placeholder="Type"
          className="form-input"
          value={form.type}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mark"
          placeholder="Mark"
          className="form-input"
          value={form.mark}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="chassisNumber"
          placeholder="Chassis Number (17 chars)"
          className="form-input"
          value={form.chassisNumber}
          onChange={handleChange}
          required
        />
        <select
          name="energy"
          className="form-input"
          value={form.energy}
          onChange={handleChange}
          required
        >
          <option value="">Select Energy</option>
          {ENERGY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="number"
          name="hpRating"
          placeholder="HP Rating"
          className="form-input"
          value={form.hpRating}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="numberOfSeats"
          placeholder="Number of Seats"
          className="form-input"
          value={form.numberOfSeats}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="carryingCapacity"
          placeholder="Carrying Capacity"
          className="form-input"
          value={form.carryingCapacity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="firstYear"
          placeholder="First Year"
          className="form-input"
          value={form.firstYear}
          onChange={handleChange}
          required
        />
        <button className="form-button" type="submit">
          {editMode ? "Update" : "Add"} Car
        </button>
      </form>
    </div>
  );
}

export default CarProfileForm;