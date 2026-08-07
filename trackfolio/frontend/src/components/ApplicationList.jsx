import React from "react";

export default function ApplicationList({ applications, onEdit, onDelete }) {
  if (applications.length === 0) {
    return <p className="empty-state">No applications yet — add your first one above.</p>;
  }

  return (
    <table className="app-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Status</th>
          <th>Applied</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app._id}>
            <td>{app.link ? <a href={app.link} target="_blank" rel="noreferrer">{app.company}</a> : app.company}</td>
            <td>{app.role}</td>
            <td>
              <span className={`status-badge status-${app.status.toLowerCase()}`}>{app.status}</span>
            </td>
            <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
            <td className="row-actions">
              <button onClick={() => onEdit(app)}>Edit</button>
              <button onClick={() => onDelete(app._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
