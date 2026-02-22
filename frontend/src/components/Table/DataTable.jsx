/**
 * DataTable - Generic, reusable data table component
 * 
 * Accepts flexible column configuration to render any data structure
 * Supports sorting, loading states, and empty states
 * 
 * Column config example:
 * {
 *   header: "Name",
 *   accessorKey: "full_name",
 *   sortable: true,
 *   width: "200px",
 *   render: (value, row) => <CustomElement value={value} />
 * }
 * 
 * @component
 * @example
 * <DataTable
 *   data={leads}
 *   columns={leadsColumns}
 *   loading={isLoading}
 * />
 */

import { useState } from "react";

function DataTable({
  data = [],
  columns = [],
  loading = false,
  onRowClick = null,
  emptyState = "No data available",
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle column sorting
  const handleSort = (column) => {
    if (!column.sortable) return;

    let direction = "asc";
    if (sortConfig.key === column.accessorKey && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key: column.accessorKey, direction });
  };

  // Apply sorting to data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  if (loading) {
    return (
      <div className="card" style={{ padding: "24px", textAlign: "center" }}>
        <p>Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card" style={{ padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>{emptyState}</p>
      </div>
    );
  }

  return (
    <div className="card data-table">
      <div className="data-table__scroll">
        <table className="table" style={{ width: "100%" }}>
          <thead style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(column)}
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: column.sortable ? "pointer" : "default",
                    userSelect: "none",
                    width: column.width,
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {column.header}
                    {column.sortable && sortConfig.key === column.accessorKey && (
                      <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(row)}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#1f2937",
                      width: column.width,
                    }}
                  >
                    {column.render
                      ? column.render(row[column.accessorKey], row)
                      : row[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
