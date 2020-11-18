<template>
  <b-navbar>
    <template slot="brand">
      <a class="navbar-item" href="https://dr-muscle.com/" target="_new">
        <img src="Dr.-Muscle-logo.png" style="max-height: 5em" />
      </a>
    </template>
    <template slot="end">
      <div v-if="showLogout" class="navbar-item">
        <div class="buttons">
          <a class="button is-primary" @click="logout"> Logout </a>
        </div>
      </div>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="showMenu"
      />
    </template>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('storeAuth', ['username']),
    showLogout() {
      return this.$route.name !== 'login';
    },
  },
  methods: {
    ...mapActions('storeAuth', [
      'setToken',
      'setUsername',
      'setExpiresIn',
      'setIsAuthenticated',
    ]),
    logout() {
      this.setToken(undefined);
      this.setUsername(undefined);
      this.setExpiresIn(0);
      this.setIsAuthenticated(false);
      this.$router
        .push({
          name: 'login',
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {});
    },
    showMenu() {
      // const nav = this.$refs.navbarMenu;
      // const className = nav.getAttribute('class');
      // if (className == 'nav-right nav-menu') {
      //   nav.className = 'nav-right nav-menu is-active';
      // } else {
      //   nav.className = 'nav-right nav-menu';
      // }
    },
  },
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
