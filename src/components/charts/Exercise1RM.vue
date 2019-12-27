<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">
      {{ `1RM (${units}s) for ${exerciseName}` }}
    </p>
    <apexchart
      v-if="exerciseMaxes && exerciseMaxes.length > 0"
      ref="1rmchart"
      type="line"
      height="300em"
      :series="series"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { getFitLine } from '@/services/calculateTrendLine';

export default {
  props: {
    exerciseMaxes: {
      type: Array,
      required: true,
      default: () => []
    },
    exerciseName: {
      type: String,
      required: true
    },
    units: {
      type: String,
      required: false,
      default: 'kg'
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: '1rmmaxchart'
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          labels: {
            show: true
          },
          title: {
            text: 'Workout Date'
          }
        },
        yaxis: {
          title: {
            text: `1RM (${this.units})`
          }
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        }
      },
      series: [
        {
          name: this.exerciseName,
          data: []
        }
      ]
    };
  },
  watch: {
    units: {
      handler() {
        this.buildChartData();
      }
    },
    exerciseMaxes: {
      immediate: true,
      handler() {
        this.buildChartData();
      }
    }
  },
  methods: {
    buildChartData() {
      if (!this.exerciseMaxes) return;

      const xValues = [];
      const yValues = [];

      this.exerciseMaxes.forEach(records => {
        const yValue =
          this.units === 'kg' ? records.oneRepMaxKg : records.oneRepMaxKg * 2.2;
        yValues.push(yValue.toFixed(1));
        xValues.push(records.workoutDate);
      });

      // Calculate lines for fit
      const yFitValues = getFitLine(yValues);

      this.series = [
        {
          name: `1RM (${this.units})`,
          data: yValues
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
          },
          yaxis: {
            title: {
              text: `1RM (${this.units})`
            }
          }
        }
      };
    }
  }
};
</script>
