import { setWeek, setYear, setDate, compareAsc } from 'date-fns';
import convertWeekNumberAndYearToDate from './convertWeekNumberAndYearToDate';

export default function sortWeekAndYear(keys) {
  if (!keys) return [];
  return keys.sort((keyA, keyB) => {
    const splitKeyA = keyA.split('-');
    const splitKeyB = keyB.split('-');

    const dateA = convertWeekNumberAndYearToDate(keyA);
    const dateB = convertWeekNumberAndYearToDate(keyB);

    return compareAsc(dateA, dateB);
  });
}
