<template>
  <span>
    <p class="is-size-3">
      {{ exercise }}
    </p>

    <div class="columns">
      <div class="column is-half">
        <volume-over-time
          :weight="weight"
          :reps="reps"
          :dates="dates"
          :exercise="'Bench Press'"
        />
      </div>
      <div class="column">
        <volume-table
          :weight="weight"
          :reps="reps"
          :dates="dates"
          :exercise="'Bench Press'"
        />
      </div>
    </div>
  </span>
</template>

<script>
import VolumeOverTime from "@/components/charts/VolumeOverTime.vue";
import VolumeTable from "@/components/charts/VolumeTable.vue";

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
      default: "Unknown"
    }
  }
};
</script>

<style></style>
