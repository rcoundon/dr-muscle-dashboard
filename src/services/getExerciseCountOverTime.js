export default async function getExerciseCountOverTime(
  axiosInstance,
  token,
  exerciseId = null,
  periodSinceToday = '-365.00:00:00.0000020'
) {
  const options = {
    url: '/api/WorkoutLog/GetUserExerciseCount',
    method: 'post',
    data: {
      ExerciseId: exerciseId,
      PeriodSinceToday: periodSinceToday
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  console.log('options', options);
  const { data } = await axiosInstance(options);
  console.log('data', data);
  return data;
}
