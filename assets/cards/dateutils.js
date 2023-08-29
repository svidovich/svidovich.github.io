export const getYesterday = (date) => {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  return previous;
};

export const dateAsObject = (date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const dateCookieStringFromDate = (date) => {
  const { year, month, day } = dateAsObject(date);
  return `${year}.${month}.${day}`;
};
