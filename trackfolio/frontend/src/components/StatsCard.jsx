import React from "react";

export default function StatsCard({ stats }) {
  if (!stats) return null;
  const { total, byStatus } = stats;

  return (
    <div className="stats-card">
      <div className="stat-total">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total applications</span>
      </div>
      <div className="stat-breakdown">
        {Object.entries(byStatus).map(([status, count]) => (
          <div key={status} className={`stat-pill status-${status.toLowerCase()}`}>
            <span>{status}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
