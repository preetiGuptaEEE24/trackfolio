import React, { useEffect, useState, useCallback } from "react";
import { applicationsApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatsCard from "../components/StatsCard.jsx";
import ApplicationForm from "../components/ApplicationForm.jsx";
import ApplicationList from "../components/ApplicationList.jsx";

const STATUSES = ["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"];

export default function Dashboard() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      const query = params.toString() ? `?${params.toString()}` : "";

      const [apps, statsData] = await Promise.all([
        applicationsApi.list(token, query),
        applicationsApi.stats(token),
      ]);
      setApplications(apps);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    }
  }, [token, statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(form) {
    try {
      if (editing) {
        await applicationsApi.update(token, editing._id, form);
      } else {
        await applicationsApi.create(token, form);
      }
      setEditing(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this application?")) return;
    try {
      await applicationsApi.remove(token, id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <StatsCard stats={stats} />

      {error && <p className="error">{error}</p>}

      <section className="form-section">
        <h2>{editing ? "Edit application" : "Add application"}</h2>
        <ApplicationForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={editing ? () => setEditing(null) : null}
        />
      </section>

      <section className="list-section">
        <div className="filters">
          <input
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <ApplicationList applications={applications} onEdit={setEditing} onDelete={handleDelete} />
      </section>
    </div>
  );
}
