import { mapActions } from 'vuex';
import sortWeekAndYear from '@/services/sortWeekAndYear';
import { differenceInDays } from 'date-fns';
import { buildWorkoutVolumeByWeek } from '@/services/buildWorkoutVolumeByWeek';
import { calculateBodyPartTotals } from '@/services/calculateBodyPartTotals';
import { getExerciseName } from '@/services/getExerciseName';
import convertWeekNumberAndYearToDate from '@/services/convertWeekNumberAndYearToDate';

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
        returnVal = this.sortedXValues.filter(week => {
          const thisWeek = convertWeekNumberAndYearToDate(week);
          const differenceFromToTest = differenceInDays(
            this.dateFrom,
            thisWeek
          );
          const differenceTestToTo = differenceInDays(thisWeek, this.dateTo);

          if (differenceFromToTest <= 0) {
            if (differenceTestToTo <= 0) {
              return true;
            }
          }
          return false;
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
    sortedXValues: {
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
