
# Admin Dashboard Refactoring (Production Architecture)

## Plan: Admin Dashboard Refactoring (Production Architecture)

**TL;DR:** Refactor the existing dashboard by extracting reusable components (StatsCard, DataTable, FilterBar, StatusBadge) and reorganizing into a clean, modular architecture. Keep plain CSS, integrate Chart.js for analytics, use existing patterns (hooks, API services, password auth). Refactor AdminDashboard.jsx, LeadTable.jsx, and LeadDetailModal.jsx to use new reusable components. No breaking changes—maintain existing API integration and routing.

---

### **Steps**

#### **Phase 1: Foundation — Reusable UI Components**

1. **Create components/StatsCard.jsx**
   - Props: `title`, `value`, `color`, `icon` (optional), `trend` (optional)
   - Extract hardcoded styling from AdminDashboard cards
   - Used by: Dashboard to render 5 summary cards (Total Leads, New This Week, Contacted, Qualified, Converted)
   - Pure presentational, no logic

2. **Create components/Table/DataTable.jsx**
   - Generic table component accepting `data`, `columns` config, `loading`, `pagination`
   - Column config structure:

     ```javascript
     { header: "Name", accessorKey: "full_name", sortable: true, width: "200px" }
     { header: "Status", render: (row) => <StatusBadge /> }
     { header: "Actions", render: (row) => <button>View</button> }
     ```

   - Handle: empty state, loading skeleton, sorting headers (client-side)
   - Replace LeadTable.jsx usage
   - Reusable for future features (Reports page, etc.)

3. **Create components/Badge/StatusBadge.jsx**
   - Props: `status` (string), `type` ('lead' | 'appointment')
   - Maps status → color via config objects (defined in utils/constants.js)
   - Lead statuses: new (blue), contacted (gray), qualified (yellow), converted (green), not_interested (red)
   - Appointment statuses: unbooked (gray), booked (blue), confirmed (green), completed (dark), cancelled (red)
   - No if/else duplication—use lookup maps

4. **Create components/Form/SelectField.jsx**
   - Props: `label`, `value`, `onChange`, `options`, `disabled`, `error`
   - Render label + select + error message
   - Used by: LeadDetailModal.jsx for status dropdowns
   - Controlled component pattern

5. **Create components/Form/TextField.jsx**
   - Props: `label`, `value`, `onChange`, `placeholder`, `disabled`, `type`, `error`
   - Similar structure to SelectField
   - Support textarea variant (`multiLine` prop)
   - For future note-taking feature

6. **Create components/Modal/Modal.jsx**
   - Props: `isOpen`, `onClose`, `title`, `children`, `maxWidth` (optional)
   - Reusable overlay + content wrapper
   - Handle ESC key to close
   - Replace inline modal styling in LeadDetailModal.jsx

7. **Create components/FilterBar.jsx**
   - Props: `filters` (config array), `values`, `onChange`
   - Filter config:

     ```javascript
     { key: "status", label: "Status", options: [{value: "all", label: "All"}, ...] }
     { key: "appointmentStatus", label: "Appointment", options: [...] }
     ```

   - Render multiple select dropdowns in a row
   - Extract filter logic from AdminDashboard.jsx
   - DRY solution—reusable for other pages

#### **Phase 2: Constants & Configuration**

1. **Create utils/constants.js**
   - Status color maps:

     ```javascript
     export const LEAD_STATUS_COLORS = { new: '#3b82f6', contacted: '#9ca3af', ... }
     export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'not_interested', 'converted']
     export const APPOINTMENT_STATUSES = ['unbooked', 'booked', 'confirmed', 'completed', 'cancelled']
     ```

   - Column definitions for DataTable:

     ```javascript
     export const leadsTableColumns = [
       { header: "Name", accessorKey: "full_name", sortable: true },
       { header: "Email", accessorKey: "email" },
       ...
     ]
     ```

   - Filter config for FilterBar
   - Pagination defaults: `ITEMS_PER_PAGE = 20`, `MAX_PAGES = 5`

2. **Create utils/formatters.js**
   - Pure functions: `formatDate(iso)`, `formatPhone(e164)`, `formatStatus(s)`, `formatCurrency(n)`
   - Used by table cells, modal display
   - Centralize date/time formatting (currently scattered throughout components)

