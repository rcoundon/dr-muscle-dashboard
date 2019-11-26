<template>
  <div class="columns">
    <div class="column is-half">
      <volume-over-time
        :weight="volumeData.weight"
        :reps="volumeData.reps"
        :dates="volumeData.dates"
        :exercise="'Bench Press'"
      />
    </div>
    <div class="column">
      <volume-table
        :weight="volumeData.weight"
        :reps="volumeData.reps"
        :dates="volumeData.dates"
        :exercise="'Bench Press'"
      />
    </div>
  </div>
</template>

<script>
import VolumeOverTime from "@/components/charts/VolumeOverTime.vue";
import VolumeTable from "@/components/charts/VolumeTable.vue";

import testData from "../../test-data/volume-over-time.json";

export default {
  name: "home",
  components: {
    VolumeOverTime,
    VolumeTable
  },
  data() {
    return {
      volumeData: testData
    };
  }
};
</script>
