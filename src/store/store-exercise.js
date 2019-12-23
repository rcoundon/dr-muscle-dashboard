import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    performedExercises: {}
  },
  mutations: {
    SET_EXERCISE(state, exercise) {
      state.performedExercises[exercise.id] = exercise.data.Result;
    }
  },
  actions: {
    setExercise({ commit }, exercise) {
      commit('SET_EXERCISE', exercise);
    }
  },
  getters: {
    exercise(state) {
      return id => {
        return state.performedExercises[id];
      };
    }
  }
};
