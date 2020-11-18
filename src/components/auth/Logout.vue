<template>
  <auth-container>
    <template #authForm>
      <p>
        You are now logged out.
        <br />
        <br />To sign in again, please click
        <strong>
          <router-link :to="{ name: 'signin' }">here</router-link>
        </strong>
      </p>
    </template>
  </auth-container>
</template>

<script>
import AuthContainer from './AuthContainer';

export default {
  components: {
    AuthContainer,
  },
};
</script>
