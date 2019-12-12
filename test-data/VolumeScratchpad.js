const data = require('/Users/rcoundon/Documents/Github/dr-muscle-dashboard/test-data/exercise-history.json');
import { compareAsc, getWeek } from 'date-fns';

// Sort by workout date with oldest first
const workouts = data.Result.sort((workoutA, workoutB) => {
  let workoutDateA = new Date(workoutA.WorkoutDate);
  let workoutDateB = new Date(workoutB.WorkoutDate);
  return compareAsc(workoutDateA, workoutDateB);
}); /* ? */

let weekCounter = 0;
const weeks = [
  {
    bodyPartId: workouts[0].Exercises[0].Sets[0].Exercice.BodyPartId,
    exerciseId: workouts[0].Exercises[0].Exercise.Id,
    weekNumber: weekCounter,
    workouts: []
  }
];

const getWeekOptions = {
  weekStartsOn: 1
};

// let newWeek = false;
workouts.forEach((workout, idx) => {
  const workoutDate = new Date(workout.WorkoutDate);
  if (idx > 1) {
    const lastWorkoutDate = new Date(workouts[idx - 1].WorkoutDate);
    // console.log(lastWorkoutDate);

    if (
      getWeek(workoutDate, getWeekOptions) !==
      getWeek(lastWorkoutDate, getWeekOptions)
    ) {
      console.log('true');
      weeks.push({
        weekNumber: weekCounter++,
        workouts: []
      });
    }
    // add workout to latest week in weeks array
    let week = weeks[weeks.length - 1];
    // console.log(week);
    week.workouts.push(workout);
  } else {
    let week = weeks[0];
    week.workouts.push(workout);
  }
  // Need to determine the first time we pass from the 1st week to the 2nd week
  // as we'll be calculating volume on a weekly basis starting on Monday (1)
  //const lastWorkoutDate
});

weeks.forEach(week => {
  console.log(week);
  let totalKgLifted = 0;
  let totalLbLifted = 0;
  // const numberOfWorkouts = week.workouts.length;
  week.workouts.forEach(workout => {
    if (workout.Exercises[0] && workout.Exercises[0].TotalWeight) {
      console.log(workout.Exercises[0].TotalWeight.Kg);
      console.log(workout.Exercises[0].TotalWeight.Lb);
      totalKgLifted += workout.Exercises[0].TotalWeight.Kg;
      totalLbLifted += workout.Exercises[0].TotalWeight.Lb;
    }
  });
  week.totalKgLifted = totalKgLifted;
  week.totalLbLifted = totalLbLifted;
});

console.log(weeks); /* ? */
