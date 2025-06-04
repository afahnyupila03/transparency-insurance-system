import React, { useState, useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import "../App.css";

function InsuranceCalculator() {
  const { token } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [period, setPeriod] = useState(1);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cars", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCars(data));
  }, [token]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(`/api/insurance/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carId: selectedCar, period }),
      });
      if (!res.ok) throw new Error("Calculation failed");
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Insurance Calculator</h2>
      <form onSubmit={handleCalculate} className="form-fields">
        <select
          className="form-input"
          value={selectedCar}
          onChange={e => setSelectedCar(e.target.value)}
          required
        >
          <option value="">Select Car</option>
          {cars.map(car => (
            <option key={car._id} value={car._id}>
              {car.name} ({car.regNum})
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          placeholder="Coverage Period (months)"
          className="form-input"
          value={period}
          onChange={e => setPeriod(Number(e.target.value))}
          required
        />
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>
      {result && <div className="form-success">{result}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default InsuranceCalculator;