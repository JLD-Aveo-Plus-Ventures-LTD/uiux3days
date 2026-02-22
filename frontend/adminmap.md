## Plan: Dashboard & Leads Page Separation

**TL;DR**

Refactor the admin dashboard into two distinct pages with clear responsibilities: a **Dashboard page** displaying metrics and weekly analytics, and a **Leads page** for lead management with advanced filtering and pagination UI. This requires creating a LeadsChart component (Chart.js), enhancing LeadsPage with numbered pagination controls and improved layout, ensuring DashboardPage focuses on analytics, and maintaining clean separation of concerns across the feature structure.

**Steps**

1. **Install Chart.js dependencies**
   - Add `chart.js` and `react-chartjs-2` via npm
   - Update `package.json`

2. **Create LeadsChart component** [frontend/src/features/dashboard/components/LeadsChart.jsx]
   - Purpose: Weekly bar chart visualization (Mon-Sun with lead count data)
   - Props: `data` (array with labels, datasets), responsive container
   - Chart options: Legend below, Y-axis labels, clean styling
   - No hardcoded values (all via props)
   - Export from features/dashboard/index.js

3. **Refactor DashboardPage** [frontend/src/features/dashboard/DashboardPage.jsx]
   - Current: Just wraps AdminDashboard
   - New: Separate layout with AdminDashboard content reorganized
   - Keep stats cards from AdminDashboard
   - Add LeadsChart below stats (showing weekly trend data)
   - Remove leads table and filters from this page
   - Use `getDashboardData()` service function for combined stats + chart data
   - Layout: Sidebar + main content with stats grid + chart card
   - Update `features/dashboard/styles/dashboard.css` to style chart container

4. **Enhance LeadsPage** [frontend/src/features/leads/LeadsPage.jsx]
   - Current: Minimal pagination (Prev/Next buttons only)
   - New: Full-featured leads management page
   - Add page header: "Recent Leads" (styled title)
   - Add top-right filter section with two dropdowns:
     - **Filter by Status** (LEAD_STATUSES from constants)
     - **Filter by Appointment** (APPOINTMENT_STATUSES from constants)
   - Keep DataTable with columns matching spec (Name, Email, Title, Type, Appointment, Status, Created, Actions)
   - Add numbered pagination UI component below table
   - Add entry summary text: "Showing data X to Y of Z entries"
   - Wire filters to `useLeadsPaginated` hook
   - StateManagement: currentPage, pageSize, filters, sorting
   - Export from features/leads/index.js

5. **Create PaginationControls component** [frontend/src/components/Pagination/PaginationControls.jsx]
   - Props: `currentPage`, `totalPages`, `onPageChange`
   - Render: Previous button, numbered page buttons (1 2 3 ... 40), Next button
   - Visual feedback: Highlight current page, disable Prev/Next at boundaries
   - Pattern: `< 1 2 3 4 ... 40 >`
   - Logic for ellipsis (...) when many pages exist
   - Reusable across app
   - Export from components/index.js

6. **Update LeadTable columns** [frontend/src/features/leads/LeadTable.jsx]
   - Verify all 8 required columns are present and sortable
   - Ensure column headers match spec: Name, Email, Title, Type, Appointment, Status, Created, Actions
   - Add `sortable: true` to Name, Created, Appointment columns in config
   - Verify StatusBadge renders correctly for Status column
   - Verify Actions column has "View" button → modal trigger

7. **Verify LeadDetailModal** [frontend/src/features/leads/LeadDetailModal.jsx]
   - Check: Read-only fields (Name, Email, Phone, Title, Status, Struggle, Method, Appointment Time, Appointment Status, Timezone)
   - Check: Editable dropdowns (Update Status, Update Appointment Status)
   - Check: Note textarea for additional information
   - Verify: Form submission updates via service layer
   - Verify: Layout responsive grid (2-3 columns)
   - Verify: Uses `<StatusBadge />` for visual status display

8. **Update routing** [frontend/src/AppContent.jsx]
   - Verify two distinct routes:
     - `/admin/dashboard` → DashboardPage (metrics view)
     - `/admin/leads` → LeadsPage (leads list view)
   - Update sidebar NAV_ITEMS to differentiate these routes
   - Update Sidebar.jsx active route highlighting

9. **Update Sidebar navigation** [frontend/src/layout/Sidebar.jsx]
   - Verify `NAV_ITEMS` config has:
     - "Dashboard" → `/admin/dashboard`
     - "Leads" → `/admin/leads`
     - "Report" → `/admin/reports` (or disabled)
   - Ensure active state highlights correctly based on current route

10. **Update CSS/styling**
    - [features/dashboard/styles/dashboard.css] - Add LeadsChart card styling
    - [features/leads/LeadsPage.scss or inline] - Add Leads page layout, filter bar, pagination spacing
    - Ensure responsive design (mobile, tablet, desktop)
    - Consistency with existing color scheme (green sidebar, white content areas)

**Verification**

1. **Dev server test**: `npm run dev`, visit admin dashboard, verify no console errors
2. **Navigation**: Click "Dashboard" nav item → shows stats + chart; click "Leads" nav item → shows leads table
3. **Dashboard page**: Stats cards visible, LeadsChart renders weekly data (should show sample data in dev)
4. **Leads page**:
   - Filters work (change status/appointment dropdown, table updates)
   - Pagination: Click page numbers, Previous/Next buttons, table refreshes with correct page data
   - Entry summary displays correct range (e.g., "Showing data 1 to 10 of 256 entries")
   - Column sorting works on Name, Created, Appointment
   - "View" button opens LeadDetailModal
   - Modal can edit status/appointment and save updates

5. **No data loss**: Existing lead data flows through both views correctly
6. **Active route**: Sidebar highlights correct nav item based on current page

**Decisions**

- **Chart library**: Chart.js + react-chartjs-2 (chosen) — provides flexibility and wide ecosystem support
- **Pagination UI**: Numbered buttons (`< 1 2 3 ... >`) with ellipsis for large page counts (chosen)
- **Page separation**: Dashboard = analytics/metrics only; Leads = CRUD management with filters/sort/pagination
- **Code reuse**: LeadTable, LeadDetailModal, StatusBadge, FilterBar shared across both pages where appropriate
- **Service functions**: `getDashboardData()` for Dashboard page; `getLeads()` + `filterLeads()` for Leads page
- **Config-driven**: All dropdowns, stats, status labels pulled from `constants.js` (no hardcoding)

---

**Ready?** This plan keeps the dashboard focused on analytics while giving the Leads page a full CRUD interface. All components and services already exist; main work is assembly, component creation (LeadsChart, PaginationControls), and refactoring existing pages to this new structure.
