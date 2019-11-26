<template>
  <div>
    <volume-wrapper
      :weight="volumeData.weight"
      :reps="volumeData.reps"
      :dates="volumeData.dates"
      :exercise="'Bench Press'"
    />
  </div>
</template>

<script>
import VolumeWrapper from "@/components/charts/VolumeWrapper";

import testData from "../../test-data/volume-over-time.json";

export default {
  name: "home",
  components: {
    VolumeWrapper
  },
  data() {
    return {
      volumeData: testData
    };
  }
};
</script>
