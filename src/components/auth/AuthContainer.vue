<!--
  Component for logging into the portal
-->
<template>
  <section class="hero">
    <div class="hero-body grayscale">
      <div class="tile is-ancestor">
        <div class="tile is-parent" />
        <div class="tile is-parent">
          <div class="has-text-centered tile is-ancestor">
            <div class="tile is-parent" />
            <div id="signup" class="tile is-parent">
              <div class="signin-form box">
                <slot name="authForm" />
              </div>
            </div>
            <div class="tile is-parent" />
          </div>
        </div>
        <div class="tile is-parent" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      email: '',
      password: '',
      loginSuccess: null,
      loginError: null,
    };
  },
  created() {},
  methods: {
    async onSubmit() {
      this.isLoading = true;
      const formData = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.$store.dispatch('storeAuth/login', {
          email: formData.email,
          password: formData.password,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.hero {
  opacity: 0.7;
}

.signin-form {
  width: 70vw;
  margin: 30px auto;
  border: 1px solid #eee;
  padding: 20px;
  box-shadow: 0 2px 3px #ccc;
}
</style>
