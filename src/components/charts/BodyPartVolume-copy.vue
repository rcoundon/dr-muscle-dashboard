<template>
  <div>
    <p v-for="exercise in exercises" :key="exercise.id">{{ exercise.id }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import getExerciseHistory from '@/services/getExerciseHistory';
import { compareAsc, getWeek } from 'date-fns';

export default {
  computed: {
    ...mapGetters('storeAuth', ['token']),
    ...mapGetters('storeExercises', ['exercises'])
  },
  data() {
    return {
      exerciseHistory: [],
      exerciseVolume: []
    };
  },
  async mounted() {
    try {
      const responsePromises = this.exercises.map(exercise => {
        return getExerciseHistory(
          this.$axios,
          this.token,
          exercise.id,
          undefined
        ).then(data => {
          return {
            exerciseId: exercise.id,
            data
          };
        });
      });
      this.exerciseHistory = await Promise.all(responsePromises);
      console.log(this.exerciseHistory);
      this.buildWorkoutVolumeByWeek();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    findIdsFromSets(sets) {
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
    },
    buildWorkoutVolumeByWeek() {
      // this.exerciseHistory.forEach(exerciseWrapper => {

      const exerciseInstance = this.exerciseHistory[0];

      const individiualExerciseHistory = exerciseInstance.data.Result;

      // Sort the workouts by date, oldest first
      const workouts = individiualExerciseHistory.sort((workoutA, workoutB) => {
        let workoutDateA = new Date(workoutA.WorkoutDate);
        let workoutDateB = new Date(workoutB.WorkoutDate);
        return compareAsc(workoutDateA, workoutDateB);
      });
      console.log(workouts);
      this.exerciseVolume.push(
        workouts.map(exercise => {
          // Sort by workout date with oldest first
          console.log(exercise);

          let bodyPartId, exerciseId, ids;
          let weekCounter = 0;
          if (exercise.Exercises.length !== 0) {
            ids = this.findIdsFromSets(exercise.Exercises[0].Sets);
            bodyPartId = ids.bodyPartId;
            exerciseId = ids.exerciseId;
          }

          const weeks = [
            {
              bodyPartId,
              exerciseId,
              weekNumber: weekCounter,
              workouts: []
            }
          ];
          if (exercise.Exercises.length === 0) return weeks;
          const getWeekOptions = {
            weekStartsOn: 1
          };
          workouts.forEach((workout, idx) => {
            const workoutDate = new Date(workout.WorkoutDate);
            if (idx > 1) {
              const lastWorkoutDate = new Date(workouts[idx - 1].WorkoutDate);

              if (
                getWeek(workoutDate, getWeekOptions) !==
                getWeek(lastWorkoutDate, getWeekOptions)
              ) {
                // console.log('true');
                weeks.push({
                  weekNumber: weekCounter++,
                  workouts: []
                });
              }
              // add workout to latest week in weeks array
              const week = weeks[weeks.length - 1];
              // console.log(week);
              week.workouts.push(workout);
            } else {
              let week = weeks[0];
              week.workouts.push(workout);
            }
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
          return weeks;
        })
      );
    }
  }
};
</script>

<style></style>
