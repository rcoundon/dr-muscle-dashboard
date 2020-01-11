import { mapGetters, mapActions } from 'vuex';
import sortWeekAndYear from '@/services/sortWeekAndYear';
import { differenceInDays } from 'date-fns';
import { buildWorkoutVolumeByWeek } from '@/services/buildWorkoutVolumeByWeek';
import { calculateBodyPartTotals } from '@/services/calculateBodyPartTotals';
import { getExerciseName } from '@/services/getExerciseName';
import convertWeekNumberAndYearToDate from '@/services/convertWeekNumberAndYearToDate';
import getBodyPartName from '@/services/getBodyPartName';

export default {
  ...mapGetters('storeExercises', ['exerciseHistory']),
  computed: {
    showChart() {
      return this?.series[0]?.data?.length > 0;
    },
    bodyPartData() {
      if (!this.exerciseHistory) return [];
      return this.exerciseHistory[this.selectedBodyPart];
    },
    xValues() {
      if (!this.exerciseHistory) return [];
      return this.exerciseHistory[this.selectedBodyPart].weeks;
    },
    sortedXValues() {
      if (!this.xValues || this.xValues.length === 0) return [];
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
    // filteredYValues() {
    //   let returnVal;
    //   if (this.weekYearFrom && this.weekYearTo) {
    //     returnVal = this.sortedYValues.filter(week => {
    //       const thisWeek = convertWeekNumberAndYearToDate(week);
    //       const differenceFromToTest = differenceInDays(
    //         this.dateFrom,
    //         thisWeek
    //       );
    //       const differenceTestToTo = differenceInDays(thisWeek, this.dateTo);

    //       if (differenceFromToTest <= 0) {
    //         if (differenceTestToTo <= 0) {
    //           return true;
    //         }
    //       }
    //       return false;
    //     });
    //   } else {
    //     returnVal = [...this.sortedXValues];
    //   }
    //   return returnVal;
    // },
    dateFrom() {
      if (!this.weekYearFrom) return undefined;
      return convertWeekNumberAndYearToDate(this.weekYearFrom);
    },
    dateTo() {
      if (!this.weekYearTo) return undefined;
      return convertWeekNumberAndYearToDate(this.weekYearTo);
    },
    bodyPartTotals() {
      if (!this.exerciseHistory) return [];
      return this.exerciseHistory[this.selectedBodyPart];
    },
    bodyPartName() {
      return this.getBodyPartName(this.selectedBodyPart);
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
      // this.exerciseVolume = this.exerciseHistory.map(exercise => {
      return buildWorkoutVolumeByWeek();
      // });
    }
  }
};
