import { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [firstOption, setFirstOption] = useState('');
  const [name, setName] = useState('');
  const [secondOption, setSecondOption] = useState('');
  const [number, setNumber] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!firstOption) {
      newErrors.firstOption = 'Նշեք թե ում կողմից եք հրավիրված';
    }

    if (!name.trim()) {
      newErrors.name = 'Անուն-Ազգանուն դաշտը պարտադիր է';
    }

    if (!secondOption) {
      newErrors.secondOption = 'Նշեք գալու եք թե ոչ';
    }

    if (secondOption === 'yes') {
      const num = parseInt(number);
      if (!num || num <= 0 || !Number.isInteger(num)) {
        newErrors.number = 'Հյուրերի թիվը պարտադիր է';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formData = {
        firstOption,
        name,
        secondOption,
        number: secondOption === 'a' ? parseInt(number) : null,
      };

      console.log('Submitted Data:', formData);
    }
  };

  return (
    <div className="contactUs">
      <div className="contactUsText">
        Շնորհակալ կլինենք, <br />
        եթե նախապես հաստատեք Ձեր <br /> ներկայությունը
      </div>
      <p className="contactUsSmallText">
        Կսպասենք Ձեր պատասխանին մինչև 01.06.2025
      </p>
      <form onSubmit={handleSubmit} style={{ margin: '0 auto' }}>
        <div className="firstRadio">
          <label>
            <input
              type="radio"
              name="firstOption"
              value="girl"
              checked={firstOption === 'girl'}
              onChange={(e) => setFirstOption(e.target.value)}
            />{' '}
            Հարսի կողմ
          </label>
          <label>
            <input
              type="radio"
              name="firstOption"
              value="boy"
              checked={firstOption === 'boy'}
              onChange={(e) => setFirstOption(e.target.value)}
            />{' '}
            Փեսայի կողմ
          </label>
          {errors.firstOption && (
            <div className="error">{errors.firstOption}</div>
          )}
        </div>

        <div className="name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Անուն-Ազգանուն"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="firstRadio">
          <label>
            <input
              type="radio"
              name="secondOption"
              value="yes"
              checked={secondOption === 'yes'}
              onChange={(e) => setSecondOption(e.target.value)}
            />{' '}
            Մենք կգանք
          </label>
          <label>
            <input
              type="radio"
              name="secondOption"
              value="no"
              checked={secondOption === 'no'}
              onChange={(e) => setSecondOption(e.target.value)}
            />{' '}
            Չենք կարող գալ :(
          </label>
          {errors.secondOption && (
            <div className="error">{errors.secondOption}</div>
          )}
        </div>

        {secondOption === 'yes' && (
          <div className="name">
            <input
              type="number"
              value={number}
              min="1"
              step="1"
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Հյուրերի թիվ"
            />
            {errors.number && <div className="error">{errors.number}</div>}
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="require">
            Please fill in all required fields | Пожалуйста, заполните все
            обязательные поля | Խնդրում ենք լրացնել բոլոր պահանջվող դաշտերը
          </div>
        )}
        <button type="submit" style={{ marginTop: 20 }}>
          Ուղարկել
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
