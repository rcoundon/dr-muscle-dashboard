<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">
      Number of Hard Sets By Week Number for {{ bodyPartName }}
    </p>
    <apexchart
      v-if="showChart"
      ref="bodypartvolumechart"
      type="line"
      height="300em"
      :series="series"
      :options="chartOptions"
    />
    <!-- <b-table
      :data="exerciseTotals"
      :default-sort-direction="'desc'"
      default-sort="count.totalHardSets"
    >
      <template slot-scope="props">
        <b-table-column
          sortable
          field="exerciseName"
          label="Exercise"
        >
          {{ props.row.exerciseName }}
        </b-table-column>
        <b-table-column
          sortable
          field="count.totalWorkouts"
          label="Appeared in # Workouts"
        >
          {{ props.row.count.totalWorkouts }}
        </b-table-column>
        <b-table-column
          sortable
          field="count.totalHardSets"
          label="Total Hard Sets"
        >
          {{ props.row.count.totalHardSets }}
        </b-table-column>
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>Nothing here yet...</p>
          </div>
        </section>
      </template>
    </b-table> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VolumeCalculationMixin from '@/mixins/VolumeCalculationMixin.js';
import { getExerciseName } from '@/services/getExerciseName';
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
            text: 'Number of Sets'
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
      return getFitLine(this.filteredYSetValues);
    },
    series() {
      return [
        {
          name: 'Hard Sets',
          data: this.filteredYSetValues
        },
        {
          name: 'Trend',
          data: this.yFitValues
        }
      ];
    }
    // exerciseTotals() {
    //   if (
    //     !this.selectedBodyPart ||
    //     !this.bodyPartTotals ||
    //     !this.bodyPartTotals.exerciseTotals ||
    //     !this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart]
    //   ) {
    //     return [];
    //   }
    //   const exerciseIds = Object.keys(
    //     this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart]
    //   );
    //   return exerciseIds.map(exercise => {
    //     const exerciseName = this.getExerciseName(+exercise);
    //     return {
    //       exerciseName,
    //       count: this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart][
    //         +exercise
    //       ]
    //     };
    //   });
    // }
  }
};
</script>
