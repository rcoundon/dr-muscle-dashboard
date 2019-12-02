<template>
  <div class="container is-fluid">
    <div class="columns">
      <!-- <div class="container" style="padding-top: 2em">
      <b-field grouped>
        <b-select placeholder="Select an exercise" v-model="selectedExercise">
          <option v-for="option in exercises" :value="option" :key="option">
            {{ option }}
          </option>
        </b-select>
        <b-select
          placeholder="Select a muscle group"
          v-model="selectedMuscleGroup"
        >
          <option v-for="option in muscleGroups" :value="option" :key="option">
            {{ option }}
          </option>
        </b-select>
      </b-field>
      <volume-wrapper
        :weight="volumeData.weight"
        :reps="volumeData.reps"
        :dates="volumeData.dates"
        :exercise="selectedExercise"
      />
    </div> -->
      <div class="column is-one-fifth">
        <b-field style="padding-top: 2em">
          <b-select
            v-model="selectedExercise"
            placeholder="Select an exercise"
            icon="dumbbell"
          >
            <option
              v-for="exercise in exercises"
              :key="exercise.id"
              :value="exercise.id"
            >
              {{ exercise.Label }}
            </option>
          </b-select>
        </b-field>
        <br >
        <p>Or click a bar on the graph</p>
        <b-icon
          pack="fas"
          icon="long-arrow-alt-right"
          custom-size="2x"
          type="is-success"
          style="min-width: 10em"
        />
      </div>
      <div class="column">
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
// import VolumeWrapper from '@/components/charts/VolumeWrapper';
import TotalExerciseCount from '@/components/charts/TotalExerciseCount';
import ExerciseHistory from '@/components/charts/ExerciseHistory';

// import testData from '../../test-data/volume-over-time.json';

export default {
  name: 'Home',
  components: {
    // VolumeWrapper,
    TotalExerciseCount,
    ExerciseHistory
  },
  data() {
    return {
      selectedExercise: undefined,
      selectedMuscleGroup: ''
    };
  },
  computed: {
    ...mapGetters('storeExercises', ['exercises']),
    // options() {
    //   return this.exercises.map(exercise => {

    //   })
    // }
    // exercises() {
    //   return Object.keys(testData);
    // },
    // volumeData() {
    //   return testData[this.selectedExercise];
    // },
    // muscleGroups() {
    //   return this.exercises.map(exercise => {
    //     return testData[exercise].primaryMuscleGroup;
    //   });
    // }
    selectedExerciseName() {
      if (!this.exercises) return '';
      const exercise = this.exercises.filter(exercise => {
        return exercise.id === this.selectedExercise;
      });
      return exercise[0] ? exercise[0].Label : '';
    }
  },
  watch: {
    // selectedExercise: {
    //   handler: function() {
    //     this.selectedMuscleGroup = this.volumeData.primaryMuscleGroup;
    //   }
    // }
  },
  created() {
    // this.selectedExercise = this.exercises[0];
  },
  methods: {
    setSelectedExercise(evt) {
      console.log('caught', evt);
      this.selectedExercise = this.exercises[evt].id;
    }
  }
};
</script>
