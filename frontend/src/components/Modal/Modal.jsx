/**
 * Modal - Reusable modal/dialog wrapper component
 * 
 * Renders a centered modal with overlay, handles ESC key to close
 * Fully controlled via isOpen prop
 * 
 * @component
 * @example
 * <Modal isOpen={true} onClose={handleClose} title="Lead Details">
 *   <form>...</form>
 * </Modal>
 */

import { useEffect } from "react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "600px",
  closeButtonLabel,
  closeButtonStyle,
}) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal__overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal__content"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          maxWidth,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {title && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={
                closeButtonLabel
                  ? closeButtonStyle || {
                      padding: "8px 16px",
                      backgroundColor: "#33AA28",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      lineHeight: "1",
                    }
                  : {
                      background: "none",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                      padding: "0",
                      color: "#6b7280",
                      lineHeight: "1",
                    }
              }
              aria-label="Close modal"
            >
              {closeButtonLabel || "×"}
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;
