import AnswerButton from './AnswerButton';
import { LEVELS, LETTERS } from '../data';

const QuestionCard = ({ question, number, total, status, selected, hidden, onChoose }) => {
  const getState = (i) => {
    if (hidden.includes(i)) return 'hidden';
    if (status === 'locked' && selected === i) return 'chosen';
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  return (
    <div className="card">
      <p className="meta">{`Câu ${number}/${total} · ${question.topic} · ${LEVELS[question.level]}`}</p>
      <h2>{question.question}</h2>
      <div className="answers">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={opt}
            state={getState(i)}
            disabled={status !== 'answering'}
            onClick={() => onChoose(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
