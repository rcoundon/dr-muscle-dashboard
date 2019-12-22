<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column">
        <div v-if="exercises">
          <body-part-volume :exerciseData="exercises" style="margin-bottom: 1rem"/>
          <body-part-kg-lifted :exerciseData="exercises"/>
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
      selectedMuscleGroup: ''
    };
  },
  computed: {
    ...mapGetters('storeExercises', ['exercises']),
    selectedExerciseName() {
      if (!this.exercises) return '';
      const exercise = this.exercises.filter(exercise => {
        return exercise.id === this.selectedExercise;
      });
      return exercise[0] ? exercise[0].Label : '';
    }
  },
  methods: {
    setSelectedExercise(evt) {
      console.log('caught', evt);
      this.selectedExercise = this.exercises[evt].id;
    }
  }
};
</script>
