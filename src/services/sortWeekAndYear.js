import { setWeek, setYear, setDate, compareAsc } from 'date-fns';

export default function sortWeekAndYear(keys) {
  return keys.sort((keyA, keyB) => {
    const splitKeyA = keyA.split('-'); /* ? */
    const splitKeyB = keyB.split('-'); /* ? */

    const weekA = parseInt(splitKeyA[0]); /* ? */
    const yearA = parseInt(splitKeyA[1]); /* ? */

    let dateA = setYear(new Date(), yearA); /* ? */
    dateA = setDate(dateA, 1); /* ? */
    dateA = setWeek(dateA, weekA); /* ? */

    const weekB = parseInt(splitKeyB[0]); /* ? */
    const yearB = parseInt(splitKeyB[1]); /* ? */

    let dateB = setYear(new Date(), yearB); /* ? */
    dateB = setDate(dateB, 1); /* ? */
    dateB = setWeek(dateB, weekB); /* ? */

    return compareAsc(dateA, dateB);
  });
}
