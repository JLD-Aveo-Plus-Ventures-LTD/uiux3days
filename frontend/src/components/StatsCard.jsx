/**
 * StatsCard - Reusable statistics card component
 * 
 * Displays a single stat with title, value, and optional styling
 * 
 * @component
 * @example
 * <StatsCard title="Total Leads" value="142" color="#22c55e" />
 */

function StatsCard({ title, value, color = "#0ea5e9", icon, trend }) {
  return (
    <div
      className="stats-card"
      style={{
        backgroundColor: color,
      }}
    >
      {icon && <p className="stats-card__icon">{icon}</p>}
      <div className="stats-card__content">
        <p className="stats-card__title">
          {title}
        </p>
        <p className="stats-card__value">
          {value}
        </p>
        {trend && <p className="stats-card__trend">{trend}</p>}
      </div>
    </div>
  );
}

export default StatsCard;
