<template>
  <div class="card">
    <div v-if="!showChart">
      <p class="is-size-4 processing">
        Loading weight data for {{ bodyPartName }}<span>.</span><span>.</span><span>.</span>
      </p>
    </div>
    <div v-if="showChart">
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
  </div>
</template>

<script>
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
      type: Object,
      required: true,
      default: () => {
        return {
          setVolume: [],
          weeks: [],
          weightVolumeKg: [],
          weightVolumeLb: []
        };
      }
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
    yFitValues() {
      return getFitLine(this.filteredYWeightValues);
    },
    series() {
      return [
        {
          name: `Total ${this.units} Lifted`,
          data: this.filteredYWeightValues
        },
        {
          name: 'Trend',
          data: this.yFitValues
        }
      ];
    }
  }
};
</script>
