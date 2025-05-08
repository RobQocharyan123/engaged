import './InfoPage.css';

const InfoPage = () => {
  return (
    <div className="infoPage">
      {' '}
      <p className="friendsText">
        Ընկերներ & <br /> Բարեկամներ
      </p>
      <p className="wishes">
        Մեր կյանքում կարևոր իրադարձություն է սպասվում։ Մենք ընտանիք ենք կազմում
        և ցանկանում ենք Ձեզ հետ կիսել մեր կյանքի լուսավոր օրը։
      </p>
      <p className="wishes">Հրավիրում ենք Ձեզ մեր հարսանիքին։</p>
      <p className="friendsText">
        18 Հուլիսի <br />
        2025
      </p>
      <div className="line"></div>
    </div>
  );
};

export default InfoPage;
