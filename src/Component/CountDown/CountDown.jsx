import { useCallback, useEffect, useRef, useState } from 'react';
import './CountDown.css';
import { getTimeToENdEngaged } from '../../services/reigisterService';

const RESYNC_INTERVAL_MS = 30000;

const EMPTY_TIME = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isOver: false,
};

const LABELS = {
  days: 'օր',
  hours: 'ժամ',
  minutes: 'րոպե',
  seconds: 'վայրկյան',
};

const NOOP = () => {};

const getTimeLeft = (milliseconds) => {
  if (milliseconds <= 0) {
    return { ...EMPTY_TIME, isOver: true };
  }

  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor((milliseconds / 3600000) % 24),
    minutes: Math.floor((milliseconds / 60000) % 60),
    seconds: Math.floor((milliseconds / 1000) % 60),
    isOver: false,
  };
};

const parseCountdown = (response, receivedAt) => {
  const targetAt = Date.parse(response?.target_at);
  const serverTime = Date.parse(response?.server_time);
  const legacyRemaining = Number(response?.remaining_time_milliseconds);

  let remaining;
  if (Number.isFinite(targetAt) && Number.isFinite(serverTime)) {
    remaining = targetAt - serverTime;
  } else if (Number.isFinite(legacyRemaining) && legacyRemaining >= 0) {
    remaining = legacyRemaining;
  } else {
    throw new Error('Invalid countdown response');
  }

  return { deadline: receivedAt + Math.max(0, remaining) };
};

const CountDown = ({ setShowCelebration = NOOP }) => {
  const [target, setTarget] = useState(null);
  const [timeLeft, setTimeLeft] = useState(EMPTY_TIME);
  const [status, setStatus] = useState('loading');
  const [syncError, setSyncError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const celebrationActiveRef = useRef(null);

  const syncCountdown = useCallback(async ({ showLoading = false } = {}) => {
    const requestId = ++requestIdRef.current;

    if (showLoading) setStatus('loading');
    setIsSyncing(true);

    try {
      const response = await getTimeToENdEngaged();
      const nextTarget = parseCountdown(response, Date.now());

      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      setTarget(nextTarget);
      setTimeLeft(getTimeLeft(nextTarget.deadline - Date.now()));
      setStatus('ready');
      setSyncError(false);
    } catch {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      // If a previous sync succeeded, keep that countdown running while making
      // the stale connection state and retry action visible.
      setStatus((current) => (current === 'ready' ? current : 'error'));
      setSyncError(true);
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setIsSyncing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    syncCountdown({ showLoading: true });

    const resyncTimer = window.setInterval(syncCountdown, RESYNC_INTERVAL_MS);
    const handleFocus = () => syncCountdown();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncCountdown();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      window.clearInterval(resyncTimer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncCountdown]);

  useEffect(() => {
    if (!target) return undefined;

    let timer;
    const update = () => {
      const next = getTimeLeft(target.deadline - Date.now());
      setTimeLeft(next);

      if (celebrationActiveRef.current !== next.isOver) {
        celebrationActiveRef.current = next.isOver;
        setShowCelebration(next.isOver);
      }

      if (next.isOver) {
        window.clearInterval(timer);
        return true;
      }

      return false;
    };

    if (!update()) {
      timer = window.setInterval(update, 1000);
    }

    return () => window.clearInterval(timer);
  }, [setShowCelebration, target]);

  const retry = () => syncCountdown({ showLoading: status === 'error' });
  const timerLabel = timeLeft.isOver
    ? 'Հարսանիքի օրը եկել է'
    : `${timeLeft.days} օր, ${timeLeft.hours} ժամ, ${timeLeft.minutes} րոպե, ${timeLeft.seconds} վայրկյան`;

  return (
    <section className="countdown" aria-labelledby="wedding-countdown-title">
      <h2 id="wedding-countdown-title">
        {timeLeft.isOver && status === 'ready' ? 'Հարսանիքի օրը եկել է' : 'Հարսանիքին մնաց'}
      </h2>

      {status === 'error' ? (
        <div className="countdown__status countdown__status--error" role="alert">
          <p>Չհաջողվեց բեռնել հետհաշվարկը։ Խնդրում ենք ստուգել կապը։</p>
          <button type="button" onClick={retry} disabled={isSyncing}>
            {isSyncing ? 'Բեռնվում է…' : 'Կրկին փորձել'}
          </button>
        </div>
      ) : (
        <>
          <div
            className="content"
            role="timer"
            aria-label={status === 'loading' ? 'Հետհաշվարկը բեռնվում է' : timerLabel}
            aria-busy={status === 'loading'}
          >
            {Object.keys(LABELS).map((unit) => (
              <div className="box" key={unit}>
                <div className="value">
                  <span className="number" data-testid={`countdown-${unit}`}>
                    {status === 'loading' ? '—' : String(timeLeft[unit]).padStart(2, '0')}
                  </span>
                  <span className="label">{LABELS[unit]}</span>
                </div>
              </div>
            ))}
          </div>

          {timeLeft.isOver && status === 'ready' && (
            <p className="countdown__complete" role="status">
              Սիրով սպասում ենք Ձեզ մեր տոնին
            </p>
          )}

          {syncError && (
            <div className="countdown__sync-warning" role="status">
              <span>Թարմացումը չհաջողվեց․ ցուցադրվում է վերջին հասանելի ժամը։</span>
              <button type="button" onClick={retry} disabled={isSyncing}>
                {isSyncing ? 'Թարմացվում է…' : 'Թարմացնել'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CountDown;
