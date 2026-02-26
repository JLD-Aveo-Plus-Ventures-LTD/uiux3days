import "./styles/AssetPlaceholder.css";

const AssetPlaceholder = ({ label, aspect = "16 / 9", className = "" }) => {
    return (
        <div
            className={`asset-placeholder ${className}`.trim()}
            style={{ aspectRatio: aspect }}
            role="img"
            aria-label={label}
        >
            <span className="asset-placeholder-label">{label}</span>
        </div>
    );
};

export default AssetPlaceholder;
