<template>
  <apexchart
    :width="width"
    type="line"
    :series="series"
    :options="chartOptions"
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
      default: "Unknown"
    },
    width: {
      required: false,
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: "training-data"
        },
        xaxis: {
          categories: this.dates
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
  mounted() {
    this.buildChartData();
  },
  watch: {
    reps: {
      immediate: true,
      handler: function(data) {
        console.log("watcher", data);
        this.buildChartData();
      }
    }
  },
  methods: {
    buildChartData() {
      console.log("buildChartData");
      const data = [];
      this.reps.forEach((value, idx) => {
        let volume = value * this.weight[idx];
        volume = volume.toFixed(1);
        data.push(volume);
      });
      this.series[0].data = data;
      this.$forceUpdate();
    }
  }
};
</script>

<style></style>
