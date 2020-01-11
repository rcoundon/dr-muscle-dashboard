import { compareAsc, getWeek, getYear } from 'date-fns';

function getWeekAndYearFromDate(date) {
  const getWeekOptions = {
    weekStartsOn: 1
  };
  const weekNumber = getWeek(date, getWeekOptions);
  const year = getYear(date);
  const weekYear = `${weekNumber}-${year}`;
  return weekYear;
}

function sortWorkouts(workoutA, workoutB) {
  let workoutDateA = workoutA.workoutDate;
  let workoutDateB = workoutB.workoutDate;
  return compareAsc(workoutDateA, workoutDateB);
}

export function buildWorkoutVolumeByWeek(data) {
  // debugger;
  const refactoredData = data.Result.map(workout => {
    const workoutDate = new Date(workout.WorkoutDate);
    const weekYear = getWeekAndYearFromDate(workoutDate);
    const exerciseArray = workout.Exercises.map(exercise => {
      const exerciseSummary = {
        exerciseId: exercise.Sets[0].Exercice.Id,
        label: exercise.Sets[0].Exercice.Label,
        isEasy: exercise.Sets[0].Exercice.IsEasy,
        bodyPartId: exercise.Sets[0].Exercice.BodyPartId,
        totalWeightKg: exercise.TotalWeight.Kg,
        totalWeightLb: exercise.TotalWeight.Lb,
        totalSets: exercise.Sets?.length || 0
      };
      return exerciseSummary;
    });

    const workoutSummary = {
      exerciseSummary: exerciseArray,
      workoutDate,
      weekNumber: weekYear
    };
    return workoutSummary;
  }).sort(sortWorkouts);

  const bodyPartVolume = {};
  const weekNumbers = [];
  const volume = [];

  refactoredData.forEach(workout => {
    workout.exerciseSummary.forEach(exercise => {
      let bodyPartKeys = Object.keys(bodyPartVolume);
      if (!bodyPartKeys.includes('' + exercise.bodyPartId)) {
        bodyPartVolume['' + exercise.bodyPartId] = {
          weeks: [],
          setVolume: [],
          weightVolumeKg: [],
          weightVolumeLb: []
        };
        bodyPartVolume['' + exercise.bodyPartId].weeks.push(workout.weekNumber);
        bodyPartVolume['' + exercise.bodyPartId].setVolume.push(
          exercise.totalSets
        );
        bodyPartVolume['' + exercise.bodyPartId].weightVolumeKg.push(
          exercise.totalWeightKg
        );
        bodyPartVolume['' + exercise.bodyPartId].weightVolumeLb.push(
          exercise.totalWeightLb
        );
      } else {
        let oldValueIdx = bodyPartVolume[
          '' + exercise.bodyPartId
        ].weeks.indexOf(workout.weekNumber);
        let oldSetValue = 0;
        let oldKgValue = 0;
        let oldLbValue = 0;
        if (oldValueIdx !== -1) {
          oldSetValue =
            bodyPartVolume['' + exercise.bodyPartId].setVolume[oldValueIdx];
          oldKgValue =
            bodyPartVolume['' + exercise.bodyPartId].weightVolumeKg[
              oldValueIdx
            ];
          oldLbValue =
            bodyPartVolume['' + exercise.bodyPartId].weightVolumeLb[
              oldValueIdx
            ];
          bodyPartVolume['' + exercise.bodyPartId].setVolume[oldValueIdx] =
            oldSetValue + exercise.totalSets;
          bodyPartVolume['' + exercise.bodyPartId].weightVolumeKg[oldValueIdx] =
            oldKgValue + exercise.totalWeightKg;
          bodyPartVolume['' + exercise.bodyPartId].weightVolumeLb[oldValueIdx] =
            oldLbValue + exercise.totalWeightLb;
        } else {
          bodyPartVolume['' + exercise.bodyPartId].weeks.push(
            workout.weekNumber
          );
          bodyPartVolume['' + exercise.bodyPartId].setVolume.push(
            exercise.totalSets
          );
          bodyPartVolume['' + exercise.bodyPartId].weightVolumeKg.push(
            exercise.totalWeightKg
          );
          bodyPartVolume['' + exercise.bodyPartId].weightVolumeLb.push(
            exercise.totalWeightLb
          );
        }
      }
    });
  });

  return bodyPartVolume;
}

// export function buildWorkoutVolumeByWeek(instance) {
//   const workouts = instance.data.Result.sort((workoutA, workoutB) => {
//     const workoutDateA = new Date(workoutA.WorkoutDate);
//     const workoutDateB = new Date(workoutB.WorkoutDate);
//     return compareAsc(workoutDateA, workoutDateB);
//   });

//   let weekCounter = 0;
//   const exerciseInWeek = [
//     {
//       weekNumber: weekCounter,
//       workouts: []
//     }
//   ];

//   const getWeekOptions = {
//     weekStartsOn: 1
//   };
//   workouts.forEach((workout, idx) => {
//     const workoutDate = new Date(workout.WorkoutDate);
//     const weekNumber = getWeek(workoutDate, getWeekOptions);
//     const year = getYear(workoutDate);
//     const weekYear = weekNumber + '-' + year;
//     if (idx > 0) {
//       const lastWorkoutDate = new Date(workouts[idx - 1].WorkoutDate);
//       const lastYear = getYear(lastWorkoutDate);
//       const lastWeek = getWeek(lastWorkoutDate, getWeekOptions);
//       const lastWeekYear = lastWeek + '-' + lastYear;

//       if (lastWeekYear !== weekYear) {
//         exerciseInWeek.push({
//           weekNumber: weekYear,
//           workouts: []
//         });
//       }
//       // add workout to latest week in exerciseInWeek array
//       const week = exerciseInWeek[exerciseInWeek.length - 1];
//       week.workouts.push(workout);
//     } else {
//       const week = exerciseInWeek[0];
//       week.weekNumber = weekYear;
//       week.workouts.push(workout);
//     }
//   });

//   exerciseInWeek.forEach(week => {
//     let totalKgLifted = 0;
//     let totalLbLifted = 0;
//     let totalHardSets = 0;
//     let bodyPartId, exerciseId;

//     week.workouts.forEach(workout => {
//       if (workout.Exercises[0] && workout.Exercises[0].TotalWeight) {
//         if (workout.Exercises[0] && workout.Exercises[0].Sets) {
//           const ids = findIdsFromSets(workout.Exercises[0].Sets);
//           bodyPartId = ids.bodyPartId;
//           exerciseId = ids.exerciseId;
//         }
//         totalKgLifted += workout.Exercises[0].TotalWeight.Kg;
//         totalLbLifted += workout.Exercises[0].TotalWeight.Lb;
//         totalHardSets += workout.Exercises[0].Series;
//       }
//     });
//     week.bodyPartId = bodyPartId;
//     week.exerciseId = exerciseId;
//     week.totalHardSets = totalHardSets;
//     week.totalKgLifted = totalKgLifted.toFixed(1);
//     week.totalLbLifted = totalLbLifted.toFixed(1);
//   });
//   const exerciseInWeekWithId = exerciseInWeek.filter(exercise => {
//     return exercise.exerciseId;
//   });
//   return exerciseInWeekWithId;
// }

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
