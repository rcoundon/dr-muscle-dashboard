<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">Total Weight Lifted (kg) by Week Number</p>
    <apexchart v-if="showChart"
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
            text: 'Volume (kg)'
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
  watch: {
    chartData: {
      handler: function(newVal) {
        if (!newVal || !this.bodyPartTotals) return;
        const xValues = Object.keys(newVal);
        let yTotalKgValues = [];
        xValues.forEach(week => {
          yTotalKgValues.push(parseFloat(newVal[week].totalKgLifted));
        });
        // Calculate lines for fit
        const yFitValues = getFitLine(yTotalKgValues);

        const newData = [];
        newData.push({
          data: xValues,
          name: 'test'
        });

        this.series = [
          {
            name: 'Total kg Lifted',
            data: yTotalKgValues
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
        !this.bodyPartTotals.bodyPartVolumes
      )
        return [];
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
  mounted() {
    this.buildAllWorkoutVolumes();
  },
  methods: {
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
