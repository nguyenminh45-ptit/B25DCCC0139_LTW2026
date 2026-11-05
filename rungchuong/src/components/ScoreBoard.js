const ScoreBoard = ({ score, answers, index, total }) => (
  <div className="scoreboard">
    <p className="score">{`Điểm: ${score}`}</p>
    <div className="cells">
      {Array.from({ length: total }, (_, i) => {
        let cls = 'cell';
        if (answers[i] && answers[i].correct) cls += ' ok';
        if (i === index) cls += ' current';
        return <span key={i} className={cls}>{i + 1}</span>;
      })}
    </div>
  </div>
);

export default ScoreBoard;
