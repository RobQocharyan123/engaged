import './Restaurant.css';

const Restaurant = () => {
  return (
    <div className="wedding">
      <p className="time">17 : 30</p>
      <p className="postProduction">Հարսանյաց հանդիսություն</p>
      <p className="place">Darling HALL ռեստորանային համալիր </p>
      <p className="adress">Գեղարքունիքի մարզ, ք. Սևան, Արա Գեղեցիկ 8</p>

      <button
        onClick={() =>
          window.open(
            'https://www.google.com/maps/dir/?api=1&destination=40.540467071351%2C44.963631566767',
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
