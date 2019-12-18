<template>
  <div>
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />

    <b-field style="padding-top: 2em">
      <b-select
        v-model="selectedExercise"
        placeholder="Select an exercise"
        icon="dumbbell"
      >
        <option
          v-for="exercise in exercises"
          :key="exercise.id"
          :value="exercise.id"
        >
          {{ exercise.Label }}
        </option>
      </b-select>
    </b-field>
    <b-table :data="exerciseVolume">
      <template slot-scope="props">
        <b-table-column field="weekNumber" label="Week No.">
          {{ props.row.weekNumber }}
        </b-table-column>
        <b-table-column field="exerciseId" label="ExerciseId">
          {{ getExerciseName(props.row.exerciseId) }}
        </b-table-column>
        <b-table-column field="bodyPartId" label="Body Part Id">
          {{ getBodyPartName(props.row.bodyPartId) }}
        </b-table-column>
        <b-table-column field="totalKgLifted" label="Total Kg Lifted">
          {{ props.row.totalKgLifted }}
        </b-table-column>
        <b-table-column field="totalLbLifted" label="Total Lb Lifted">
          {{ props.row.totalLbLifted }}
        </b-table-column>
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>Nothing here yet...</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import getExerciseHistory from '@/services/getExerciseHistory';
import { getBodyPartName } from '@/services/getBodyPartName';
import { getExerciseName } from '@/services/getExerciseName';
import { compareAsc, getWeek } from 'date-fns';

export default {
  computed: {
    ...mapGetters('storeAuth', ['token']),
    ...mapGetters('storeExercises', ['exercises']),
    tableData() {
      return this.exerciseVolume.filter(exercise => {
        return exercise.exerciseId === this.selectedExercise;
      });
    },
    bodyPartTotals() {
      if (this.exerciseVolume.length === 0) return [];
      const bodyPartVolumes = {};
      this.exerciseVolume.forEach(exerciseGroup => {
        exerciseGroup.forEach(exercise => {
          const bodyPartKeys = Object.keys(bodyPartVolumes);
          console.log(
            `Comparing ${bodyPartKeys} to ${
              exercise.bodyPartId
            } ${bodyPartKeys.includes('' + exercise.bodyPartId)}`
          );
          if (!bodyPartKeys.includes('' + exercise.bodyPartId)) {
            console.log('adding body part key: ' + exercise.bodyPartId);
            bodyPartVolumes[exercise.bodyPartId] = {};
          }

          if (!bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber]) {
            console.log(
              `adding bodyPartVolumes[${exercise.bodyPartId}][exercise.weekNumber]`
            );
            bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber] = {};
          } else {
            console.log(
              `bodyPartVolumes[${exercise.bodyPartId}][exercise.weekNumber] already exists`
            );
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

          if (
            bodyPartVolumes[exercise.bodyPartId][exercise.weekNumber]
              .totalKgLifted
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
          console.log(
            `adding bodyPartVolumes[${
              exercise.bodyPartId
            }][exercise.weekNumber].totalKgLifted = ${(bodyPartVolumes[
              exercise.bodyPartId
            ][exercise.weekNumber].totalKgLifted = exercise.totalKgLifted)}`
          );
        });
      });

      return bodyPartVolumes;
    }
  },
  data() {
    return {
      isLoading: false,
      exerciseHistory: [],
      exerciseVolume: [],
      selectedExercise: undefined
    };
  },
  async mounted() {
    try {
      this.isLoading = true;
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
      this.buildAllWorkoutVolumes();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
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
    getBodyPartName(id) {
      return getBodyPartName(id);
    },
    getExerciseName(id) {
      return getExerciseName(this.exercises, id);
    },
    buildAllWorkoutVolumes() {
      this.exerciseVolume = this.exerciseHistory.map(exercise => {
        return this.buildWorkoutVolumeByWeek(exercise);
      });
    },
    buildWorkoutVolumeByWeek(instance) {
      const workouts = instance.data.Result.sort((workoutA, workoutB) => {
        let workoutDateA = new Date(workoutA.WorkoutDate);
        let workoutDateB = new Date(workoutB.WorkoutDate);
        return compareAsc(workoutDateA, workoutDateB);
      });

      let weekCounter = 0;
      const exerciseInWeek = [
        {
          // bodyPartId: workouts[0].Exercises[0].Sets[0].Exercice.BodyPartId,
          // exerciseId: workouts[0].Exercises[0].Exercise.Id,
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
        const weekNumber = getWeek(workoutDate, getWeekOptions);
        if (idx > 1) {
          const lastWorkoutDate = new Date(workouts[idx - 1].WorkoutDate);
          if (
            getWeek(workoutDate, getWeekOptions) !==
            getWeek(lastWorkoutDate, getWeekOptions)
          ) {
            exerciseInWeek.push({
              weekNumber,
              workouts: []
            });
          }
          // add workout to latest week in exerciseInWeek array
          const week = exerciseInWeek[exerciseInWeek.length - 1];
          week.workouts.push(workout);
        } else {
          const week = exerciseInWeek[0];
          week.weekNumber = weekNumber;
          week.workouts.push(workout);
        }
        // Need to determine the first time we pass from the 1st week to the 2nd week
        // as we'll be calculating volume on a weekly basis starting on Monday (1)
        //const lastWorkoutDate
      });

      exerciseInWeek.forEach(week => {
        let totalKgLifted = 0;
        let totalLbLifted = 0;
        let bodyPartId, exerciseId;

        week.workouts.forEach(workout => {
          if (workout.Exercises[0] && workout.Exercises[0].TotalWeight) {
            if (workout.Exercises[0] && workout.Exercises[0].Sets) {
              let ids = this.findIdsFromSets(workout.Exercises[0].Sets);
              bodyPartId = ids.bodyPartId;
              exerciseId = ids.exerciseId;
            }
            // console.log(workout.Exercises[0].TotalWeight.Kg);
            // console.log(workout.Exercises[0].TotalWeight.Lb);
            totalKgLifted += workout.Exercises[0].TotalWeight.Kg;
            totalLbLifted += workout.Exercises[0].TotalWeight.Lb;
          }
        });
        week.bodyPartId = bodyPartId;
        week.exerciseId = exerciseId;
        week.totalKgLifted = totalKgLifted.toFixed(1);
        week.totalLbLifted = totalLbLifted.toFixed(1);
      });
      const exerciseInWeekWithId = exerciseInWeek.filter(exercise => {
        return exercise.exerciseId;
      });
      return exerciseInWeekWithId;
    }
  }
};
</script>

<style></style>
