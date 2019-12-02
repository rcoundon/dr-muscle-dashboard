<template>
  <div>
    {{ displayExercise }}
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import getExerciseHistory from '@/services/getExerciseHistory.js';

export default {
  props: {
    exerciseId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      displayExercise: undefined
    };
  },
  computed: {
    ...mapGetters('storeExercise', ['exercise']),
    ...mapGetters('storeAuth', ['token'])
  },
  watch: {
    exerciseId: {
      immediate: true,
      handler: function(newVal) {
        this.getData(newVal);
      }
    }
  },
  async mounted() {},
  methods: {
    ...mapActions('storeExercise', ['setExercise']),
    async getData(exerciseId) {
      const data = await getExerciseHistory(
        this.$axios,
        this.token,
        exerciseId
      );
      await this.setExercise({
        id: exerciseId,
        data
      });
      this.displayExercise = this.exercise(this.exerciseId);
    }
  }
};
</script>

<style></style>
