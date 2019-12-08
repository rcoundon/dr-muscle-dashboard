<template>
  <div>
    <p v-for="exercise in exercises" :key="exercise.id">{{exercise.id}}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import getExerciseHistory from '@/services/getExerciseHistory';

export default {
  computed: {
    ...mapGetters('storeAuth', ['token']),
    ...mapGetters('storeExercises', ['exercises'])
  },
  data() {
    return {
      exerciseHistory: []
    };
  },
  async created() {
    try {
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
      console.log(JSON.stringify(this.exerciseHistory));
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

<style>
</style>
