<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">
      {{ `Total Weight Lifted (${units}) by Week Number for ${bodyPartName}` }}
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
import VolumeCalculationMixin from '@/mixins/VolumeCalculationMixin.js';
import { getFitLine } from '@/services/calculateTrendLine';

export default {
  mixins: [VolumeCalculationMixin],
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
    weekYearFrom: {
      type: String,
      required: false,
      default: ''
    },
    weekYearTo: {
      type: String,
      required: false,
      default: ''
    },
    units: {
      type: String,
      default: 'kg'
    }
  },
  data() {
    return {
      exerciseVolume: []
    };
  },
  computed: {
    chartOptions() {
      let baseOptions = {
        chart: {
          id: 'bodypartvolumechart'
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          labels: {
            show: true,
            hideOverlappingLabels: true
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
      };
      return {
        ...baseOptions,
        ...{
          xaxis: {
            categories: this.filteredXValues,
            title: {
              text: 'Training Week'
            },
            labels: {
              show: true
            }
          }
        }
      };
    },
    yTotalWeightValues() {
      const yVals = [];
      this.filteredXValues.forEach(week => {
        const yValue =
          this.units === 'kg'
            ? parseFloat(this.bodyPartData[week].totalKgLifted).toFixed(1)
            : parseFloat(this.bodyPartData[week].totalLbLifted).toFixed(1);
        yVals.push(yValue);
      });
      return yVals;
    },
    yFitValues() {
      return getFitLine(this.yTotalWeightValues);
    },
    series() {
      return [
        {
          name: `Total ${this.units} Lifted`,
          data: this.yTotalWeightValues
        },
        {
          name: 'Trend',
          data: this.yFitValues
        }
      ];
    },
    tableData() {
      return this.exerciseVolume.filter((exercise, idx) => {
        return idx === this.selectedBodyPart;
      });
    }
  }
};
</script>
