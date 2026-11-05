import { EXTRA_TIME } from '../data';

const Helpers = ({ used, lifeActive, canUse, onFifty, onTime, onLife }) => (
  <div className="helpers">
    <button disabled={used.fifty || !canUse} onClick={onFifty}>
      Loại 1 đáp án
    </button>
    <button disabled={used.time || !canUse} onClick={onTime}>
      {`Thêm ${EXTRA_TIME} giây`}
    </button>
    <button disabled={used.life || !canUse} onClick={onLife}>
      {lifeActive ? 'Phao đang bật' : 'Phao cứu sinh'}
    </button>
  </div>
);

export default Helpers;
