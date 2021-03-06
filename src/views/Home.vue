<template>
  <div class="container is-fluid">
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />
    <div class="columns">
      <div class="column">
        <p
          class="has-text-left has-text-weight-semibold"
          style="padding-left: 1em"
        >
          Select a body part to display your specific training volume
        </p>
        <b-field grouped style="padding-top: 1em">
          <b-field style="padding-left: 1em">
            <b-select
              v-model="selectedBodyPart"
              placeholder="Select a body part"
              icon="child"
            >
              <option
                v-for="bodyPart in bodyParts"
                :key="bodyPart.id"
                :value="bodyPart.id"
              >
                {{ bodyPart.bodyPart }}
              </option>
            </b-select>
          </b-field>
          <b-field style="padding-left: 1em">
            <b-select
              v-model="weightUnits"
              placeholder="Kg or Lb?"
              icon="weight"
            >
              <option key="kg" value="kg">kg</option>
              <option key="lb" value="lb">lb</option>
            </b-select>
          </b-field>
        </b-field>
        <p
          class="has-text-left has-text-weight-semibold"
          style="padding-left: 1em; padding-bottom: 1em"
        >
          Select the start and end dates to be displayed in the charts. Format
          is WeekNumber-Year
        </p>
        <b-field grouped>
          <b-field
            style="padding-left: 1em"
            label="Week From"
            label-position="on-border"
          >
            <b-select
              v-model="weekFrom"
              placeholder="Start of training period"
              icon="calendar"
            >
              <option
                v-for="weekNumber in weekNumbers"
                :key="weekNumber"
                :value="weekNumber"
              >
                {{ weekNumber }}
              </option>
            </b-select>
          </b-field>
          <b-field
            style="padding-left: 1em"
            label="Week To"
            label-position="on-border"
          >
            <b-select
              v-model="weekTo"
              placeholder="End of training period"
              icon="calendar"
            >
              <option
                v-for="weekNumber in weekNumbers"
                :key="weekNumber"
                :value="weekNumber"
              >
                {{ weekNumber }}
              </option>
            </b-select>
          </b-field>
        </b-field>

        <div v-if="exercises && exerciseHistory && selectedBodyPart">
          <body-part-volume
            :exercise-data="exercises"
            :exercise-history="exerciseHistory"
            :selected-body-part="selectedBodyPart"
            :week-year-from="weekFrom"
            :week-year-to="weekTo"
            style="margin-bottom: 1rem"
          />
          <body-part-weight-lifted
            :exercise-data="exercises"
            :exercise-history="exerciseHistory"
            :selected-body-part="selectedBodyPart"
            :week-year-from="weekFrom"
            :week-year-to="weekTo"
            :units="weightUnits"
          />
        </div>
        <total-exercise-count @selected-exercise="setSelectedExercise" />
        <OneRepMax
          v-if="exerciseMaxes && exerciseMaxes.length > 0"
          id="oneRepMax"
          ref="oneRepMax"
          :exercise-maxes="exerciseMaxes"
          :exercise-name="selectedExerciseName"
          :units="weightUnits"
          @hook:mounted="scrollToOneRepMax"
          @one-rep-max-updated="scrollToOneRepMax"
        />
        <div v-if="isLoading" style="padding-top: 1em">
          <p class="is-size-4 is-primary has-text-weight-semibold">
            Loading the detail of your workout history...
          </p>
          <p class="is-size-4 is-primary">If you've been working out a while</p>
          <p class="is-size-4 is-primary">
            this could take around a minute (but it's worth it!)
          </p>
          <p class="is-size-4 processing">
            Loading<span>.</span><span>.</span><span>.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { compareAsc } from 'date-fns';
import TotalExerciseCount from '@/components/charts/TotalExerciseCount';
import BodyPartVolume from '@/components/charts/BodyPartVolume';
import BodyPartWeightLifted from '@/components/charts/BodyPartWeightLifted';
import OneRepMax from '@/components/charts/Exercise1RM';
import getExerciseHistory from '@/services/getExerciseHistory';
import buildOneRepMaxes from '@/services/buildOneRepMaxes';
import { buildWorkoutVolumeByWeek } from '@/services/buildWorkoutVolumeByWeek';
import bodyPartsObj from '../codes/bodyPartId';
import VueScrollTo from 'vue-scrollto';
// import testData from '../../test-data/volume-over-time.json';

export default {
  name: 'Home',
  components: {
    TotalExerciseCount,
    BodyPartVolume,
    BodyPartWeightLifted,
    OneRepMax,
  },
  data() {
    return {
      weightUnits: 'kg',
      selectedExercise: undefined,
      selectedMuscleGroup: '',
      exerciseMaxes: [],
      isLoading: false,
      selectedBodyPart: 2,
      weekFrom: '',
      weekTo: '',
    };
  },
  computed: {
    ...mapGetters('storeExercises', [
      'exercises',
      'weekNumbers',
      'exerciseHistory',
    ]),
    ...mapGetters('storeAuth', ['token']),
    selectedExerciseName() {
      if (!this.exercises) return '';
      const exercise = this.exercises.filter((exercise) => {
        return exercise.id === this.selectedExercise;
      });
      return exercise[0] ? exercise[0].Label : '';
    },
    bodyParts() {
      const bodyPartKeys = Object.keys(bodyPartsObj);
      const bodyParts = bodyPartKeys.map((key) => {
        return {
          id: +key,
          bodyPart: bodyPartsObj[key],
        };
      });
      return bodyParts;
    },
  },
  async created() {
    try {
      this.isLoading = true;
      let { data } = await this.buildHistory();
      const volumeByWeek = buildWorkoutVolumeByWeek(data);
      this.setExerciseHistory(volumeByWeek);
    } catch (err) {
      console.error('Error building history', err);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    ...mapActions('storeExercises', ['setExerciseHistory']),
    scrollToOneRepMax() {
      this.$scrollTo('#oneRepMax', 1000);
    },
    async setSelectedExercise(evt) {
      if (evt === undefined || evt === null) return;
      try {
        this.isLoading = true;
        this.selectedExercise = this.exercises[evt].id;
        if (!this.selectedExercise) return;
        const { data } = await getExerciseHistory(
          this.$axios,
          this.token,
          this.selectedExercise,
          undefined,
        );
        const oneRepMaxData = buildOneRepMaxes(data, this.selectedExercise);
        this.exerciseMaxes = oneRepMaxData.sort((workoutA, workoutB) => {
          const workoutDateA = new Date(workoutA.workoutDate);
          const workoutDateB = new Date(workoutB.workoutDate);
          return compareAsc(workoutDateA, workoutDateB);
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async buildHistory() {
      console.time('buildHistory');
      try {
        this.isLoading = true;
        // Retrieve history data for all exercises performed
        return getExerciseHistory(
          this.$axios,
          this.token,
          undefined,
          undefined,
        );
      } catch (err) {
        console.error(err);
      } finally {
        console.timeEnd('buildHistory');
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
body {
  background: grey;
  font-family: helvetica;
  font-size: 72px;
}
</style>
