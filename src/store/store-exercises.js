import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    exercises: []
  },
  mutations: {
    SET_EXERCISES(state, exercises) {
      state.exercises = exercises;
    },
    SET_EXERCISE_HISTORIES(state, history) {
      state.exerciseHistory = history;
    }
  },
  actions: {
    setExercises({ commit }, exercises) {
      commit('SET_EXERCISES', exercises);
    },
    setExerciseHistory({ commit }, history) {
      commit('SET_EXERCISE_HISTORIES', history);
    }
  },
  getters: {
    exercises: state => state.exercises,
    exerciseHistory: state => state.exerciseHistory
  }
};
