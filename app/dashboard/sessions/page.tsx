"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./sessions.module.css";
import { supabase } from "@/utils/supabaseClient";
import { generateQrCode } from "@/utils/qr";

type Course = {
  id: string;
  course_code: string;
  course_name: string;
};

type Teacher = {
  id: string;
  name: string | null;
  email: string | null;
};

type SessionRow = {
  id: string;
  course_id: string;
  teacher_id: string | null;
  session_date: string; // date
  session_time: string; // time
  venue: string | null;
  qr_code: string | null;
  qr_expiry: string | null;
};

type FormState = {
  course_id: string;
  teacher_id: string;
  session_date: string; // YYYY-MM-DD
  session_time: string; // HH:MM
  venue: string;
};

export default function SessionsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    course_id: "",
    teacher_id: "",
    session_date: "",
    session_time: "",
    venue: "",
  });

  // QR preview modal
  const [qrPreview, setQrPreview] = useState<{ src: string; title: string } | null>(null);

  const courseMap = useMemo(() => {
    const map: Record<string, Course> = {};
    courses.forEach((c) => (map[c.id] = c));
    return map;
  }, [courses]);

  const teacherMap = useMemo(() => {
    const map: Record<string, Teacher> = {};
    teachers.forEach((t) => (map[t.id] = t));
    return map;
  }, [teachers]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        // Courses
        const { data: cData, error: cErr } = await supabase
          .from("courses")
          .select("*")
          .order("course_code", { ascending: true });
        if (cErr) throw new Error(cErr.message);
        setCourses(cData || []);

        // Teachers
        const { data: tData, error: tErr } = await supabase
          .from("profiles")
          .select("id,name,email")
          .eq("role", "teacher")
          .order("name", { ascending: true });
        if (tErr) throw new Error(tErr.message);
        setTeachers(tData || []);

        // Sessions
        await refreshSessions();
      } catch (e: any) {
        setError(e?.message || "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  async function refreshSessions() {
    const { data: sData, error: sErr } = await supabase
      .from("sessions")
      .select("*")
      .order("session_date", { ascending: false })
      .order("session_time", { ascending: false });

    if (sErr) {
      setError(sErr.message);
    } else {
      setSessions(sData || []);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setForm({
      course_id: "",
      teacher_id: "",
      session_date: "",
      session_time: "",
      venue: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(s: SessionRow) {
    setEditingId(s.id);
    setForm({
      course_id: s.course_id || "",
      teacher_id: s.teacher_id || "",
      session_date: s.session_date || "",
      session_time: s.session_time?.slice(0, 5) || "", // trim seconds for input[type=time]
      venue: s.venue || "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setError(null);
  }

  async function handleSave() {
    // Basic validation
    if (!form.course_id || !form.session_date || !form.session_time) {
      setError("Please fill in Course, Date, and Time.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (editingId) {
        const { error: uErr } = await supabase
          .from("sessions")
          .update({
            course_id: form.course_id,
            teacher_id: form.teacher_id || null,
            session_date: form.session_date,
            session_time: form.session_time,
            venue: form.venue || null,
          })
          .eq("id", editingId);
        if (uErr) throw new Error(uErr.message);
      } else {
        const { error: iErr } = await supabase.from("sessions").insert([
          {
            course_id: form.course_id,
            teacher_id: form.teacher_id || null,
            session_date: form.session_date,
            session_time: form.session_time,
            venue: form.venue || null,
          },
        ]);
        if (iErr) throw new Error(iErr.message);
      }

      await refreshSessions();
      closeModal();
    } catch (e: any) {
      setError(e?.message || "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this session?")) return;
    setBusy(true);
    setError(null);
    try {
      const { error: dErr } = await supabase.from("sessions").delete().eq("id", id);
      if (dErr) throw new Error(dErr.message);
      await refreshSessions();
    } catch (e: any) {
      setError(e?.message || "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  function isQrActive(qr_expiry: string | null) {
    if (!qr_expiry) return false;
    const now = new Date();
    const exp = new Date(qr_expiry);
    return now <= exp;
  }

  async function handleGenerateQr(sessionId: string) {
    setBusy(true);
    setError(null);
    try {
      await generateQrCode(sessionId, 15); // 15-minute validity
      await refreshSessions();
    } catch (e: any) {
      setError(e?.message || "QR generation failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className={styles.container}>Loading sessions…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sessions</h1>

      {error && (
        <div style={{ marginBottom: "1rem", color: "#b91c1c", fontWeight: 500 }}>
          {error}
        </div>
      )}

      <button
        className={`${styles.button} ${styles["button-add"]}`}
        onClick={openCreateModal}
        disabled={busy}
      >
        + New Session
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Course</th>
            <th>Teacher</th>
            <th>Venue</th>
            <th>QR</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: "1rem", color: "#6b7280" }}>
                No sessions yet.
              </td>
            </tr>
          )}
          {sessions.map((s) => {
            const c = courseMap[s.course_id];
            const t = s.teacher_id ? teacherMap[s.teacher_id] : null;
            const active = isQrActive(s.qr_expiry);
            return (
              <tr key={s.id}>
                <td>{s.session_date}</td>
                <td>{s.session_time}</td>
                <td>{c ? `${c.course_code} — ${c.course_name}` : s.course_id}</td>
                <td>{t?.name ?? "—"}</td>
                <td>{s.venue ?? "—"}</td>
                <td>
                  {s.qr_code ? (
                    <>
                      <span style={{ marginRight: "0.5rem", fontWeight: 600 }}>
                        {active ? "Active" : "Expired"}
                      </span>
                      <button
                        className={styles.button}
                        onClick={() =>
                          setQrPreview({
                            src: s.qr_code as string,
                            title: `QR for ${c ? c.course_code : "Session"}`,
                          })
                        }
                      >
                        View
                      </button>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      className={`${styles.button} ${styles["button-qr"]}`}
                      onClick={() => handleGenerateQr(s.id)}
                      disabled={busy}
                    >
                      {s.qr_code ? "Regenerate QR" : "Generate QR"}
                    </button>
                    <button
                      className={`${styles.button} ${styles["button-edit"]}`}
                      onClick={() => openEditModal(s)}
                      disabled={busy}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.button} ${styles["button-delete"]}`}
                      onClick={() => handleDelete(s.id)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Session" : "New Session"}</h3>

            <label>Course</label>
            <select
              value={form.course_id}
              onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}
            >
              <option value="">Select a course…</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_code} — {c.course_name}
                </option>
              ))}
            </select>

            <label>Teacher (optional)</label>
            <select
              value={form.teacher_id}
              onChange={(e) => setForm((f) => ({ ...f, teacher_id: e.target.value }))}
            >
              <option value="">No teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || t.email}
                </option>
              ))}
            </select>

            <label>Date</label>
            <input
              type="date"
              value={form.session_date}
              onChange={(e) => setForm((f) => ({ ...f, session_date: e.target.value }))}
            />

            <label>Time</label>
            <input
              type="time"
              value={form.session_time}
              onChange={(e) => setForm((f) => ({ ...f, session_time: e.target.value }))}
            />

            <label>Venue</label>
            <input
              type="text"
              placeholder="e.g., Room B1"
              value={form.venue}
              onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
            />

            {error && (
              <div style={{ marginTop: "0.75rem", color: "#b91c1c", fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div className={styles["modal-actions"]}>
              <button className={styles.button} onClick={closeModal} disabled={busy}>
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles["button-add"]}`}
                onClick={handleSave}
                disabled={busy}
              >
                {editingId ? "Save Changes" : "Create Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Preview Modal */}
      {qrPreview && (
        <div className={styles.modal} onClick={() => setQrPreview(null)}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <h3>{qrPreview.title}</h3>
            <div style={{ textAlign: "center" }}>
              {/* Data URL image */}
              <img
                src={qrPreview.src}
                alt="QR Code"
                style={{ width: "260px", height: "260px", objectFit: "contain" }}
              />
            </div>
            <div className={styles["modal-actions"]}>
              <button className={styles.button} onClick={() => setQrPreview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
