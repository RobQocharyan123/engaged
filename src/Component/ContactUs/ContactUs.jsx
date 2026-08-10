import { useState } from 'react';
import './ContactUs.css';
import { toast } from 'react-toastify';
import {
  getRegisterErrorMessage,
  postRegisterData,
} from '../../services/reigisterService';

const ContactUs = () => {
  const [firstOption, setFirstOption] = useState('');
  const [name, setName] = useState('');
  const [secondOption, setSecondOption] = useState('');
  const [number, setNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const newErrors = {};
    const normalizedName = name.trim().replace(/\s+/g, ' ');

    if (!firstOption) {
      newErrors.firstOption = 'Նշեք, թե ում կողմից եք հրավիրված';
    }

    if (normalizedName.length < 2) {
      newErrors.name = 'Անուն-ազգանունը պետք է պարունակի առնվազն 2 նիշ';
    }

    if (!secondOption) {
      newErrors.secondOption = 'Նշեք՝ գալու եք, թե ոչ';
    }

    const guestCount = Number(number);
    if (
      secondOption === 'yes' &&
      (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20)
    ) {
      newErrors.number = 'Նշեք հյուրերի ճիշտ թիվը՝ 1-ից 20';
    }

    setErrors(newErrors);
    setServerError('');

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await postRegisterData({
        firstOption,
        name: normalizedName,
        secondOption,
        number: secondOption === 'yes' ? guestCount : null,
      });
      toast.success('Ձեր պատասխանը հաստատվեց');
      setErrors({});
      setNumber('');
      setFirstOption('');
      setName('');
      setSecondOption('');
    } catch (error) {
      const message = getRegisterErrorMessage(error);
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contactUs" aria-labelledby="rsvp-title">
      <h2 className="contactUsText" id="rsvp-title">
        Շնորհակալ կլինենք, <br />
        եթե նախապես հաստատեք Ձեր <br /> ներկայությունը
      </h2>
      <p className="contactUsSmallText">
        Կսպասենք Ձեր պատասխանին մինչև 20.10.2026
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="firstRadio">
          <legend className="sideQuestion">Ում կողմից եք գալիս</legend>
          <label>
            <input
              type="radio"
              name="firstOption"
              value="girl"
              checked={firstOption === 'girl'}
              onChange={(event) => setFirstOption(event.target.value)}
            />
            Լիլիթ
          </label>
          <label>
            <input
              type="radio"
              name="firstOption"
              value="boy"
              checked={firstOption === 'boy'}
              onChange={(event) => setFirstOption(event.target.value)}
            />
            Հակոբ
          </label>
          {errors.firstOption && (
            <span className="error" role="alert">{errors.firstOption}</span>
          )}
        </fieldset>

        <div className="name">
          <label className="srOnly" htmlFor="guest-name">Անուն ազգանուն</label>
          <input
            id="guest-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Անուն-ազգանուն"
            autoComplete="name"
            maxLength="80"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'guest-name-error' : undefined}
          />
          {errors.name && (
            <span className="error" id="guest-name-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <fieldset className="firstRadio">
          <legend className="srOnly">Հաստատեք ներկայությունը</legend>
          <label>
            <input
              type="radio"
              name="secondOption"
              value="yes"
              checked={secondOption === 'yes'}
              onChange={(event) => setSecondOption(event.target.value)}
            />
            Մենք կգանք
          </label>
          <label>
            <input
              type="radio"
              name="secondOption"
              value="no"
              checked={secondOption === 'no'}
              onChange={(event) => setSecondOption(event.target.value)}
            />
            Չենք կարող գալ
          </label>
          {errors.secondOption && (
            <span className="error" role="alert">{errors.secondOption}</span>
          )}
        </fieldset>

        {secondOption === 'yes' && (
          <div className="name">
            <label className="srOnly" htmlFor="guest-count">Հյուրերի թիվ</label>
            <input
              id="guest-count"
              type="number"
              value={number}
              min="1"
              max="20"
              step="1"
              inputMode="numeric"
              onChange={(event) => setNumber(event.target.value)}
              placeholder="Հյուրերի թիվ"
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? 'guest-count-error' : undefined}
            />
            {errors.number && (
              <span className="error" id="guest-count-error" role="alert">
                {errors.number}
              </span>
            )}
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="require" role="alert">
            Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը
          </div>
        )}
        {serverError && (
          <div className="require" role="alert">{serverError}</div>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ուղարկվում է…' : 'Ուղարկել'}
        </button>
      </form>
    </section>
  );
};

export default ContactUs;
