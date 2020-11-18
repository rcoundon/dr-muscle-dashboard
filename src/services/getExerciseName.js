export function getExerciseName(data, id) {
  if (!id) return 'Unknown';
  const selectedExercise = data.filter((exercise) => {
    return exercise.id === id;
  });
  return selectedExercise[0].Label;
}
