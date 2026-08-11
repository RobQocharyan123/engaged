const TIME_ZONE = 'Asia/Yerevan';

const getPart = (parts, type) =>
  parts.find((part) => part.type === type)?.value || '';

export const formatWeddingDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return null;

  const dateParts = new Intl.DateTimeFormat('hy-AM', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date);

  const day = getPart(dateParts, 'day');
  const month = getPart(dateParts, 'month');
  const year = getPart(dateParts, 'year');
  const capitalizedMonth = month
    ? `${month.charAt(0).toLocaleUpperCase('hy-AM')}${month.slice(1)}`
    : '';

  return {
    dayAndMonth: `${day} ${capitalizedMonth}`.trim(),
    year,
    numeric: new Intl.DateTimeFormat('en-GB', {
      timeZone: TIME_ZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date).replaceAll('/', '.'),
    time: new Intl.DateTimeFormat('en-GB', {
      timeZone: TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date).replace(':', ' : '),
  };
};
