import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcScore, getRank } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreBoard from '../components/ScoreBoard';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const q = questions[index];
  const total = questions.length;
  const score = calcScore(answers);

  const finish = (finalAnswers, reason) => {
    const finalScore = calcScore(finalAnswers);
    navigate('/result', {
      replace: true,
      state: {
        name: playerName.trim(),
        score: finalScore,
        rank: getRank(finalScore),
        correctCount: finalAnswers.filter((a) => a.correct).length,
        reason,
      },
    });
  };

  const goNext = () => {
    const correct = selected === q.answer;
    const newAnswers = [...answers, { id: q.id, level: q.level, correct }];
    if (!correct) {
      finish(newAnswers, selected === null ? 'timeout' : 'wrong');
      return;
    }
    if (index === total - 1) {
      finish(newAnswers, 'gold');
      return;
    }
    setAnswers(newAnswers);
    setIndex(index + 1);
    setStatus('answering');
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
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

  if (!q) return null;

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
        onChoose={choose}
      />
    </div>
  );
};

export default Play;
