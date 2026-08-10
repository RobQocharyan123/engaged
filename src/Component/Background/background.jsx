import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import couplePortrait from '../../Assets/background/gallery/01-couple-upscaled.png';
import './background.css';

const SLIDE_DURATION_MS = 7000;

const loadGalleryImages = () => {
  if (process.env.NODE_ENV === 'test') {
    return [couplePortrait];
  }

  const gallery = require.context(
    '../../Assets/background/gallery',
    false,
    /\.(avif|gif|jpe?g|png|webp)$/i,
  );

  const discoveredImages = gallery
    .keys()
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }))
    .map((key) => {
      const imageModule = gallery(key);
      return imageModule.default || imageModule;
    });

  return [...new Set([couplePortrait, ...discoveredImages])];
};

const images = loadGalleryImages();

const movementFor = (index) => {
  const movements = [
    { x: ['0%', '-1.2%', '0%'], y: ['0%', '-0.8%', '0%'] },
    { x: ['-1%', '0.8%', '-1%'], y: ['-0.6%', '0.5%', '-0.6%'] },
    { x: ['0.8%', '-0.7%', '0.8%'], y: ['0.4%', '-0.7%', '0.4%'] },
  ];

  return movements[index % movements.length];
};

const Background = () => {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (images.length < 2) return;

    const nextImage = new Image();
    nextImage.src = images[(index + 1) % images.length];
  }, [index]);

  const movement = movementFor(index);
  const animatedTransform = prefersReducedMotion
    ? { scale: 1, x: '0%', y: '0%' }
    : { scale: [1.02, 1.08, 1.02], ...movement };

  return (
    <div className="background" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.img
          key={`${images[index]}-backdrop`}
          src={images[index]}
          alt=""
          className="background__image background__image--backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, ...animatedTransform }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: prefersReducedMotion ? 0 : 1.5, ease: 'easeInOut' },
            scale: { duration: 22, ease: 'easeInOut', repeat: Infinity },
            x: { duration: 22, ease: 'easeInOut', repeat: Infinity },
            y: { duration: 22, ease: 'easeInOut', repeat: Infinity },
          }}
        />
        <motion.img
          key={images[index]}
          src={images[index]}
          alt=""
          className="background__image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1, x: '0%', y: '0%' }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: prefersReducedMotion ? 0 : 1.5, ease: 'easeInOut' },
          }}
        />
      </AnimatePresence>
      <div className="background__veil" />
    </div>
  );
};

export default Background;
