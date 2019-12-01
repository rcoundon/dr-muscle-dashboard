<template>
  <apexchart
    v-if="series"
    height="350px"
    type="bar"
    :series="series"
    :options="chartOptions"
    ref="timesperformedchart"
  />
</template>

<script>
import axios from 'axios';
import fastCopy from 'fast-copy';

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
      rawData: null,
      chartOptions: {
        chart: {
          type: 'bar'
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
            rotate: -90,
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
  async created() {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer X`
      },
      data: { ExerciseId: null, PeriodSinceToday: '-365.00:00:00.0000020' },
      url:
        'http://drmuscle.azurewebsites.net//api/WorkoutLog/GetUserExerciseCount'
    };
    try {
      const result = await axios(options);
      this.rawData = result.data.Result;
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

<style></style>
