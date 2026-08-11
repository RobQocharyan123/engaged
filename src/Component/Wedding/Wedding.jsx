import './Wedding.css';
import { formatWeddingDate } from '../../utils/weddingDate';

const Wedding = ({ weddingDate }) => {
  const formattedDate = formatWeddingDate(weddingDate);
  return (
    <section className="wedding" aria-label="Պսակադրություն">
      <p className="time">{formattedDate?.time || '—'}</p>
      <p className="postProduction">Պսակադրություն</p>
      <p className="place">Սաղմոսավանք</p>
      <p className="adress">
        Արագածոտնի մարզ, <br /> գ․ Սաղմոսավան
      </p>

      <button
        type="button"
        className="map-button"
        onClick={() =>
          window.open(
            'https://www.google.com/maps/dir/?api=1&destination=Saghmosavank',
            '_blank',
            'noopener,noreferrer'
          )
        }
      >
        ինչպես հասնել
      </button>
    </section>
  );
};

export default Wedding;
