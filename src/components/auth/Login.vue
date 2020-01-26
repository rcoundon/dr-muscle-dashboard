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
        />
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
        />
      </b-field>
      <b-field>
        <b-button
          type="submit"
          :class="{ button: true, 'is-info': true, 'is-loading': isLoading }"
          @click.prevent="onSubmit()"
        >
          Login
        </b-button>
        <GoogleLogin
          style="padding-left: 1em"
          :params="params"
          :render-params="renderParams"
          :on-success="onSuccess"
          :on-failure="onFailure"
        />
      </b-field>
      <br>
    </form>
    <p class="has-text-center">
      This is open source software and is <b><i>not</i></b> produced by the Dr Muscle team. <br>As such these dashboards are provided without warranty under the <a
        class="has-text-weight-semibold"
        href="https://opensource.org/licenses/MIT"
      >MIT licence</a>.
    </p>
    <p class="has-text-center">
      If there's anything you think that's not working properly or you want to contribute head over to <a
        class="has-text-weight-semibold"
        target="_new"
        href="https://github.com/rcoundon/dr-muscle-dashboard/issues"
      >Github</a>.
    </p>

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
import GoogleLogin from 'vue-google-login';
import { LoaderPlugin } from 'vue-google-login';
import Vue from 'vue';
Vue.use(LoaderPlugin, {
  client_id:
    '192118200020-vsq4sik0vgh57h5453s76het5rlhneqr.apps.googleusercontent.com'
});
import AuthContainer from './AuthContainer';
import login from '@/services/login.js';
import { mapActions } from 'vuex';

export default {
  components: {
    AuthContainer,
    GoogleLogin
  },
  data() {
    return {
      isLoading: false,
      email: '',
      password: '',
      loginSuccess: null,
      loginError: null,
      params: {
        client_id:
          '192118200020-vsq4sik0vgh57h5453s76het5rlhneqr.apps.googleusercontent.com'
      },
      // only needed if you want to render the button with the google ui
      renderParams: {
        width: 180,
        height: 36,
        longtitle: true
      }
    };
  },
  created() {
    Vue.GoogleAuth.then(auth2 => {
      console.log(auth2.isSignedIn.get());
    });
  },
  methods: {
    ...mapActions('storeAuth', [
      'setToken',
      'setUsername',
      'setExpiresIn',
      'setIsAuthenticated'
    ]),
    async onSuccess(googleUser) {
      const profile = googleUser.getBasicProfile();
      const auth = await googleUser.getAuthResponse(true);
      const email = profile.getEmail(); // This is null if the 'email' scope is not present.
      this.setToken(auth.access_token);
      this.setIsAuthenticated(true);
      this.setUsername(email);
      this.setExpiresIn(auth.expires_in);
      this.redirectToHome();
    },
    redirectToHome() {
      console.log('sending to home');
      this.$router
        .push({
          name: 'home'
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {});
    },
    onFailure() {
      this.loginError = 'Sorry, Google login failed';
    },
    async onSubmit() {
      this.isLoading = true;
      try {
        this.loginError = undefined;
        const token = await login(this.$axios, this.email, this.password);
        await this.setToken(token.access_token);
        await this.setUsername(this.email);
        await this.setExpiresIn(token.expires_in);
        await this.setIsAuthenticated(true);
        this.redirectToHome();
      } catch (err) {
        console.error(err);
        this.loginError = err?.response?.data?.error_description;
        await this.setIsAuthenticated(false);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.hero {
  opacity: 0.8;
}
</style>
