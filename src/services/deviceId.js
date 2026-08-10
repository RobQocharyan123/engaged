export const DEVICE_ID_STORAGE_KEY = 'wedding_device_id_v1';

const DEVICE_ID_PATTERN = /^wd_[a-f0-9]{32}$/i;
let memoryDeviceId = '';

const getBrowserCrypto = () => {
  try {
    return typeof window !== 'undefined' ? window.crypto : undefined;
  } catch {
    return undefined;
  }
};

const randomBytesToHex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

export const generateDeviceId = (cryptoSource = getBrowserCrypto()) => {
  try {
    if (typeof cryptoSource?.randomUUID === 'function') {
      const uuid = cryptoSource.randomUUID().replace(/-/g, '').toLowerCase();
      if (/^[a-f0-9]{32}$/.test(uuid)) return `wd_${uuid}`;
    }

    if (typeof cryptoSource?.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      cryptoSource.getRandomValues(bytes);
      return `wd_${randomBytesToHex(bytes)}`;
    }
  } catch {
    // Continue with a compatibility ID when Web Crypto is unavailable or blocked.
  }

  const fallback = `${Date.now().toString(16).padStart(12, '0')}${Math.random()
    .toString(16)
    .slice(2)
    .padEnd(20, '0')}`.slice(0, 32);
  return `wd_${fallback}`;
};

const readStoredDeviceId = () => {
  try {
    const storedId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    return DEVICE_ID_PATTERN.test(storedId || '') ? storedId : '';
  } catch {
    return '';
  }
};

const storeDeviceId = (deviceId) => {
  try {
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  } catch {
    // Privacy modes can deny storage. The in-memory ID still keeps this page usable.
  }
};

export const getWeddingDeviceId = () => {
  const storedId = readStoredDeviceId();
  if (storedId) {
    memoryDeviceId = storedId;
    return storedId;
  }

  if (!DEVICE_ID_PATTERN.test(memoryDeviceId)) {
    memoryDeviceId = generateDeviceId();
  }

  storeDeviceId(memoryDeviceId);
  return memoryDeviceId;
};

export const resetDeviceIdForTests = () => {
  memoryDeviceId = '';
};
