<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">
      {{ `Total Weight Lifted (${units}) by Week Number` }}
    </p>
    <apexchart
      v-if="showChart"
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
import { buildWorkoutVolumeByWeek } from '@/services/buildWorkoutVolumeByWeek';

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
    },
    units: {
      type: String,
      default: 'kg'
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
            text: `Volume (${this.units})`
          }
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        subtitle: {
          text: 'x-axis label format is #Week-year'
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
  computed: {
    ...mapGetters('storeAuth', ['token']),
    showChart() {
      return this?.series[0]?.data?.length > 0;
    },
    chartData() {
      if (
        !this.selectedBodyPart ||
        !this.bodyPartTotals ||
        !this.bodyPartTotals.bodyPartVolumes ||
        !this.units
      ) {
        return [];
      }
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
  watch: {
    units: {
      handler() {
        this.buildChartData();
      }
    },
    chartData: {
      handler() {
        this.buildChartData();
      }
    }
  },

  mounted() {
    this.buildAllWorkoutVolumes();
  },
  methods: {
    buildChartData() {
      if (!this.chartData || !this.bodyPartTotals) return;
      const xValues = Object.keys(this.chartData);
      let yTotalWeightValues = [];
      xValues.forEach(week => {
        const yValue =
          this.units === 'kg'
            ? parseFloat(this.chartData[week].totalKgLifted).toFixed(1)
            : parseFloat(this.chartData[week].totalLbLifted).toFixed(1);
        yTotalWeightValues.push(yValue);
      });
      // Calculate lines for fit
      const yFitValues = getFitLine(yTotalWeightValues);

      const newData = [];
      newData.push({
        data: xValues,
        name: 'test'
      });

      this.series = [
        {
          name: `Total ${this.units} Lifted`,
          data: yTotalWeightValues
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
        return buildWorkoutVolumeByWeek(exercise);
      });
    }
  }
};
</script>
