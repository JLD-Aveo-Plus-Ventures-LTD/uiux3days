/**
 * SelectField - Reusable form select field component
 * 
 * Renders a labeled select dropdown with optional error state
 * Fully controlled component
 * 
 * @component
 * @example
 * <SelectField
 *   label="Status"
 *   value={status}
 *   onChange={(e) => setStatus(e.target.value)}
 *   options={[{value: "new", label: "New"}]}
 * />
 */

function SelectField({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  error = null,
  name = "",
}) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-field__select ${error ? "form-field__select--error" : ""}`}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "6px",
          border: error ? "1px solid #dc2626" : "1px solid #cbd5e1",
          fontSize: "14px",
          fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          marginTop: label ? "4px" : 0,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="form-field__error" style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectField;
