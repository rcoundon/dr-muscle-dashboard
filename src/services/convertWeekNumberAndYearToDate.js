import { setWeek, setYear, setDate } from 'date-fns';

export default weekAndYear => {
  const splitWeekAndYear = weekAndYear.split('-');

  const week = parseInt(splitWeekAndYear[0]);
  const year = parseInt(splitWeekAndYear[1]);

  let date = setYear(new Date(), year);
  // use the 1st of the month as a safe default
  date = setDate(date, 1);
  date = setWeek(date, week);

  return date;
};