#### **Phase 3: Service Layer Refactoring**

1. **Create services/leads.service.js**
    - Extract API calls from component logic
    - Functions:

      ```javascript
      async getLeads(adminPassword, { status, search, page, limit })
      async getLeadById(adminPassword, id)
      async updateLead(adminPassword, id, updates)
      async getStats(adminPassword)
      ```

    - Each function calls existing api.js functions
    - Centralized error handling: if status 401, clear auth
    - Retry logic for failed requests (optional, can add later)

#### **Phase 4: Custom Hooks**

1. **Create hooks/useModal.js**
    - Returns: `isOpen`, `onOpen()`, `onClose()`, `toggle()`
    - Used by LeadDetailModal, future modals
    - Pure state management

2. **Create hooks/useLeadsPaginated.js** (BONUS)
    - Custom hook encapsulating leads fetching + pagination logic
    - Returns: `leads`, `page`, `total`, `goPage(n)`, `loading`, `error`
    - Used by Dashboard page to reduce component complexity
    - Optional—implement if time allows

#### **Phase 5: Component Refactoring**

1. **Refactor components/LeadDetailModal.jsx**
    - Use new `<Modal>` component wrapper
    - Use `<SelectField>` for status dropdowns (instead of raw select elements)
    - Add controlled form state (via `useState`)
    - Extract status arrays to `constants.js`
    - Same API integration, same callbacks

2. **Refactor components/LeadTable.jsx → Replace with DataTable usage in AdminDashboard**
    - Delete hardcoded `<table>` HTML
    - Replace with `<DataTable columns={leadsTableColumns} data={leads} />`
    - Keep existing functionality (View button triggers modal)

3. **Refactor components/AdminDashboard.jsx**
    - Import `<StatsCard>` and render 5 cards in a grid
    - Import `<FilterBar>` and replace dual select dropdowns
    - Replace inline card styling with StatsCard components
    - Use leads.service.js for all API calls
    - Same state structure: `leads`, `stats`, `loading`, `filters`, `selectedLead`
    - Cleanup: remove duplicate styling, extract CSS to separate file if exceeds 100 lines

#### **Phase 6: Layout & Structure**

1. **Create layout/AdminLayout.jsx** (OPTIONAL - NOW)
    - Wrapper for admin pages
    - Props: `children`
    - Render top header + left sidebar (basic structure)
    - Can be enhanced later with dynamic nav

2. **Create layout/Sidebar.jsx** (OPTIONAL - NOW)
    - Config-driven nav items (from constants)
    - Props: `items` array, `activeRoute`
    - Display current route highlight
    - Future: add nested routes support

#### **Phase 7: Organize Features Directory**

1. **Reorganize existing components into features structure:**

    ```
    frontend/src/
    ├── features/
    │   ├── dashboard/
    │   │   ├── DashboardPage.jsx    (rename AdminDashboard.jsx)
    │   │   ├── components/
    │   │   │   └── LeadsChart.jsx   (NEW - Chart.js integration)
    │   │   └── styles/
    │   │       └── dashboard.css    (NEW - component-scoped)
    │   │
    │   └── leads/
    │       ├── LeadsPage.jsx        (NEW - future leads management page)
    │       └── LeadDetailsModal.jsx (refactored)
    │
    ├── components/                  (shared UI)
    │   ├── StatsCard.jsx
    │   ├── Table/DataTable.jsx
    │   ├── Modal/Modal.jsx
    │   ├── Badge/StatusBadge.jsx
    │   ├── Form/{SelectField,TextField}.jsx
    │   └── FilterBar.jsx
    │
    ├── hooks/
    │   ├── useModal.js
    │   ├── useLeadsPaginated.js (optional)
    │
    ├── services/
    │   ├── api.js              (existing, unchanged)
    │   └── leads.service.js    (NEW)
    │
    ├── utils/
    │   ├── constants.js        (NEW)
    │   ├── formatters.js       (NEW)
    │   ├── phone.js            (existing)
    │   └── tracking.js         (existing)
    │
    └── App.jsx                (update imports to new paths)
    ```

2. **Create features/dashboard/components/LeadsChart.jsx**
    - Props: `data` (array of {date, count}), `title`
    - Use Chart.js via chart library (e.g., `react-chartjs-2` wrapper)
    - Display line chart: leads over time (past 7 days)
    - Render in AdminDashboard below stats cards
    - Mock data: `[{date: '2025-02-20', count: 5}, ...]`

