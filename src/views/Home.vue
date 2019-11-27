<template>
  <div>
    <div class="container" style="padding-top: 2em">
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
    </div>
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
      selectedExercise: "",
      selectedMuscleGroup: ""
    };
  },
  computed: {
    exercises() {
      return Object.keys(testData);
    },
    volumeData() {
      return testData[this.selectedExercise];
    },
    muscleGroups() {
      return this.exercises.map(exercise => {
        return testData[exercise].primaryMuscleGroup;
      });
    }
  },
  watch: {
    selectedExercise: {
      handler: function() {
        this.selectedMuscleGroup = this.volumeData.primaryMuscleGroup;
      }
    }
  },
  created() {
    console.log("setting selectedExercise to", this.exercises[0]);
    console.log(
      "setting selectedMuscleGroup to ",
      this.exercises[0].primaryMuscleGroup
    );
    this.selectedExercise = this.exercises[0];
  }
};
</script>
