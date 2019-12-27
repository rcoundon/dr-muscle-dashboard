<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">
      1RM for {{ exerciseName }}
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
            text: '1RM'
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
    exerciseMaxes: {
      immediate: true,
      handler: function(newVal) {
        if (!newVal) return;

        const xValues = [];
        const yValues = [];
        // Calculate lines for fit

        newVal.forEach(records => {
          yValues.push(records.oneRepMaxKg);
          xValues.push(records.workoutDate);
        });
        const yFitValues = getFitLine(yValues);

        this.series = [
          {
            name: '1RM (kg)',
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
            }
          }
        };
      }
    }
  }
};
</script>
