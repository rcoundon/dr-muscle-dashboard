export default async function getExerciseHistory(
  axiosInstance,
  token,
  exerciseId,
  periodSinceToday = '-365.00:00:00.0000020'
) {
  const options = {
    url: '/api/Exercise/GetWorkoutHistoryForAlltime',
    method: 'post',
    data: {
      ExerciseId: exerciseId,
      PeriodSinceToday: periodSinceToday
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const { data } = await axiosInstance(options);
  return data;
}
