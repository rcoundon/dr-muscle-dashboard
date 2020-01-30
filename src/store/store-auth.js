import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    token: undefined,
    username: undefined,
    expiresIn: 0,
    isAuthenticated: false,
    authType: undefined,
    email: undefined,
    name: undefined
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    REMOVE_TOKEN(state) {
      state.token = undefined;
    },
    SET_USERNAME(state, username) {
      state.username = username;
    },
    SET_EXPIRES_IN(state, expiresIn) {
      state.expiresIn = expiresIn;
    },
    SET_IS_AUTHENTICATED(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    SET_AUTH_TYPE(state, authType) {
      state.authType = authType;
    },
    SET_EMAIL(state, email) {
      state.email = email;
    },
    SET_NAME(state, name) {
      state.name = name;
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    setUsername({ commit }, username) {
      commit('SET_USERNAME', username);
    },
    setExpiresIn({ commit }, expiresIn) {
      commit('SET_EXPIRES_IN', expiresIn);
    },
    setIsAuthenticated({ commit }, isAuthenticated) {
      commit('SET_IS_AUTHENTICATED', isAuthenticated);
    },
    setAuthType({ commit }, authType) {
      commit('SET_AUTH_TYPE', authType);
    },
    setEmail({ commit }, email) {
      commit('SET_EMAIL', email);
    },
    setName({ commit }, name) {
      commit('SET_NAME', name);
    }
  },
  getters: {
    token: state => state.token,
    username: state => state.username,
    expiresIn: state => state.expiresIn,
    isAuthenticated: state => state.isAuthenticated,
    authType: state => state => state.authType,
    email: state => state => state.email,
    name: state => state => state.name
  }
};
