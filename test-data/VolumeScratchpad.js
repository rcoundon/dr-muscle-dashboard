const volumeData = require('/Users/rcoundon/Documents/Github/dr-muscle-dashboard/test-data/exercise-history.json');
import { compareAsc, getWeek } from 'date-fns';

function buildVolume(data) {
  const workouts = data.Result.sort((workoutA, workoutB) => {
    let workoutDateA = new Date(workoutA.WorkoutDate);
    let workoutDateB = new Date(workoutB.WorkoutDate);
    return compareAsc(workoutDateA, workoutDateB);
  });

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
      const weekNumber = getWeek(workoutDate, getWeekOptions);
      if (
        getWeek(workoutDate, getWeekOptions) !==
        getWeek(lastWorkoutDate, getWeekOptions)
      ) {
        console.log('true');
        weeks.push({
          weekNumber,
          workouts: []
        });
      }
      // add workout to latest week in weeks array
      let week = weeks[weeks.length - 1];
      // console.log(week);
      week.workouts.push(workout);
    } else {
      const week = weeks[0];
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
        totalLbLifted += workout.Exercises[0].TotalWeight.Lb; /* ? */
      }
    });
    week.totalKgLifted = totalKgLifted;
    week.totalLbLifted = totalLbLifted;
  });

  return weeks;
}
// Sort by workout date with oldest first

function bodyPartTotals(exerciseVolume) {
  if (exerciseVolume.length === 0) return [];
  const bodyPartVolumes = {};
  exerciseVolume.forEach(exerciseGroup => {
    exerciseGroup.forEach(exercise => {
      const bodyPartKeys = Object.keys(bodyPartVolumes); /* ? */
      console.log(bodyPartKeys);
      if (!bodyPartKeys.includes(exercise.bodyPartId)) {
        bodyPartVolumes[exercise.bodyPartId] = {};
      }

      if (!bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber]) {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber] = {};
      }

      if (
        !bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber][
          exercise.exerciseId
        ]
      ) {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber][
          exercise.exerciseId
        ] = 0;
      } else {
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber][
          exercise.exerciseId
        ]++;
      }
      console.log(bodyPartVolumes[exercise.bodyPartId]);
      if (
        bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber].totalKgLifted
      ) {
        console.log('adding');
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted += exercise.totalKgLifted;
      } else {
        console.log('new');
        bodyPartVolumes[exercise.bodyPartId][
          exercise.weekNumber
        ].totalKgLifted = exercise.totalKgLifted;
      }
    });
  });

  return bodyPartVolumes;
}

const volume = buildVolume(volumeData);
bodyPartTotals(volume);
console.log(volume);
