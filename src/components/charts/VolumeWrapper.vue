<template>
  <div style="min-height 95vh">
    <p class="is-size-3">
      {{ exercise }}
    </p>

    <div class="columns" style="min-height: 100vh">
      <div class="column">
        <volume-over-time
          :weight="weight"
          :reps="reps"
          :dates="dates"
          :exercise="exercise"
        />
      </div>
      <div class="column">
        <volume-table
          :weight="weight"
          :reps="reps"
          :dates="dates"
          :exercise="exercise"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VolumeOverTime from '@/components/charts/VolumeOverTime.vue';
import VolumeTable from '@/components/charts/VolumeTable.vue';

export default {
  components: {
    VolumeOverTime,
    VolumeTable
  },
  props: {
    weight: {
      required: true,
      type: Array,
      default: () => []
    },
    reps: {
      required: true,
      type: Array,
      default: () => []
    },
    dates: {
      required: true,
      type: Array,
      default: () => []
    },
    exercise: {
      required: true,
      type: String,
      default: 'Unknown'
    }
  }
};
</script>

<style></style>
