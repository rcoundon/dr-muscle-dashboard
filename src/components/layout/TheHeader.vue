<template>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a
        class="navbar-item"
        href="https://dr-muscle.com/"
        target="_new"
      >
        <img src="Dr.-Muscle-logo.png" style="max-height: 5em" />
    </a>
    <div class="navbar-item" v-if="showLogout">
      <div class="buttons">
        <a class="button is-primary"  @click="logout">
          Logout
        </a>
      </div>
    </div>


    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" @click="showMenu">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu" ref="navbarMenu">
    <div class="navbar-start">
      <a class="navbar-item">
        Home
      </a>

      <a class="navbar-item">
        Documentation
      </a>

      <div class="navbar-item has-dropdown is-hoverable">

        <div class="navbar-dropdown">
          <a class="navbar-item">
            About
          </a>
          <a class="navbar-item">
            Jobs
          </a>
          <a class="navbar-item">
            Contact
          </a>
          <hr class="navbar-divider">
          <a class="navbar-item">
            Report an issue
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
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
    },
    showMenu() {
      // const nav = this.$refs.navbarMenu;
      // const className = nav.getAttribute('class');
      // if (className == 'nav-right nav-menu') {
      //   nav.className = 'nav-right nav-menu is-active';
      // } else {
      //   nav.className = 'nav-right nav-menu';
      // }
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
