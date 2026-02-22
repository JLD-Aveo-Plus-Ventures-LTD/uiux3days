import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./components/LandingPage.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import BookingPage from "./components/BookingPage.jsx";
import AppContent from "./AppContent.jsx";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
