
export default function buildOneRepMaxes(data, exerciseId) {
  const exerciseMaxes = [];
  data.Result.forEach(workout => {
    if (workout.Exercises && workout.Exercises) {
      const exercises = workout.Exercises;
      exercises.forEach(exercise => {
        if (exercise.Exercise.Id !== exerciseId) return;
        exerciseMaxes.push({
          exerciseId: exercise.Exercise.Id,
          oneRepMaxKg: exercise.BestSerie1RM.Kg,
          oneRepMaxLb: exercise.BestSerie1RM.Lb,
          workoutDate: new Date(workout.WorkoutDate)
        });
      });
    }
  });

  return exerciseMaxes;
}
