import './Wedding.css';

const Wedding = () => {
  return (
    <div className="wedding">
      <p className="time">14 : 30</p>
      <p className="postProduction">Պսաակդրություն</p>
      <p className="place">Սաղմոսավանք</p>
      <p className="adress">
        Արագածոտնի մարզ, <br /> գ․ Սաղմոսավան
      </p>

      <button
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
    </div>
  );
};

export default Wedding;
