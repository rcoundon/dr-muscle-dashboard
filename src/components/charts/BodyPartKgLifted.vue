<template>
  <div class="card">
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />
    <p class="has-text-centered is-size-4 has-text-weight-semibold">Total Weight Lifted by Week Number</p>
    <b-field style="padding-top: 2em; padding-left: 1em">
      <b-select
        v-model="selectedBodyPart"
        placeholder="Select a body part"
        icon="child"
      >
        <option
          v-for="bodyPart in bodyParts"
          :key="bodyPart.id"
          :value="bodyPart.id"
        >
          {{ bodyPart.bodyPart }}
        </option>
      </b-select>
    </b-field>

    <apexchart
      ref="bodypartvolumechart"
      type="line"
      height="300em"
      :series="series"
      :options="chartOptions"
    />
    <!-- <b-table :data="exerciseVolume">
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
    </b-table> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import getExerciseHistory from '@/services/getExerciseHistory';
import { getBodyPartName } from '@/services/getBodyPartName';
import { getExerciseName } from '@/services/getExerciseName';
import { calculateBodyPartTotals } from '@/services/calculateBodyPartTotals';
import { getFitLine } from '@/services/calculateTrendLine';
import { compareAsc, getWeek } from 'date-fns';
import bodyPartsObj from '../../codes/bodyPartId';

export default {
  props: {
    exerciseData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: false,
      exerciseHistory: [],
      exerciseVolume: [],
      selectedBodyPart: undefined,
      chartOptions: {
        chart: {
          id: 'bodypartvolumechart'
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          labels: {
            show: true
          },
          title: {
            text: 'Training Week'
          }
        },
        yaxis: {
          title: {
            text: 'Volume (kg)'
          }
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        }
      },
      series: [
        {
          name: this?.selectedBodyPart,
          data: this.tableData
        }
      ]
    };
  },
  watch: {
    chartData: {
      handler: function(newVal) {
        if (!newVal) return;
        const xValues = Object.keys(newVal);
        let yTotalKgValues = [];
        xValues.forEach(week => {
          yTotalKgValues.push(parseFloat(newVal[week].totalKgLifted));
        });
        // Calculate lines for fit
        const yFitValues = getFitLine(yTotalKgValues);

        const newData = [];
        newData.push({
          data: xValues,
          name: 'test'
        });

        this.series = [
          {
            name: 'Total Kg Lifted',
            data: yTotalKgValues
          },
          {
            name: 'Trend',
            data: yFitValues
          }
        ];

        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories: xValues,
              labels: {
                show: true
              }
            }
          }
        };
      }
    }
  },
  computed: {
    ...mapGetters('storeAuth', ['token']),
    chartData() {
      if (!this.selectedBodyPart) return [];
      const bodyPartData = this.bodyPartTotals[this.selectedBodyPart];
      return bodyPartData ? bodyPartData : [];
    },
    bodyParts() {
      // const bodyPartArray = JSON.parse(bodyPartsObj);
      const bodyPartKeys = Object.keys(bodyPartsObj);
      const bodyParts = bodyPartKeys.map(key => {
        return {
          id: key,
          bodyPart: bodyPartsObj[key]
        };
      });
      return bodyParts;
    },
    tableData() {
      return this.exerciseVolume.filter(exercise => {
        return exercise.exerciseId === this.selectedExercise;
      });
    },
    bodyPartTotals() {
      return calculateBodyPartTotals(this.exerciseVolume);
    }
  },
  async created() {
    try {
      this.isLoading = true;
      const responsePromises = this.exerciseData.map(exercise => {
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
      return getExerciseName(this.exerciseData, id);
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
        let totalHardSets = 0;
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
  }
};
</script>

<style></style>
