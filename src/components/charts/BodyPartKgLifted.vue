<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">Total Weight Lifted by Week Number</p>


    <apexchart
      ref="bodypartvolumechart"
      type="line"
      height="300em"
      :series="series"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getBodyPartName } from '@/services/getBodyPartName';
import { getExerciseName } from '@/services/getExerciseName';
import { calculateBodyPartTotals } from '@/services/calculateBodyPartTotals';
import { getFitLine } from '@/services/calculateTrendLine';
import { compareAsc, getWeek } from 'date-fns';

export default {
  props: {
    exerciseData: {
      type: Array,
      required: true,
      default: () => []
    },
    exerciseHistory: {
      type: Array,
      required: true,
      default: () => []
    },
    selectedBodyPart: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      exerciseVolume: [],
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
        if (!newVal || !this.bodyPartTotals) return;
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
      if (
        !this.selectedBodyPart ||
        !this.bodyPartTotals ||
        !this.bodyPartTotals.bodyPartVolumes
      )
        return [];
      const bodyPartData = this.bodyPartTotals.bodyPartVolumes[
        this.selectedBodyPart
      ];
      return bodyPartData ? bodyPartData : [];
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
  mounted() {
    this.buildAllWorkoutVolumes();
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
      if (!this.exerciseHistory) this.exerciseVolume = [];
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
      });

      exerciseInWeek.forEach(week => {
        let totalKgLifted = 0;
        let totalLbLifted = 0;
        let totalHardSets = 0;
        let bodyPartId, exerciseId;

        week.workouts.forEach(workout => {
          if (workout.Exercises[0] && workout.Exercises[0].TotalWeight) {
            if (workout.Exercises[0] && workout.Exercises[0].Sets) {
              const ids = this.findIdsFromSets(workout.Exercises[0].Sets);
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
  }
};
</script>
