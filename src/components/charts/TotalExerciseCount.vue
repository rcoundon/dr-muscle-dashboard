<template>
  <div>
    <b-loading
      :is-full-page="true"
      :active.sync="isLoading"
      :can-cancel="false"
    ></b-loading>
    <apexchart
      v-if="series && series.length > 0"
      height="350px"
      type="bar"
      :series="series"
      :options="chartOptions"
      ref="timesperformedchart"
    />
    <div v-if="error">
      <p class="is-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import fastCopy from 'fast-copy';
import { mapGetters } from 'vuex';

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
    return {
      error: undefined,
      isLoading: false,
      rawData: null,
      chartOptions: {
        chart: {
          type: 'bar'
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
    }
  },
  async mounted() {
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
      this.isLoading = false;
    }
  }
};
</script>

<style></style>
