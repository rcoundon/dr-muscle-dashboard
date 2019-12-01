<!--
  Component for logging into the portal
-->
<template>
  <auth-container v-slot:authForm>
    <form @submit.prevent="onSubmit">
      <label class="label has-text-left">Email</label>
      <b-field>
        <b-input
          v-model="email"
          class="has-icons-left"
          type="email"
          placeholder="Email"
          autocomplete="email"
          icon="at"
        ></b-input>
      </b-field>
      <label class="label has-text-left">Password</label>
      <b-field>
        <b-input
          v-model="password"
          class="has-icons-left"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          icon="key"
        ></b-input>
      </b-field>
      <div class="control">
        <button
          type="submit"
          :class="{ button: true, 'is-info': true, 'is-loading': isLoading }"
          @click.prevent="onSubmit()"
        >
          Login
        </button>
      </div>
      <br />
    </form>
    <div v-if="loginError">
      <span
        :class="{ help: true, 'is-danger': true, 'has-text-weight-bold': true }"
      >
        {{ loginError }}
      </span>
    </div>
  </auth-container>
</template>

<script>
// import { eventBus } from '@/events/events';
import AuthContainer from './AuthContainer';
import login from '@/services/login.js';
import { mapActions } from 'vuex';

export default {
  components: {
    AuthContainer
  },
  data() {
    return {
      isLoading: false,
      email: '',
      password: '',
      loginSuccess: null,
      loginError: null
    };
  },
  created() {},
  methods: {
    ...mapActions('storeAuth', ['setToken', 'setUsername', 'setExpiresIn']),
    async onSubmit() {
      this.isLoading = true;
      try {
        this.loginError = undefined;
        const token = await login(this.$axios, this.email, this.password);
        await this.setToken(token.access_token);
        await this.setUsername(this.email);
        await this.setExpiresIn(token.expires_in);
        this.$router.push({
          name: 'home'
        });
      } catch (err) {
        console.error(err.response.data);
        this.loginError = err?.response?.data?.error_description;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.hero {
  opacity: 0.7;
}
</style>
