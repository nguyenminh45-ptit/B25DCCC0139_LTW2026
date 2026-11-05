import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION, EXTRA_TIME } from '../data';
import { calcScore, getRank } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';
import Helpers from '../components/Helpers';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [used, setUsed] = useState({ fifty: false, time: false, life: false });
  const [lifeActive, setLifeActive] = useState(false);

  const q = questions[index];
  const total = questions.length;
  const score = calcScore(answers);

  const finish = (finalAnswers, reason) => {
    const finalScore = calcScore(finalAnswers);
    const rank = getRank(finalScore);
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const name = playerName.trim();
    onFinish({
      id: Date.now(),
      name,
      score: finalScore,
      rank,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
    navigate('/result', {
      replace: true,
      state: { name, score: finalScore, rank, correctCount, reason },
    });
  };

  const goNext = () => {
    const correct = selected === q.answer;
    const saved = !correct && lifeActive;
    const newAnswers = [...answers, { id: q.id, level: q.level, correct, saved }];
    if (!correct && !saved) {
      finish(newAnswers, selected === null ? 'timeout' : 'wrong');
      return;
    }
    if (index === total - 1) {
      finish(newAnswers, newAnswers.every((a) => a.correct) ? 'gold' : 'done');
      return;
    }
    setAnswers(newAnswers);
    setIndex(index + 1);
    setStatus('answering');
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setHidden([]);
    setLifeActive(false);
  };

  const choose = (i) => {
    setSelected(i);
    setStatus('locked');
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [status, index]);

  // Hết giờ -> lộ đáp án ngay
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) setStatus('revealed');
  }, [timeLeft, status]);

  // Các bước chờ: locked (2s) -> revealed; revealed (1,5s) -> câu tiếp / kết thúc
  useEffect(() => {
    if (status === 'answering') return;
    const delay = status === 'locked' ? 2000 : 1500;
    const t = setTimeout(() => {
      if (status === 'locked') setStatus('revealed');
      else goNext();
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Phím tắt 1-4
  useEffect(() => {
    const handleKey = (e) => {
      const i = ['1', '2', '3', '4'].indexOf(e.key);
      if (i === -1 || status !== 'answering' || hidden.includes(i)) return;
      setSelected(i);
      setStatus('locked');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, hidden]);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} – ${score} điểm`;
  }, [index, total, score]);
  useEffect(() => () => { document.title = 'Rung chuông vàng'; }, []);

  if (!q) return null;

  const handleFifty = () => {
    const wrongs = [0, 1, 2, 3].filter((i) => i !== q.answer);
    setHidden([wrongs[Math.floor(Math.random() * wrongs.length)]]);
    setUsed({ ...used, fifty: true });
  };
  const handleTime = () => {
    setTimeLeft((t) => t + EXTRA_TIME);
    setUsed({ ...used, time: true });
  };
  const handleLife = () => {
    setLifeActive(true);
    setUsed({ ...used, life: true });
  };

  return (
    <div className="play">
      <ScoreBoard score={score} answers={answers} index={index} total={total} />
      <Timer timeLeft={timeLeft} />
      <QuestionCard
        question={q}
        number={index + 1}
        total={total}
        status={status}
        selected={selected}
        hidden={hidden}
        onChoose={choose}
      />
      <Helpers
        used={used}
        lifeActive={lifeActive}
        canUse={status === 'answering'}
        onFifty={handleFifty}
        onTime={handleTime}
        onLife={handleLife}
      />
    </div>
  );
};

export default Play;
