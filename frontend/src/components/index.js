/**
 * Shared Components - Index file
 * 
 * Centralized exports for reusable UI components
 * NOT feature-specific - used across the app
 */

// Layout
export { default as AdminLayout } from "../layout/AdminLayout.jsx";
export { default as Sidebar } from "../layout/Sidebar.jsx";

// UI Components
export { default as StatsCard } from "./StatsCard.jsx";
export { default as FilterBar } from "./FilterBar.jsx";

// Form Components
export { default as SelectField } from "./Form/SelectField.jsx";
export { default as TextField } from "./Form/TextField.jsx";

// Modal
export { default as Modal } from "./Modal/Modal.jsx";

// Data Display
export { default as DataTable } from "./Table/DataTable.jsx";

// Status Badge
export { default as StatusBadge } from "./Badge/StatusBadge.jsx";
// Pagination
export { default as PaginationControls } from "./Pagination/PaginationControls.jsx";