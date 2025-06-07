import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/context";
import { Link } from "react-router-dom";
import "../../App.css";

function Dashboard() {
  const { user, token } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {user?.name}</h2>
      <div className="dashboard-cars">
        <h3>Your Car Profiles</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="car-list">
            {cars.map(car => (
              <li key={car._id} className="car-list-item">
                <div>
                  <div className="car-name">{car.name} ({car.regNum})</div>
                  <div className="car-summary">{car.insuranceSummary}</div>
                </div>
                <div>
                  <Link to={`/car/edit/${car._id}`} className="car-edit">Edit</Link>
                  <Link to={`/car/delete/${car._id}`} className="car-delete">Delete</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link to="/car/new" className="dashboard-add-car">Add New Car</Link>
    </div>
  );
}

export default Dashboard;