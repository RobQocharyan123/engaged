import { useEffect, useRef, useState } from 'react';
import './Confetti.css';

const COLORS = [
  '#fff4c2',
  '#f6c85f',
  '#ff9fc8',
  '#c5a3ff',
  '#8ed8ff',
  '#ffffff',
];

const randomBetween = (minimum, maximum) => (
  minimum + Math.random() * (maximum - minimum)
);

const getReducedMotionPreference = () => (
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
);

const getDeviceProfile = (width) => {
  const hardwareConcurrency = navigator.hardwareConcurrency || 8;
  const isCompact = width < 720 || hardwareConcurrency <= 4;

  return {
    dprLimit: isCompact ? 1.25 : 2,
    maxParticles: isCompact ? 260 : 620,
    particlesPerBurst: isCompact ? 48 : 86,
    launchDelay: isCompact ? [850, 1450] : [520, 1050],
  };
};

const Confetti = () => {
  const canvasRef = useRef(null);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(
    getReducedMotionPreference,
  );

  useEffect(() => {
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (event) => setShouldReduceMotion(event.matches);

    motionQuery?.addEventListener?.('change', handleMotionPreference);
    return () => motionQuery?.removeEventListener?.('change', handleMotionPreference);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    let width = 0;
    let height = 0;
    let profile = getDeviceProfile(window.innerWidth);
    let animationFrame = null;
    let isRunning = false;
    let previousFrameAt = 0;
    let nextLaunchAt = 0;
    let rockets = [];
    let particles = [];

    const resizeCanvas = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      profile = getDeviceProfile(width);

      const dpr = Math.min(window.devicePixelRatio || 1, profile.dprLimit);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.lineCap = 'round';
      context.lineJoin = 'round';
    };

    const scheduleNextLaunch = (now) => {
      nextLaunchAt = now + randomBetween(...profile.launchDelay);
    };

    const launchRocket = () => {
      const startX = randomBetween(width * 0.14, width * 0.86);
      const drift = randomBetween(-0.42, 0.42);

      rockets.push({
        x: startX,
        y: height + 12,
        previousX: startX,
        previousY: height + 12,
        velocityX: drift,
        velocityY: -Math.min(15.5, Math.max(11.5, (height / 80) + randomBetween(-0.7, 0.7))),
        targetY: randomBetween(height * 0.12, height * 0.48),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    const createExplosion = (rocket) => {
      const availableSlots = Math.max(0, profile.maxParticles - particles.length);
      const burstSize = Math.min(
        availableSlots,
        Math.round(profile.particlesPerBurst * randomBetween(0.82, 1.15)),
      );
      const color = Math.random() > 0.2
        ? rocket.color
        : COLORS[Math.floor(Math.random() * COLORS.length)];
      const phase = randomBetween(0, Math.PI * 2);

      for (let index = 0; index < burstSize; index += 1) {
        const angle = phase + ((Math.PI * 2 * index) / burstSize) + randomBetween(-0.045, 0.045);
        const speed = randomBetween(2.2, 6.8) * (0.72 + Math.random() ** 0.55);
        const particleColor = Math.random() > 0.12 ? color : '#ffffff';

        particles.push({
          x: rocket.x,
          y: rocket.y,
          previousX: rocket.x,
          previousY: rocket.y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          alpha: 1,
          decay: randomBetween(0.0085, 0.015),
          gravity: randomBetween(0.035, 0.06),
          color: particleColor,
          width: randomBetween(1, 2.2),
        });
      }
    };

    const drawRocket = (rocket) => {
      context.beginPath();
      context.moveTo(rocket.previousX, rocket.previousY);
      context.lineTo(rocket.x, rocket.y);
      context.strokeStyle = rocket.color;
      context.lineWidth = 2.2;
      context.shadowBlur = 11;
      context.shadowColor = rocket.color;
      context.stroke();

      context.beginPath();
      context.arc(rocket.x, rocket.y, 1.8, 0, Math.PI * 2);
      context.fillStyle = '#ffffff';
      context.fill();
    };

    const drawParticle = (particle) => {
      context.globalAlpha = Math.max(0, particle.alpha);
      context.beginPath();
      context.moveTo(particle.previousX, particle.previousY);
      context.lineTo(particle.x, particle.y);
      context.strokeStyle = particle.color;
      context.lineWidth = particle.width;
      context.shadowBlur = 7;
      context.shadowColor = particle.color;
      context.stroke();
    };

    const updateRockets = (frameScale) => {
      const activeRockets = [];

      rockets.forEach((rocket) => {
        rocket.previousX = rocket.x;
        rocket.previousY = rocket.y;
        rocket.x += rocket.velocityX * frameScale;
        rocket.y += rocket.velocityY * frameScale;
        rocket.velocityY += 0.055 * frameScale;

        drawRocket(rocket);

        if (rocket.y <= rocket.targetY || rocket.velocityY >= -1.4) {
          createExplosion(rocket);
        } else {
          activeRockets.push(rocket);
        }
      });

      rockets = activeRockets;
    };

    const updateParticles = (frameScale) => {
      const drag = 0.982 ** frameScale;
      const activeParticles = [];

      particles.forEach((particle) => {
        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.velocityX *= drag;
        particle.velocityY = (particle.velocityY * drag) + (particle.gravity * frameScale);
        particle.x += particle.velocityX * frameScale;
        particle.y += particle.velocityY * frameScale;
        particle.alpha -= particle.decay * frameScale;

        if (particle.alpha > 0.025) {
          drawParticle(particle);
          activeParticles.push(particle);
        }
      });

      particles = activeParticles;
      context.globalAlpha = 1;
    };

    const renderFrame = (now) => {
      if (!isRunning) return;

      const elapsed = previousFrameAt ? now - previousFrameAt : 16.67;
      const frameScale = Math.min(2, Math.max(0.35, elapsed / 16.67));
      previousFrameAt = now;

      context.globalCompositeOperation = 'destination-out';
      context.globalAlpha = 0.2;
      context.fillStyle = '#000000';
      context.fillRect(0, 0, width, height);
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'lighter';

      if (now >= nextLaunchAt) {
        launchRocket();
        scheduleNextLaunch(now);
      }

      updateRockets(frameScale);
      updateParticles(frameScale);

      context.shadowBlur = 0;
      context.globalCompositeOperation = 'source-over';
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (isRunning || document.visibilityState === 'hidden') return;
      isRunning = true;
      previousFrameAt = 0;
      const now = window.performance?.now?.() ?? Date.now();
      nextLaunchAt = Math.min(nextLaunchAt || now, now + 100);
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    const stop = () => {
      isRunning = false;
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stop();
      } else {
        start();
      }
    };

    resizeCanvas();
    scheduleNextLaunch(window.performance?.now?.() ?? Date.now());
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    start();

    return () => {
      stop();
      rockets = [];
      particles = [];
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      context.clearRect(0, 0, width, height);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div className="celebration" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="celebration__canvas"
        data-testid="wedding-fireworks-canvas"
      />
    </div>
  );
};

export default Confetti;
