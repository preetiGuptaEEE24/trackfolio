import React, { useState, useEffect } from "react";

const STATUSES = ["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"];

const emptyForm = {
  company: "",
  role: "",
  status: "Applied",
  appliedDate: new Date().toISOString().slice(0, 10),
  link: "",
  notes: "",
};

export default function ApplicationForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        appliedDate: initialData.appliedDate
          ? new Date(initialData.appliedDate).toISOString().slice(0, 10)
          : emptyForm.appliedDate,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Company
          <input name="company" value={form.company} onChange={handleChange} required />
        </label>
        <label>
          Role
          <input name="role" value={form.role} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Applied date
          <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} />
        </label>
      </div>
      <label>
        Job link
        <input name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
      </label>
      <label>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
      </label>
      <div className="form-actions">
        <button type="submit">{initialData ? "Save changes" : "Add application"}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
