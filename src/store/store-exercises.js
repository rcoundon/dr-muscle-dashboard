import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    exercises: [],
    weekNumbers: [],
    exerciseHistory: {}
  },
  mutations: {
    SET_EXERCISES(state, exercises) {
      state.exercises = exercises;
    },
    SET_EXERCISE_HISTORIES(state, history) {
      state.exerciseHistory = history;
    },
    SET_WEEK_NUMBERS(state, weekNumbers) {
      state.weekNumbers = weekNumbers;
    }
  },
  actions: {
    setExercises({ commit }, exercises) {
      commit('SET_EXERCISES', exercises);
    },
    setExerciseHistory({ commit }, history) {
      commit('SET_EXERCISE_HISTORIES', history);
    },
    setWeekNumbers({ commit }, weekNumbers) {
      commit('SET_WEEK_NUMBERS', weekNumbers);
    }
  },
  getters: {
    exercises: state => state.exercises,
    exerciseHistory: state => state.exerciseHistory,
    weekNumbers: state => state.weekNumbers
  }
};
