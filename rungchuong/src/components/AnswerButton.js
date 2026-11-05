const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button
    className={`answer ${state}`}
    disabled={disabled || state === 'hidden'}
    onClick={onClick}
  >
    {state === 'hidden' ? '' : `${letter}. ${text}`}
  </button>
);

export default AnswerButton;
