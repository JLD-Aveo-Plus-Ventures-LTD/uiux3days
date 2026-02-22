/**
 * AdminLayout - Wrapper layout for admin pages
 * 
 * Provides consistent header and sidebar structure for all admin routes
 * Features:
 * - Responsive sidebar (always visible on desktop, collapsible on mobile)
 * - Top header with branding
 * - Main content area
 * - Footer
 */

import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import "./AdminLayout.css";

function AdminLayout({ children, adminPassword, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onLogout={onLogout} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="admin-layout__overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <main className="admin-layout__main">
        {/* Header */}
        <header className="admin-layout__header">
          <div className="admin-layout__header-content">
            {/* Hamburger Menu (mobile only) */}
            <button
              className="admin-layout__menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Logo/Branding */}
            {/* <div className="admin-layout__brand">
              <h1>Dashboard</h1>
            </div> */}

            {/* Header Actions */}
            <div className="admin-layout__header-actions">
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-layout__content">
          {children}
        </div>

        {/* Footer */}
        <footer className="admin-layout__footer">
          <p>&copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default AdminLayout;
