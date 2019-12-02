<template>
  <div>
    <p class="is-size-3">{{ exerciseName }} Volume</p>
    <apexchart
      type="line"
      height="300em"
      width="1000px"
      :series="series"
      :options="chartOptions"
      ref="volumechart"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import getExerciseHistory from '@/services/getExerciseHistory.js';

export default {
  props: {
    exerciseId: {
      type: Number,
      required: true
    },
    exerciseName: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      categories: [],
      displayExercise: undefined,
      chartOptions: {
        chart: {
          id: 'training-data1'
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true,
            minHeight: '120'
          },
          title: {
            text: 'Training Date'
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
          name: this?.displayExercise?.exercise,
          data: this.displayExercise
        }
      ]
    };
  },
  computed: {
    ...mapGetters('storeExercise', ['exercise']),
    ...mapGetters('storeAuth', ['token']),
    exerciseHistory() {
      if (!this.displayExercise) return {};
      const overallVolume = {};
      let volume = 0;
      let include = false;
      this.displayExercise.forEach(workoutDateItem => {
        include = false;
        volume = 0;
        workoutDateItem.Exercises.forEach(exercise => {
          exercise.Sets.forEach(cur => {
            volume += cur.Reps * cur.Weight.Kg;
          });
          if (volume > 0) {
            include = true;
          }
        });
        const key = workoutDateItem.WorkoutDate;
        if (include) {
          overallVolume[key] = volume;
        }
      });
      return overallVolume;
    }
  },
  watch: {
    exerciseId: {
      immediate: true,
      handler: function(newVal) {
        this.getData(newVal);
      }
    },
    exerciseHistory: {
      immediate: true,
      handler: function() {
        const newData = [];
        newData.push({
          data: Object.values(this.exerciseHistory),
          name: this?.displayExercise?.exercise
        });

        this.series = newData;

        const categories = this.buildCategories();
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            xaxis: {
              categories,
              labels: {
                show: true,
                rotate: -45,
                rotateAlways: true,
                minHeight: '120'
              },
              title: {
                text: 'Training Date'
              }
            }
          }
        };
      }
    }
  },
  async mounted() {},
  methods: {
    ...mapActions('storeExercise', ['setExercise']),
    buildCategories() {
      if (!this.exerciseHistory) return [];
      const dates = Object.keys(this.exerciseHistory);
      return dates.map(workoutDate => {
        return moment(workoutDate).format('DD-MMM-YY');
      });
    },
    async getData(exerciseId) {
      const data = await getExerciseHistory(
        this.$axios,
        this.token,
        exerciseId
      );
      await this.setExercise({
        id: exerciseId,
        data
      });
      this.displayExercise = this.exercise(this.exerciseId);
    }
  }
};
</script>

<style></style>
