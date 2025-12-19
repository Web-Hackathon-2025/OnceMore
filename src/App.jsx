import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProviderDashboard from "./pages/ProviderDashboard";
import ManageServices from "./pages/ManageServices";
import BookingsManagement from "./pages/BookingsManagement";
import Availability from "./pages/Availability";
import Earnings from "./pages/Earnings";
import ProfileSettings from "./pages/ProfileSettings";
import "./App.css";

function App() {
  // In production, check authentication here
  const isAuthenticated = true; // Replace with actual auth check

  return (
    <Router>
      <Routes>
        {/* Provider Routes - Using /provider prefix to avoid conflicts with customer routes */}
        <Route
          path="/provider"
          element={
            isAuthenticated ? <ProviderDashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/services" element={<ManageServices />} />
        <Route path="/provider/bookings" element={<BookingsManagement />} />
        <Route path="/provider/availability" element={<Availability />} />
        <Route path="/provider/earnings" element={<Earnings />} />
        <Route path="/provider/profile" element={<ProfileSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
