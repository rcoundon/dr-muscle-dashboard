<template>
  <div class="container is-fluid">
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />
    <div v-if="isLoading">
      <p class="is-size-4 is-primary has-text-weight-semibold">Loading the detail of your workout history...</p>
      <p class="is-size-4 is-primary ">If you've been working out a while</p>
      <p class="is-size-4 is-primary ">This could take up to 30s (but it's worth it!)</p>
      <p class="is-size-4 processing">Loading<span>.</span><span>.</span><span>.</span></p>
    </div>
    <div class="columns">
      <div class="column">
      <b-field style="padding-top: 2em; padding-left: 1em">
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

        <div v-if="exercises && exerciseHistory.length > 0 && selectedBodyPart">
          <body-part-volume :exerciseData="exercises" :exerciseHistory="exerciseHistory" :selectedBodyPart="selectedBodyPart" style="margin-bottom: 1rem"/>
          <body-part-kg-lifted :exerciseData="exercises" :exerciseHistory="exerciseHistory" :selectedBodyPart="selectedBodyPart"/>
        </div>
        <total-exercise-count @selectedExercise="setSelectedExercise" />
        <exercise-history
          v-if="selectedExercise"
          :exercise-id="selectedExercise"
          :exercise-name="selectedExerciseName"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TotalExerciseCount from '@/components/charts/TotalExerciseCount';
import ExerciseHistory from '@/components/charts/ExerciseHistory';
import BodyPartVolume from '@/components/charts/BodyPartVolume';
import BodyPartKgLifted from '@/components/charts/BodyPartKgLifted';
import getExerciseHistory from '@/services/getExerciseHistory';
import bodyPartsObj from '../codes/bodyPartId';

// import testData from '../../test-data/volume-over-time.json';

export default {
  name: 'Home',
  components: {
    TotalExerciseCount,
    ExerciseHistory,
    BodyPartVolume,
    BodyPartKgLifted
  },
  data() {
    return {
      selectedExercise: undefined,
      selectedMuscleGroup: '',
      exerciseHistory: [],
      isLoading: false,
      selectedBodyPart: 2
    };
  },
  computed: {
    ...mapGetters('storeExercises', ['exercises']),
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
    setSelectedExercise(evt) {
      this.selectedExercise = this.exercises[evt].id;
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
