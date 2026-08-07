import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">TrackFolio</Link>
        {user ? (
          <div className="nav-right">
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Log out</button>
          </div>
        ) : (
          <div className="nav-right">
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
