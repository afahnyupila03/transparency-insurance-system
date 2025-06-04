import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CarProfileForm from "./components/carProfileForm";
import InsuranceCalculator from "./components/InsuranceCalculator";
import { AuthProvider, useAuth } from "./components/context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/car/new"
            element={
              <PrivateRoute>
                <CarProfileForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/car/edit/:id"
            element={
              <PrivateRoute>
                <CarProfileForm editMode={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/insurance"
            element={
              <PrivateRoute>
                <InsuranceCalculator />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;