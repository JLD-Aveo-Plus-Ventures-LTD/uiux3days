# Frontend Directory Structure

This document describes the organized folder structure after Phase 7

src/
│
├── App.jsx                              (Router wrapper)
├── AppContent.jsx                       (Routing logic with auth)
│
├── components/                          (Shared reusable UI)
│   ├── index.js                        (Centralized exports)
│   ├── StatsCard.jsx
│   ├── FilterBar.jsx
│   ├── Table/
│   │   └── DataTable.jsx
│   ├── Modal/
│   │   └── Modal.jsx
│   ├── Badge/
│   │   └── StatusBadge.jsx
│   ├── Form/
│   │   ├── SelectField.jsx
│   │   └── TextField.jsx
│   ├── LandingPage.jsx                 (Public page - TODO: move to features/landing)
│   ├── AdminLogin.jsx                  (Admin page - TODO: move to features/auth)
│   ├── AdminDashboard.jsx              (Dashboard logic - uses leads components)
│   ├── BookingPage.jsx                 (Public page - TODO: move to features/booking)
│   └── sections/
│       ├── [Legacy components - consider moving/refactoring]
│       └── styles/
│
├── layout/                              (Layout wrappers)
│   ├── AdminLayout.jsx
│   ├── AdminLayout.css
│   ├── Sidebar.jsx
│   └── Sidebar.css
│
├── features/                            (Feature modules - organized by domain)
│   │
│   ├── dashboard/                       (Dashboard feature)
│   │   ├── DashboardPage.jsx           (Feature page - used in routing)
│   │   ├── components/                 (Feature-specific components)
│   │   │   └── LeadsChart.jsx          (Future: Chart.js integration)
│   │   └── styles/
│   │       └── dashboard.css
│   │
│   └── leads/                           (Leads management feature)
│       ├── index.js                    (Centralized exports)
│       ├── LeadsPage.jsx               (Feature page - future development)
│       ├── LeadTable.jsx               (Display leads table)
│       └── LeadDetailModal.jsx         (Edit/view lead details)
│
├── hooks/                               (Custom React hooks)
│   ├── useModal.js                     (Modal state management)
│   └── useLeadsPaginated.js            (Pagination + filtering logic)
│
├── services/                            (API/Business logic layer)
│   ├── api.js                          (HTTP client - existing)
│   └── leads.service.js                (Leads API wrapper)
│
├── utils/                               (Utility functions)
│   ├── constants.js                    (Config objects, enums)
│   ├── formatters.js                   (Data formatting functions)
│   ├── phone.js                        (Phone handling - existing)
│   └── tracking.js                     (Analytics - existing)
│
└── styles.css                           (Global styles - existing)

═══════════════════════════════════════════════════════════════════════

ORGANIZATION PRINCIPLES
═══════════════════════════════════════════════════════════════════════

1. COMPONENTS (src/components/)
   ├─ Reusable UI components (not domain-specific)
   ├─ Can be used anywhere in the app
   ├─ Examples: StatsCard, DataTable, Modal, FilterBar
   └─ Exports available via index.js

2. FEATURES (src/features/)
   ├─ Domain-specific functionality
   ├─ Dashboard: Display lead stats and table
   ├─ Leads: Manage leads data (future)
   ├─ Each feature has its own folder
   ├─ Each feature folder contains:
   │  ├─ FeaturePage.jsx (routed page component)
   │  ├─ Feature-specific components
   │  ├─ Feature-specific styles
   │  └─ index.js (optional, for exports)
   └─ Exports available via feature/index.js

3. LAYOUT (src/layout/)
   ├─ Page layout wrappers
   ├─ AdminLayout: Sidebar + header + content
   ├─ Sidebar: Navigation config-driven
   └─ Styles scoped per component

4. SERVICES (src/services/)
   ├─ API communication layer
   ├─ Business logic wrappers
   ├─ Error handling & transformation
   └─ Decouples components from API calls

5. HOOKS (src/hooks/)
   ├─ Reusable logic (not UI)
   ├─ State management helpers
   ├─ Examples: useModal, useLeadsPaginated
   └─ Can be used in any component

6. UTILS (src/utils/)
   ├─ Pure functions & constants
   ├─ Business domain enums (statuses, options)
   ├─ Formatting & transformation functions
   ├─ No side effects
   └─ Resusable across all code

═══════════════════════════════════════════════════════════════════════

IMPORT PATTERNS
═══════════════════════════════════════════════════════════════════════

From Features:
─────────────
import { LeadTable } from "../features/leads";
import LeadsPage from "../features/leads/LeadsPage.jsx";
import DashboardPage from "../features/dashboard/DashboardPage.jsx";

From Shared Components:
──────────────────────
import { StatsCard, DataTable, Modal } from "../components";
// OR
import StatsCard from "../components/StatsCard.jsx";

From Services:
──────────────
import { getLeads, updateLead } from "../services/leads.service.js";

From Hooks:
───────────
import useModal from "../hooks/useModal.js";
import useLeadsPaginated from "../hooks/useLeadsPaginated.js";

From Utils:
───────────
import { LEAD_STATUSES, STATS_CARD_CONFIG } from "../utils/constants.js";
import { formatDate, formatPhone } from "../utils/formatters.js";

═══════════════════════════════════════════════════════════════════════

FUTURE IMPROVEMENTS
═══════════════════════════════════════════════════════════════════════

1. Move public pages to features:
   ├─ features/landing/LandingPage.jsx
   ├─ features/booking/BookingPage.jsx
   ├─ features/auth/AdminLogin.jsx
   └─ Update routing accordingly

2. Add more features:
   ├─ features/reports/ (analytics dashboards)
   ├─ features/settings/ (admin settings)
   └─ features/analytics/ (detailed analytics)

3. Enhance dashboard feature:
   ├─ features/dashboard/components/LeadsChart.jsx (Chart.js)
   ├─ features/dashboard/components/ConversionFunnel.jsx
   ├─ features/dashboard/components/RecentActivity.jsx
   └─ features/dashboard/styles/charts.css

4. Extract more domain models:
   ├─ services/reports.service.js
   ├─ services/settings.service.js
   └─ services/auth.service.js (replace inline logic)

5. Add type safety:
   ├─ types/index.ts or types.js
   ├─ type Lead = { id, full_name, email, ... }
   ├─ Export types for use across codebase
   └─ Use JSDoc @typedef or TypeScript

═══════════════════════════════════════════════════════════════════════
*/
