import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const best = history.reduce(
    (b, h) => (!b || h.score > b.score ? h : b),
    null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) navigate('/play');
  };

  return (
    <div className="home">
      <h1>Rung chuông vàng</h1>
      <ul>
        <li>15 câu hỏi HTML, CSS, JavaScript, React; mỗi câu 20 giây.</li>
        <li>Dễ 10 điểm, Trung bình 20 điểm, Khó 30 điểm.</li>
        <li>Trả lời sai hoặc hết giờ là bị loại, giữ nguyên số điểm đã có.</li>
        <li>Đúng cả 15 câu: rung chuông vàng với 300 điểm.</li>
        <li>Có 3 quyền trợ giúp, mỗi quyền dùng một lần.</li>
      </ul>
      {best && <p className="record">{`Kỷ lục: ${best.score} điểm – ${best.name}`}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </label>
        <button type="submit" disabled={!playerName.trim()}>Vào thi</button>
      </form>
    </div>
  );
};

export default Home;
