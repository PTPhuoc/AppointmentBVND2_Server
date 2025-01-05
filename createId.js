const formatNumber = (number) => {
  return number < 10 ? "0" + number : number;
};

const setID = (key, date) => {
  return (
    key +
    formatNumber(date.getDate()) +
    formatNumber(date.getMonth() + 1) +
    date.getFullYear() +
    (date.getHours() +
      date.getMinutes() +
      date.getSeconds())
  );
};

module.exports = setID;
