import API from '../api/api';
import { getWeddingDeviceId } from './deviceId';

const DEFAULT_INVITATION_ID =
  process.env.REACT_APP_INVITATION_ID?.trim().toLowerCase() || '289';

export const getInvitationId = () => {
  const match = window.location.pathname.match(/\/invite\/([^/]+)/i);
  if (!match?.[1]) return DEFAULT_INVITATION_ID;

  try {
    return (
      decodeURIComponent(match[1]).trim().toLowerCase() ||
      DEFAULT_INVITATION_ID
    );
  } catch {
    return DEFAULT_INVITATION_ID;
  }
};

export const postRegisterData = async (data) => {
  const res = await API.post(
    '/vote',
    {
      ...data,
      invitationId: getInvitationId(),
    },
    {
      headers: {
        'X-Wedding-Device-Id': getWeddingDeviceId(),
      },
    }
  );
  return res.data;
};

export const DEVICE_SUBMISSION_LIMIT_MESSAGE =
  'Այս սարքից արդեն ուղարկվել է առավելագույնը 4 պատասխան։ Նոր պատասխան ուղարկել հնարավոր չէ։';

export const getRegisterErrorMessage = (error) => {
  if (
    error?.response?.status === 429 &&
    error?.response?.data?.code === 'DEVICE_SUBMISSION_LIMIT'
  ) {
    return DEVICE_SUBMISSION_LIMIT_MESSAGE;
  }

  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    'Չհաջողվեց ուղարկել պատասխանը։ Խնդրում ենք փորձել կրկին։'
  );
};

export const getTimeToENdEngaged = async () => {
  const res = await API.get('/remaining-time', {
    params: { invitationId: getInvitationId() },
  });
  return res.data;
};
