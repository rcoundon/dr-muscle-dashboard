<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <slot />
      <br>
      <p
        v-if="isAuthenticated"
        class="has-text-weight-semibold has-text-primary"
      >
        Dr. Muscle Open Source Dashboards - v{{ version }}
      </p>
    </div>
  </footer>
</template>

<script>
import packageJson from '../../../package.json';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('storeAuth', ['isAuthenticated']),
    version() {
      return packageJson.version;
    }
  }
};
</script>

<style>
</style>
