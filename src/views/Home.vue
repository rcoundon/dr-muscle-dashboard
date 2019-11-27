<template>
  <div>
    <b-field>
      <b-select placeholder="Select an exercise" v-model="selectedExercise">
        <option v-for="option in exercises" :value="option" :key="option">
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
      selectedExercise: ""
    };
  },
  computed: {
    exercises() {
      return Object.keys(testData);
    },
    volumeData() {
      return testData[this.selectedExercise];
    }
  },
  created() {
    console.log("setting selectedExercise to ", this.exercises[0]);
    this.selectedExercise = this.exercises[0];
  }
};
</script>
