<template>
  <nav
    class="navbar has-background-grey-lighter"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item has-background-grey-lighter"
        href="https://dr-muscle.com/"
        target="_new"
      >
        <img src="Dr.-Muscle-logo.png" style="max-height: 5em" />
      </a>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="portal-navbar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="portal-navbar" class="navbar-menu has-background-grey-lighter">
      <div class="navbar-start"></div>
      <div class="navbar-end">
          <p class="navbar-item has-text-weight-semibold">
            {{ username }}
          </p>

          <div class="buttons">
            <div class="navbar-item nav-item" v-if="showLogout">
              <a class="button is-primary" @click="logout">
                Logout
              </a>
            </div>
            <div class="navbar-item nav-item"></div>
            <div class="navbar-item nav-item"></div>
          </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('storeAuth', ['username']),
    showLogout() {
      return this.$route.name !== 'login';
    }
  },
  methods: {
    ...mapActions('storeAuth', ['setToken', 'setUsername', 'setExpiresIn']),
    logout() {
      this.setToken(undefined);
      this.setUsername(undefined);
      this.setExpiresIn(0);
      this.$router.push({
        name: 'login'
      });
    }
  }
};
</script>

<style scoped>
.logo {
  font-weight: bold;
  color: white;
}

.logo a {
  text-decoration: none;
  color: white;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
}

li {
  margin: 0 16px;
}

li a {
  text-decoration: none;
  color: white;
}

li a:hover,
li a:active,
li a.RouterLink-active {
  color: #fa923f;
}
.logout {
  background-color: transparent;
  border: none;
  font: inherit;
  color: white;
  cursor: pointer;
}
</style>
