import './Restaurant.css';

const Restaurant = () => {
  return (
    <div className="wedding">
      <p className="time">17 : 30</p>
      <p className="postProduction">Հարսանյաց հանդիսություն</p>
      <p className="place">Florence ռեստորանային համալիր </p>
      <p className="adress">ք․ Երևան, Բարբյուսի 64/2</p>

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

export default Restaurant;
