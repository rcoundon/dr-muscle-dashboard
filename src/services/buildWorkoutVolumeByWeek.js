import { compareAsc, getWeek, getYear } from 'date-fns';

export function buildWorkoutVolumeByWeek(instance) {
  const workouts = instance.data.Result.sort((workoutA, workoutB) => {
    const workoutDateA = new Date(workoutA.WorkoutDate);
    const workoutDateB = new Date(workoutB.WorkoutDate);
    return compareAsc(workoutDateA, workoutDateB);
  });

  let weekCounter = 0;
  const exerciseInWeek = [
    {
      weekNumber: weekCounter,
      workouts: []
    }
  ];

  const getWeekOptions = {
    weekStartsOn: 1
  };
  workouts.forEach((workout, idx) => {
    const workoutDate = new Date(workout.WorkoutDate);
    const weekNumber = getWeek(workoutDate, getWeekOptions);
    const year = getYear(workoutDate);
    const trimmedYear = "'" + year.toString().substring(2, 4);
    const weekYear = weekNumber + trimmedYear;
    if (idx >= 1) {
      const lastWorkoutDate = new Date(workouts[idx - 1].WorkoutDate);
      const lastYear = getYear(lastWorkoutDate);
      const lastWeek = getWeek(lastWorkoutDate, getWeekOptions);
      const lastWeekYear = lastWeek + '-' + lastYear;

      if (lastWeekYear !== weekYear) {
        exerciseInWeek.push({
          weekNumber: weekYear,
          workouts: []
        });
      }
      // add workout to latest week in exerciseInWeek array
      const week = exerciseInWeek[exerciseInWeek.length - 1];
      week.workouts.push(workout);
    } else {
      const week = exerciseInWeek[0];
      week.weekNumber = weekYear;
      week.workouts.push(workout);
    }
  });

  exerciseInWeek.forEach(week => {
    let totalKgLifted = 0;
    let totalLbLifted = 0;
    let totalHardSets = 0;
    let bodyPartId, exerciseId;

    week.workouts.forEach(workout => {
      if (workout.Exercises[0] && workout.Exercises[0].TotalWeight) {
        if (workout.Exercises[0] && workout.Exercises[0].Sets) {
          const ids = findIdsFromSets(workout.Exercises[0].Sets);
          bodyPartId = ids.bodyPartId;
          exerciseId = ids.exerciseId;
        }
        totalKgLifted += workout.Exercises[0].TotalWeight.Kg;
        totalLbLifted += workout.Exercises[0].TotalWeight.Lb;
        totalHardSets += workout.Exercises[0].Series;
      }
    });
    week.bodyPartId = bodyPartId;
    week.exerciseId = exerciseId;
    week.totalHardSets = totalHardSets;
    week.totalKgLifted = totalKgLifted.toFixed(1);
    week.totalLbLifted = totalLbLifted.toFixed(1);
  });
  const exerciseInWeekWithId = exerciseInWeek.filter(exercise => {
    return exercise.exerciseId;
  });
  return exerciseInWeekWithId;
}

function findIdsFromSets(sets) {
  // Use for loop so we can break out early
  let bodyPartId;
  let exerciseId;
  if (!sets || sets.length === 0) {
    return {
      bodyPartId,
      exerciseId
    };
  }
  for (let i = 0; i < sets.length; i++) {
    bodyPartId = sets[i]?.Exercice?.BodyPartId;
    exerciseId = sets[i]?.Exercice?.Id;
    if (bodyPartId && exerciseId) {
      break;
    }
  }
  return {
    bodyPartId,
    exerciseId
  };
}
