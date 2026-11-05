import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const HEADLINES = {
  gold: 'Chúc mừng! Bạn đã rung chuông vàng (đúng cả 15 câu)',
  wrong: 'Bạn đã bị loại (trả lời sai)',
  timeout: 'Hết giờ!',
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="result">
      <h2>{HEADLINES[state.reason]}</h2>
      <p>{`Người chơi: ${state.name}`}</p>
      <p>{`Số câu trả lời đúng: ${state.correctCount}`}</p>
      <p>{`Điểm: ${state.score}`}</p>
      <p>{`Danh hiệu: ${state.rank}`}</p>
      <div className="row">
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;
