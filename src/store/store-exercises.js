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
    }
  },
  actions: {
    setExercises({ commit }, exercises) {
      commit('SET_EXERCISES', exercises);
    }
  },
  getters: {
    exercises: state => state.exercises
  }
};
