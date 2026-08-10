import './Restaurant.css';

const Restaurant = () => {
  return (
    <section className="restaurant" aria-label="Հարսանյաց հանդիսություն">
      <p className="time">17 : 30</p>
      <p className="postProduction">Հարսանյաց հանդիսություն</p>
      <p className="place">Darling HALL ռեստորանային համալիր </p>
      <p className="adress">Գեղարքունիքի մարզ, ք. Սևան, Արա Գեղեցիկ 8</p>

      <button
        type="button"
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
    </section>
  );
};

export default Restaurant;
