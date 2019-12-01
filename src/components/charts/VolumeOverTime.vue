<template>
  <apexchart
    :width="width"
    type="line"
    :series="series"
    :options="chartOptions"
    ref="volumechart"
  />
</template>

<script>
export default {
  props: {
    weight: {
      required: true,
      type: Array,
      default: () => []
    },
    height: {
      required: false,
      type: String,
      default: '20em'
    },
    reps: {
      required: true,
      type: Array,
      default: () => []
    },
    dates: {
      required: true,
      type: Array,
      default: () => []
    },
    exercise: {
      required: true,
      type: String,
      default: 'Unknown'
    },
    width: {
      required: false,
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'training-data'
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        xaxis: {
          categories: this.dates,
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
            text: 'Volume'
          }
        }
      },
      series: [
        {
          name: this.exercise,
          data: this.trainingData
        }
      ]
    };
  },
  created() {
    this.buildChartData();
  },
  watch: {
    reps: {
      handler: function(data) {
        console.log('watcher', data);
        this.buildChartData();
        this.$forceUpdate();
      }
    }
  },
  methods: {
    buildChartData() {
      console.log('building ChartData');
      const data = [];
      this.reps.forEach((value, idx) => {
        let volume = value * this.weight[idx];
        volume = volume.toFixed(1);
        data.push(volume);
      });
      let newData = [];
      newData.push({
        data,
        name: this.exercise
      });
      this.series = newData;
      this.$forceUpdate();
    }
  }
};
</script>

<style></style>
