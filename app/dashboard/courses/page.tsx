"use client";

import { useEffect, useState } from "react";
import { getAllCourses, createCourse, updateCourse, deleteCourse, Course } from "../../../utils/courses";
import styles from "./courses.module.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ course_code: "", course_name: "" });

  // Fetch courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await getAllCourses();
    setCourses(data || []);
    setLoading(false);
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setForm({ course_code: course.course_code, course_name: course.course_name });
    } else {
      setEditingCourse(null);
      setForm({ course_code: "", course_name: "" });
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingCourse) {
      await updateCourse(editingCourse.id!, form);
    } else {
      await createCourse(form);
    }
    setShowModal(false);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(id);
      fetchCourses();
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Courses</div>
      <button className={`${styles.button} ${styles["button-add"]}`} onClick={() => openModal()}>
        Add Course
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.course_code}</td>
              <td>{course.course_name}</td>
              <td>
                <button className={`${styles.button} ${styles["button-edit"]}`} onClick={() => openModal(course)}>Edit</button>
                <button className={`${styles.button} ${styles["button-delete"]}`} onClick={() => handleDelete(course.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>

            <label>Course Code</label>
            <input name="course_code" value={form.course_code} onChange={handleChange} disabled={!!editingCourse} />

            <label>Course Name</label>
            <input name="course_name" value={form.course_name} onChange={handleChange} />

            <div className={styles["modal-actions"]}>
              <button className={styles.button} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.button} onClick={handleSubmit}>{editingCourse ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
