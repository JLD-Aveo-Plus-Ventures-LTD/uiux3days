/**
 * TextField - Reusable form text input & textarea component
 * 
 * Renders a labeled input or textarea with optional error state
 * Fully controlled component
 * 
 * @component
 * @example
 * <TextField label="Email" type="email" value={email} onChange={handleChange} />
 * <TextField label="Notes" multiLine rows={4} value={notes} onChange={handleChange} />
 */

function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  type = "text",
  error = null,
  name = "",
  multiLine = false,
  rows = 4,
}) {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    disabled,
    placeholder,
    style: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: "6px",
      border: error ? "1px solid #dc2626" : "1px solid #cbd5e1",
      fontSize: "14px",
      fontFamily: "inherit",
      opacity: disabled ? 0.6 : 1,
      marginTop: label ? "4px" : 0,
    },
  };

  return (
    <div className="form-field">
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
        </label>
      )}
      {multiLine ? (
        <textarea {...inputProps} rows={rows} className="form-field__textarea" />
      ) : (
        <input
          {...inputProps}
          type={type}
          className="form-field__input"
        />
      )}
      {error && (
        <p className="form-field__error" style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default TextField;
