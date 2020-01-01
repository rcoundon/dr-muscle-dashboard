import { mapActions } from 'vuex';
import sortWeekAndYear from '@/services/sortWeekAndYear';
import { buildWorkoutVolumeByWeek } from '@/services/buildWorkoutVolumeByWeek';
import { calculateBodyPartTotals } from '@/services/calculateBodyPartTotals';
import { getExerciseName } from '@/services/getExerciseName';

export default {
  mounted() {
    this.buildAllWorkoutVolumes();
  },
  computed: {
    showChart() {
      return this?.series[0]?.data?.length > 0;
    },
    bodyPartData() {
      if (!this.bodyPartTotals || !this.bodyPartTotals.bodyPartVolumes)
        return [];
      return this.bodyPartTotals.bodyPartVolumes[this.selectedBodyPart];
    },
    xValues() {
      return Object.keys(this.bodyPartData);
    },
    sortedXValues() {
      return sortWeekAndYear(this.xValues);
    },
    filteredXValues() {
      let returnVal;
      if (this.weekYearFrom && this.weekYearTo) {
        returnVal = this.sortedXValues.map(week => {
          const thisWeek = convertWeekNumberAndYearToDate(week);
          if (differenceInDays(this.dateFrom, thisWeek) >= 0) {
            if (differenceInDays(thisWeek, this.dateTo) >= 0) {
              return week;
            }
          }
        });
      } else {
        returnVal = [...this.sortedXValues];
      }
      return returnVal;
    },
    dateFrom() {
      if (!this.weekYearFrom) return undefined;
      return convertWeekNumberAndYearToDate(this.weekYearFrom);
    },
    dateTo() {
      if (!this.weekYearTo) return undefined;
      return convertWeekNumberAndYearToDate(this.weekYearTo);
    },
    bodyPartTotals() {
      return calculateBodyPartTotals(this.exerciseVolume);
    }
  },
  watch: {
    filteredXValues: {
      handler: function(newVal) {
        this.setWeekNumbers(newVal);
      }
    }
  },
  methods: {
    ...mapActions('storeExercises', ['setWeekNumbers']),
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
