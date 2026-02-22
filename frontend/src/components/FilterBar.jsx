/**
 * FilterBar - Reusable filter component with multiple select dropdowns
 * 
 * Renders filters dynamically from configuration
 * Fully controlled component
 * 
 * Filter config example:
 * {
 *   key: "status",
 *   label: "Status",
 *   options: [{value: "all", label: "All"}, {value: "new", label: "New"}]
 * }
 * 
 * @component
 * @example
 * <FilterBar
 *   filters={filterConfig}
 *   values={{status: "all", appointmentStatus: "all"}}
 *   onChange={(key, value) => setFilters({...filters, [key]: value})}
 * />
 */

function FilterBar({ filters = [], values = {}, onChange }) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className="filter-bar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        padding: "12px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        marginBottom: "16px",
        alignItems: "flex-end",
      }}
    >
      {filters.map((filter) => (
        <div key={filter.key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {filter.label && (
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              {filter.label}
            </label>
          )}
          <select
            value={values[filter.key] || "all"}
            onChange={(e) => onChange(filter.key, e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              minWidth: "140px",
            }}
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default FilterBar;