#### **Phase 8: Styling**

1. **Create features/dashboard/styles/dashboard.css**
    - Component-scoped layout for DashboardPage
    - Grid for StatsCard layout (5 cols responsive to 2 cols on mobile)
    - Chart container styling
    - FilterBar spacing
    - Button & select styling (can extend global)

2. **Update styles.css**
    - Add `.data-table` base styling (borders, padding, font sizes)
    - Add `.modal-overlay` and `.modal-content` classes (if not using inline)
    - Add `.badge` base + status variants (`.badge--new`, `.badge--converted`, etc.)
    - Add `.select-field`, `.text-field` form styles
    - Maintain existing design tokens (color vars, font families)

#### **Phase 9: Update App.jsx Routing**

1. **Update App.jsx imports**
    - Change `AdminDashboard` import to point to `features/dashboard/DashboardPage.jsx`
    - Ensure routes remain unchanged: `/admin/dashboard` still works
    - Page component wrapping can stay in App.jsx

#### **Phase 10: Verify & Integrate**

1. **Update services/api.js (if needed)**
    - Ensure it exports: `fetchLeads`, `getStats`, `updateLead`
    - No changes needed—existing functions sufficient

2. **Test integration points:**
    - Load AdminDashboard → stats display correctly
    - DataTable renders 50 leads
    - Filters change lead list (status + appointment status)
    - Click "View" → Modal opens, form controlled
    - Change status dropdown → PATCH request fires, table updates
    - No console errors or broken imports

---

### **Verification**

**Local Testing Checklist:**

1. `npm run dev` backend (`:4000`) + frontend (`:5173`)
2. Navigate to `/admin/login`, login with correct password
3. Dashboard loads stats + leads table
4. Filter by status "new" → table updates
5. Filter by appointment "booked" → table updates
6. Click "View" on lead → modal opens with all fields
7. Change lead status → PATCH request completes, modal + table both update
8. Change appointment status → same flow works
9. Open DevTools → no console errors
10. Chart renders on dashboard (if added)
11. All components have proper prop types in JSDoc comments

**Code Quality Checklist:**

- [ ] No hardcoded strings (use constants.js)
- [ ] No duplicated JSX (StatsCard, StatusBadge, SelectField reused)
- [ ] No duplicated styles (component-scoped CSS, global tokens)
- [ ] All api calls in leads.service.js
- [ ] All date/currency formatting in formatters.js
- [ ] Props passed correctly, callbacks named consistently (onStatusChange, onClose)
- [ ] Loading states show spinners or skeleton
- [ ] Error messages user-friendly and caught globally

**Component Dependency Graph:**

```
App.jsx
├─ AdminLogin.jsx (unchanged)
└─ features/dashboard/DashboardPage.jsx
   ├─ StatsCard (5x for stats)
   ├─ LeadsChart (optional, Chart.js)
   ├─ FilterBar (1x for filters)
   ├─ DataTable
   │  └─ StatusBadge (in cells)
   └─ LeadDetailsModal
      ├─ Modal
      ├─ SelectField (2x for status dropdowns)
      └─ StatusBadge (for display)
```

---

### **Decisions**

- **Chart Library**: Chart.js (acknowledged). Recommend `react-chartjs-2` wrapper for React integration. Defer advanced analytics to Phase 2 if needed.
- **CSS Approach**: Keep plain CSS + component-scoped files (existing pattern). No CSS Modules—avoids setup overhead for 3-day event.
- **Refactor vs New**: Refactor existing components by extracting reusables first, then enhancing. Maintains API compatibility, no routing changes.
- **Data Export**: Deferred. Dashboard prioritized. Can add CSV export via `papaparse` later.
- **State Management**: Keep hooks + prop drilling. No context/Redux—simpler for scope.
- **Error Handling**: Leverage existing try/catch pattern in components calling leads.service.js.
- **Real-time Updates**: Keep polling via `useEffect() → fetchLeads()` on mount. No WebSockets needed.
- **Mobile Responsiveness**: Flex layout for StatsCard grid, DataTable horizontal scroll on small screens (defer advanced table UX).
