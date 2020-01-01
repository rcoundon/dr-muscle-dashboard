<template>
  <div class="container is-fluid">
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />
    <div class="columns">
      <div class="column">
        <b-field
          grouped
          style="padding-top: 1em"
        >
          <b-field
            style="padding-left: 1em"
          >
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
          <b-field

            style="padding-left: 1em"
          >
            <b-select
              v-model="weightUnits"
              placeholder="Kg or Lb?"
              icon="weight"
            >
              <option
                key="kg"
                value="kg"
              >
                kg
              </option>
              <option
                key="lb"
                value="lb"
              >
                lb
              </option>
            </b-select>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field
            style="padding-left: 1em"
            label="Date From"
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
            label="Date To"
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

        <div v-if="exercises && exerciseHistory.length > 0 && selectedBodyPart">
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
        <total-exercise-count @selectedExercise="setSelectedExercise" />
        <OneRepMax
          v-if="exerciseMaxes && exerciseMaxes.length > 0"
          :exercise-maxes="exerciseMaxes"
          :exercise-name="selectedExerciseName"
          :units="weightUnits"
        />
        <div
          v-if="isLoading"
          style="padding-top: 1em"
        >
          <p class="is-size-4 is-primary has-text-weight-semibold">
            Loading the detail of your workout history...
          </p>
          <p class="is-size-4 is-primary ">
            If you've been working out a while
          </p>
          <p class="is-size-4 is-primary ">
            This could take up to 30s (but it's worth it!)
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
import { mapGetters } from 'vuex';
import { compareAsc } from 'date-fns';
import TotalExerciseCount from '@/components/charts/TotalExerciseCount';
import BodyPartVolume from '@/components/charts/BodyPartVolume';
import BodyPartWeightLifted from '@/components/charts/BodyPartWeightLifted';
import OneRepMax from '@/components/charts/Exercise1RM';
import getExerciseHistory from '@/services/getExerciseHistory';
import buildOneRepMaxes from '@/services/buildOneRepMaxes';
import bodyPartsObj from '../codes/bodyPartId';

// import testData from '../../test-data/volume-over-time.json';

export default {
  name: 'Home',
  components: {
    TotalExerciseCount,
    BodyPartVolume,
    BodyPartWeightLifted,
    OneRepMax
  },
  data() {
    return {
      weightUnits: 'kg',
      selectedExercise: undefined,
      selectedMuscleGroup: '',
      exerciseHistory: [],
      exerciseMaxes: [],
      isLoading: false,
      selectedBodyPart: 2,
      weekFrom: '',
      weekTo: ''
    };
  },
  computed: {
    ...mapGetters('storeExercises', ['exercises', 'weekNumbers']),
    ...mapGetters('storeAuth', ['token']),
    selectedExerciseName() {
      if (!this.exercises) return '';
      const exercise = this.exercises.filter(exercise => {
        return exercise.id === this.selectedExercise;
      });
      return exercise[0] ? exercise[0].Label : '';
    },
    bodyParts() {
      const bodyPartKeys = Object.keys(bodyPartsObj);
      const bodyParts = bodyPartKeys.map(key => {
        return {
          id: +key,
          bodyPart: bodyPartsObj[key]
        };
      });
      return bodyParts;
    }
  },
  watch: {
    exercises: {
      handler: async function() {
        this.buildHistory();
      }
    }
  },
  methods: {
    async setSelectedExercise(evt) {
      try {
        this.isLoading = true;
        if (evt && this?.exercises[evt]?.id) {
          this.selectedExercise = this.exercises[evt].id;
          const data = await getExerciseHistory(
            this.$axios,
            this.token,
            this.selectedExercise,
            undefined
          );
          const oneRepMaxData = buildOneRepMaxes(data, this.selectedExercise);
          this.exerciseMaxes = oneRepMaxData.sort((workoutA, workoutB) => {
            const workoutDateA = new Date(workoutA.workoutDate);
            const workoutDateB = new Date(workoutB.workoutDate);
            return compareAsc(workoutDateA, workoutDateB);
          });
        }
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
        const responsePromises = this.exercises.map(exercise => {
          return getExerciseHistory(
            this.$axios,
            this.token,
            exercise.id,
            undefined
          ).then(data => {
            return {
              exerciseId: exercise.id,
              data
            };
          });
        });
        this.exerciseHistory = await Promise.all(responsePromises);
      } catch (err) {
        console.error(err);
      } finally {
        console.timeEnd('buildHistory');
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
body {
  background: grey;
  font-family: helvetica;
  font-size: 72px;
}
@keyframes blink {
  /**
     * At the start of the animation the dot
     * has an opacity of .2
     */
  0% {
    opacity: 0.2;
  }
  /**
     * At 20% the dot is fully visible and
     * then fades out slowly
     */
  20% {
    opacity: 1;
  }
  /**
     * Until it reaches an opacity of .2 and
     * the animation can start again
     */
  100% {
    opacity: 0.2;
  }
}

.processing span {
  /**
     * Use the blink animation, which is defined above
     */
  animation-name: blink;
  /**
     * The animation should take 1.4 seconds
     */
  animation-duration: 1.4s;
  /**
     * It will repeat itself forever
     */
  animation-iteration-count: infinite;
  /**
     * This makes sure that the starting style (opacity: .2)
     * of the animation is applied before the animation starts.
     * Otherwise we would see a short flash or would have
     * to set the default styling of the dots to the same
     * as the animation. Same applies for the ending styles.
     */
  animation-fill-mode: both;
}

.processing span:nth-child(2) {
  /**
     * Starts the animation of the third dot
     * with a delay of .2s, otherwise all dots
     * would animate at the same time
     */
  animation-delay: 0.2s;
}

.processing span:nth-child(3) {
  /**
     * Starts the animation of the third dot
     * with a delay of .4s, otherwise all dots
     * would animate at the same time
     */
  animation-delay: 0.4s;
}
</style>
