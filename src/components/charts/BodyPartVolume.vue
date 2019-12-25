<template>
  <div class="card">
    <p class="has-text-centered is-size-4 has-text-weight-semibold">Number of Hard Sets By Week Number</p>
    <apexchart v-if="showChart"
      ref="bodypartvolumechart"
      type="line"
      height="300em"
      :series="series"
      :options="chartOptions"
    />
     <b-table :data="exerciseTotals"
      :default-sort-direction="'desc'"
      default-sort="count.totalHardSets"
    >
      <template slot-scope="props">
        <b-table-column sortable field="exerciseName" label="Exercise">
          {{ props.row.exerciseName }}
        </b-table-column>
        <b-table-column sortable field="count.totalWorkouts" label="Appeared in # Workouts">
          {{ props.row.count.totalWorkouts }}
        </b-table-column>
        <b-table-column sortable field="count.totalHardSets" label="Total Hard Sets">
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
    </b-table>
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
        if (!newVal) return;

        const xValues = Object.keys(newVal);
        let yHardSetValues = [];
        xValues.forEach(week => {
          yHardSetValues.push(parseFloat(newVal[week].totalHardSets));
        });
        // Calculate lines for fit
        const yFitValues = getFitLine(yHardSetValues);
        const newData = [];
        newData.push({
          data: xValues,
          name: 'test'
        });

        this.series = [
          {
            name: 'Hard Sets',
            data: yHardSetValues
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
              title: {
                text: 'Training Week'
              },
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
      return this.exerciseVolume.filter((exercise, idx) => {
        return idx === this.selectedBodyPart;
      });
    },
    bodyPartTotals() {
      return calculateBodyPartTotals(this.exerciseVolume);
    },
    exerciseTotals() {
      if (
        !this.selectedBodyPart ||
        !this.bodyPartTotals ||
        !this.bodyPartTotals.exerciseTotals ||
        !this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart]
      ) {
        return [];
      }
      const exerciseIds = Object.keys(
        this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart]
      );

      return exerciseIds.map(exercise => {
        const exerciseName = this.getExerciseName(+exercise);
        return {
          exerciseName,
          count: this.bodyPartTotals.exerciseTotals[+this.selectedBodyPart][
            +exercise
          ]
        };
      });
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
      this.exerciseVolume = this.exerciseHistory.map(exercise => {
        return buildWorkoutVolumeByWeek(exercise);
      });
    }
  }
};
</script>
