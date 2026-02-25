/**
 * Sidebar - Navigation sidebar for admin layout
 *
 * Config-driven navigation menu
 * Features:
 * - Collapsible on mobile
 * - Active route highlighting
 * - Smooth transitions
 * - Accessible markup
 */

import { useLocation, Link } from "react-router-dom";
import { HiChartPie, HiArrowRightOnRectangle } from "react-icons/hi2";
import { RiMessage2Line } from "react-icons/ri";
import { GoGraph } from "react-icons/go";
import jvlLogo from "../assets/images/jvl_logo.svg";
import "./Sidebar.css";

/**
 * Navigation config - centralized for DRY
 */
const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <HiChartPie />,
  },
  {
    id: "leads",
    label: "Leads",
    path: "/admin/leads",
    icon: <RiMessage2Line />,
  },
  {
    id: "reports",
    label: "Reports",
    path: "#", // Future feature
    icon: <GoGraph />,
    disabled: true,
  },
];

function Sidebar({ isOpen, onClose, onLogout }) {
  const location = useLocation();

  /**
   * Check if route is active
   */
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar__header">
          <img src={jvlLogo} alt="JVL Logo" className="sidebar__logo" />
          <button
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <div key={item.id}>
              {item.disabled ? (
                <span
                  className="sidebar__nav-item sidebar__nav-item--disabled"
                  title="Coming soon"
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  <span className="sidebar__nav-label">{item.label}</span>
                  <span className="sidebar__nav-badge">Soon</span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={`sidebar__nav-item ${
                    isActive(item.path) ? "sidebar__nav-item--active" : ""
                  }`}
                  onClick={onClose}
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  <span className="sidebar__nav-label">{item.label}</span>
                </Link>
              )}
            </div>
          ))}

          {/* Logout divider and button */}
          <div className="sidebar__nav-divider"></div>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="sidebar__nav-item sidebar__nav-item--logout"
          >
            <span className="sidebar__nav-icon">
              <HiArrowRightOnRectangle />
            </span>
            <span className="sidebar__nav-label">Logout</span>
          </button>
        </nav>

        {/* Sidebar Footer - kept for consistency but now hidden */}
        <div className="sidebar__footer"></div>
      </aside>
    </>
  );
}

export default Sidebar;
