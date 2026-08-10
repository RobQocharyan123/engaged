import './Wedding.css';

const Wedding = () => {
  return (
    <section className="wedding" aria-label="Պսակադրություն">
      <p className="time">14 : 30</p>
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
