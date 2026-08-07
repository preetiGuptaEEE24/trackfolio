import { Router } from "express";
import mongoose from "mongoose";
import Application, { STATUSES } from "../models/Application.js";
import auth from "../middleware/auth.js";

const router = Router();

router.use(auth);

// GET /api/applications?status=Applied&search=google
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = { user: req.userId };
    if (status && STATUSES.includes(status)) filter.status = status;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }
    const applications = await Application.find(filter).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/applications/stats
router.get("/stats", async (req, res) => {
  try {
    const counts = await Application.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const stats = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    counts.forEach((c) => (stats[c._id] = c.count));
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    res.json({ total, byStatus: stats });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { company, role, status, appliedDate, link, notes } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "company and role are required" });
    }
    const application = await Application.create({
      user: req.userId,
      company,
      role,
      status,
      appliedDate,
      link,
      notes,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
