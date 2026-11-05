const History = ({ history, setHistory }) => {
  const sorted = [...history].sort((a, b) => b.score - a.score);
  const total = history.reduce((s, h) => s + h.score, 0);
  const max = history.reduce((m, h) => Math.max(m, h.score), 0);
  const avg = history.length ? Math.round(total / history.length) : 0;

  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử</h2>
        <p>Chưa có lượt chơi nào</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Lịch sử</h2>
      <p>{`Số lượt chơi: ${history.length}`}</p>
      <p>{`Điểm cao nhất: ${max}`}</p>
      <p>{`Điểm trung bình: ${avg}`}</p>
      <button onClick={() => setHistory([])}>Xóa lịch sử</button>
      <table>
        <thead>
          <tr>
            <th>Người chơi</th><th>Số câu đúng</th><th>Điểm</th>
            <th>Danh hiệu</th><th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.correctCount}</td>
              <td>{h.score}</td>
              <td>{h.rank}</td>
              <td>{h.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
