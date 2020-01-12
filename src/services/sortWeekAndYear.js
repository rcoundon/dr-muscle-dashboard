import { setWeek, setYear, setDate, compareAsc } from 'date-fns';
import copy from 'fast-copy';
import convertWeekNumberAndYearToDate from './convertWeekNumberAndYearToDate';

export default function sortWeekAndYear(keys) {
  if (!keys) return [];
  let keyCopy = copy(keys);
  return keyCopy.sort((keyA, keyB) => {
    const splitKeyA = keyA.split('-');
    const splitKeyB = keyB.split('-');

    const dateA = convertWeekNumberAndYearToDate(keyA);
    const dateB = convertWeekNumberAndYearToDate(keyB);

    return compareAsc(dateA, dateB);
  });
}
