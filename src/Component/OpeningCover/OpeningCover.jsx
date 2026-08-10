import { useEffect, useRef, useState } from 'react';
import './OpeningCover.css';
import desktopCover from '../../Assets/cover/envelope-cover-desktop.png';
import mobileCover from '../../Assets/cover/envelope-cover-mobile.png';
import ctaDivider from '../../Assets/cover/cta-divider.png';

const OPEN_ANIMATION_MS = 2400;

const OpeningCover = ({ onOpenStart, onOpened }) => {
  const [isOpening, setIsOpening] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleOpen = () => {
    if (isOpening) return;

    setIsOpening(true);
    onOpenStart?.();

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    timerRef.current = window.setTimeout(
      () => onOpened?.(),
      prefersReducedMotion ? 80 : OPEN_ANIMATION_MS
    );
  };

  return (
    <section
      className={`openingCover${isOpening ? ' openingCover--opening' : ''}`}
      aria-label="Հարսանեկան հրավերի շապիկ"
    >
      <picture className="openingCover__picture">
        <source media="(max-width: 640px)" srcSet={mobileCover} />
        <img
          className="openingCover__art"
          src={desktopCover}
          alt=""
          fetchPriority="high"
        />
      </picture>

      <div className="openingCover__card" aria-hidden="true">
        <span className="openingCover__cardMonogram">Հ &amp; Լ</span>
        <span className="openingCover__cardText">Սիրով հրավիրում ենք</span>
      </div>

      <picture className="openingCover__flap">
        <source media="(max-width: 640px)" srcSet={mobileCover} />
        <img src={desktopCover} alt="" />
      </picture>

      <span className="openingCover__glow" aria-hidden="true" />

      <button
        type="button"
        className="openingCover__open"
        onClick={handleOpen}
        disabled={isOpening}
        aria-label="Բացել Հակոբի և Լիլիթի հարսանեկան հրավերը"
      >
        <span className="openingCover__copy" aria-hidden="true">
          <span className="openingCover__names">ՀԱԿՈԲ • ԼԻԼԻԹ</span>
          <span className="openingCover__ornament">
            <span />
            <b>❦</b>
            <span />
          </span>
          <span className="openingCover__title">ՀԱՐՍԱՆՅԱՑ ՀՐԱՎԵՐ</span>
        </span>
        <span className="openingCover__sealFocus" aria-hidden="true" />
        <span className="openingCover__cta" aria-hidden="true">
          <span>{isOpening ? 'ԲԱՑՎՈՒՄ Է…' : 'ԲԱՑԵԼ'}</span>
          <img src={ctaDivider} alt="" />
        </span>
      </button>
    </section>
  );
};

export default OpeningCover;
