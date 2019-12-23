<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">Number of Hard Sets By Week Number</p>
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
     <b-table :data="exerciseTotals"
      :default-sort-direction="'desc'"
      default-sort="count"
    >
      <template slot-scope="props">
        <b-table-column sortable field="exerciseName" label="Exercise">
          {{ props.row.exerciseName }}
        </b-table-column>
        <b-table-column sortable field="count" label="Appeared in # Workouts">
          {{ props.row.count }}
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
    },
    exerciseHistory: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
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
            show: true,
            hideOverlappingLabels: true
          },
          title: {
            text: 'Training Week'
          }
        },
        yaxis: {
          title: {
            text: 'Number of Sets'
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
        let yHardSetValues = [];
        xValues.forEach(week => {
          yHardSetValues.push(parseFloat(newVal[week].totalHardSets));
        });
        // Calculate lines for fit
        const yFitValues = getFitLine(yHardSetValues);
        const newData = [];
        newData.push({
          data: xValues,
          name: 'test'
        });

        this.series = [
          {
            name: 'Hard Sets',
            data: yHardSetValues
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
              title: {
                text: 'Training Week'
              },
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
      const bodyPartData = this.bodyPartTotals.bodyPartVolumes[
        this.selectedBodyPart
      ];
      return bodyPartData ? bodyPartData : [];
    },
    bodyParts() {
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
      return this.exerciseVolume.filter((exercise, idx) => {
        return idx === this.selectedBodyPart;
      });
    },
    bodyPartTotals() {
      return calculateBodyPartTotals(this.exerciseVolume);
    },
    exerciseTotals() {
      if (
        !this.selectedBodyPart ||
        !this.bodyPartTotals ||
        !this.bodyPartTotals.exerciseTotals ||
        !this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart]
      )
        return [];
      const exerciseIds = Object.keys(
        this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart]
      );

      return exerciseIds.map(exercise => {
        console.log(+exercise);
        const exerciseName = this.getExerciseName(+exercise);
        return {
          exerciseName,
          count: this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart][
            +exercise
          ]
        };
      });
    }
  },
  async created() {
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
