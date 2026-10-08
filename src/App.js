import { useState } from "react";
import "./App.css";

const badge = (s) => (s >= 8 ? "good" : s < 5 ? "fail" : "normal");

const StudentItem = ({ student: { id, name, score, class: cls }, onDelete }) => (
  <tr>
    <td>{id}</td>
    <td>{name}</td>
    <td><span className={`badge ${badge(score)}`}>{score.toFixed(1)}</span></td>
    <td>{cls}</td>
    <td><button className="btn danger" onClick={() => onDelete(id)}>Xóa</button></td>
  </tr>
);

const StudentList = ({ students, onDelete }) =>
  students.length === 0 ? (
    <p className="empty">Không có sinh viên nào.</p>
  ) : (
    <table>
      <thead>
        <tr><th>ID</th><th>Họ tên</th><th>Điểm</th><th>Lớp</th><th>Hành động</th></tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <StudentItem key={s.id} student={s} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );

const StudentForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", score: "", cls: "" });
  const [error, setError] = useState("");
  const { name, score, cls } = form;

  const handleChange = ({ target: { name: key, value } }) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(score);
    if (!name.trim() || !cls.trim() || score === "")
      return setError("Vui lòng nhập đầy đủ thông tin.");
    if (Number.isNaN(num) || num < 0 || num > 10)
      return setError("Điểm số phải nằm trong khoảng từ 0 đến 10.");

    onAdd({ name: name.trim(), score: num, class: cls.trim() });
    setForm({ name: "", score: "", cls: "" });
    setError("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Họ tên" value={name} onChange={handleChange} />
      <input name="score" type="number" step="0.1" placeholder="Điểm số" value={score} onChange={handleChange} />
      <input name="cls" placeholder="Lớp" value={cls} onChange={handleChange} />
      <button className="btn primary" type="submit">Thêm</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

const filters = [
  { key: "all", label: "Tất cả", test: () => true },
  { key: "good", label: "Giỏi (≥ 8)", test: (s) => s >= 8 },
  { key: "fail", label: "Trượt môn (< 5)", test: (s) => s < 5 },
];

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn An", score: 8.5, class: "B25DCQCC01" },
    { id: 2, name: "Trần Thị Bình", score: 4.5, class: "B25DCQCC01" },
    { id: 3, name: "Lê Hoàng Cường", score: 7, class: "B25DCQCC01" },
  ]);
  const [filter, setFilter] = useState("all");

  const total = students.length;
  const average = total ? students.reduce((sum, { score }) => sum + score, 0) / total : 0;
  const { test } = filters.find((f) => f.key === filter);
  const shown = students.filter(({ score }) => test(score));

  const handleAdd = (s) =>
    setStudents((prev) => [
      ...prev,
      { id: Math.max(0, ...prev.map(({ id }) => id)) + 1, ...s },
    ]);

  const handleDelete = (id) =>
    setStudents((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="app" translate="no">
      <h1>🎓 Quản lý Điểm Sinh viên</h1>

      <div className="card">
        <StudentForm onAdd={handleAdd} />
      </div>

      <div className="card stats">
        <div>Tổng số sinh viên<span>{total}</span></div>
        <div>Điểm trung bình lớp<span>{average.toFixed(2)}</span></div>
      </div>

      <div className="card">
        <div className="filters">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              className={`btn filter ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <StudentList students={shown} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default App;