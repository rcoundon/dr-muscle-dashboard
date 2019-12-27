<template>
  <div
    class="card"
    style="padding-top: 1em"
  >
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />
    <p class="has-text-centered is-size-4 has-text-weight-semibold">
      Count of exercises performed
    </p>
    <p
      v-if="!isLoading"
      class="is-italic has-text-primary has-text-centered is-size-5 has-text-weight-semibold"
    >
      Tap on an exercise for your 1RM history
    </p>
    <apexchart
      v-if="series && series.length > 0"
      ref="timesperformedchart"
      height="350px"
      type="bar"
      :series="series"
      :options="chartOptions"
    />
    <div v-if="error">
      <p class="is-danger">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script>
import fastCopy from 'fast-copy';
import { mapGetters, mapActions } from 'vuex';
import getExerciseCountOverTime from '@/services/getExerciseCountOverTime.js';

export default {
  props: {
    width: {
      required: false,
      type: String,
      default: '20em'
    }
  },
  data() {
    // bind this for use inside chart options click handler
    const self = this;
    return {
      error: undefined,
      isLoading: false,
      rawData: null,
      chartOptions: {
        chart: {
          selection: {
            enabled: true,
            fill: {
              color: '#24292e',
              opacity: 0.1
            }
          },
          type: 'bar',
          events: {
            click: function(event, chartContext, config) {
              self.$emit('selectedExercise', config.dataPointIndex);
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: val => {
            return ((val * 100) / this.totalSets).toFixed(1) + '%';
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top' // top, center, bottom
            }
          }
        },
        xaxis: {
          categories: this.exercises,
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true
          }
        },
        yaxis: {
          title: {
            text: 'Number of times performed'
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters('storeAuth', ['token']),
    totalSets() {
      return this.rawData.reduce((acc, cur) => {
        return acc + cur.NoOfTimePerform;
      }, 0);
    },
    series() {
      if (!this.rawData) return [];
      const data = this.rawData.map(item => {
        return item.NoOfTimePerform;
      });
      return [
        {
          name: 'Times Performed',
          data
        }
      ];
    },
    exercises() {
      if (!this.rawData) return [];
      return this.rawData.map(item => {
        return item.Label;
      });
    }
  },
  watch: {
    exercises: {
      handler: function(newVal) {
        const newOptions = fastCopy(this.chartOptions);
        newOptions.xaxis.categories = newVal;
        this.chartOptions = newOptions;
      }
    },
    rawData: {
      handler: function(newResults) {
        if (!newResults || newResults.length === 0) return;
        const exerciseArray = newResults.map(exercise => {
          return {
            id: exercise.Id,
            Label: exercise.Label
          };
        });
        this.setExercises(exerciseArray);
      }
    }
  },
  async mounted() {
    await this.getExerciseCountData();
  },
  methods: {
    ...mapActions('storeExercises', ['setExercises']),
    chartClicked() {},
    async getExerciseCountData() {
      console.time('getExerciseCountData');
      try {
        this.isLoading = true;
        this.error = undefined;
        const result = await getExerciseCountOverTime(
          this.$axios,
          this.token,
          undefined,
          undefined
        );
        this.rawData = result.Result;
      } catch (err) {
        this.error = err;
      } finally {
        console.timeEnd('getExerciseCountData');
        this.isLoading = false;
      }
    }
  }
};
</script>

<style></style>
