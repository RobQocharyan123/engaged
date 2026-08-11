import axios from 'axios';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  if (process.env.REACT_APP_URL) {
    return process.env.REACT_APP_URL;
  }

  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : '/api';
};

export const API_BASE_URL = getBaseURL().replace(/\/+$/, '');

// Free hosting tiers suspend idle instances, so a guest opening the invitation
// after a quiet period pays for a cold boot. The wake-up ping absorbs that wait
// instead of letting the real request time out.
const DEFAULT_TIMEOUT_MS = 20000;
const WAKE_UP_TIMEOUT_MS = 90000;
const WARM_WINDOW_MS = 4 * 60 * 1000;
const MAX_RETRIES = 2;
const RETRYABLE_STATUS = new Set([502, 503, 504]);

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
});

let lastSuccessAt = 0;
let wakeUpPromise = null;

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const isApiWarm = () => Date.now() - lastSuccessAt < WARM_WINDOW_MS;

const pingHealth = () =>
  axios.get(`${API_BASE_URL}/health`, { timeout: WAKE_UP_TIMEOUT_MS });

export const ensureApiIsAwake = () => {
  if (isApiWarm()) return Promise.resolve();
  if (wakeUpPromise) return wakeUpPromise;

  wakeUpPromise = (async () => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        await pingHealth();
        lastSuccessAt = Date.now();
        return;
      } catch (error) {
        if (attempt === MAX_RETRIES) return;
        await delay(1000 * (attempt + 1));
      }
    }
  })().finally(() => {
    wakeUpPromise = null;
  });

  return wakeUpPromise;
};

const isRetryableError = (error) => {
  if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') return false;
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') return true;
  if (!error?.response) {
    return error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';
  }
  return RETRYABLE_STATUS.has(error.response.status);
};

// RSVP submissions are never replayed automatically: a silent retry could create
// a duplicate answer or consume the per-device quota.
const isRetryableRequest = (config) =>
  Boolean(config) && (config.method || 'get').toLowerCase() === 'get';

instance.interceptors.request.use(async (config) => {
  if (config.skipWakeUp) return config;
  await ensureApiIsAwake();
  return config;
});

instance.interceptors.response.use(
  (response) => {
    lastSuccessAt = Date.now();
    return response;
  },
  async (error) => {
    const config = error?.config;

    if (isRetryableError(error) && isRetryableRequest(config)) {
      const attempt = (config.retryAttempt || 0) + 1;

      if (attempt <= MAX_RETRIES) {
        config.retryAttempt = attempt;
        lastSuccessAt = 0;
        await delay(500 * attempt);
        return instance(config);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
