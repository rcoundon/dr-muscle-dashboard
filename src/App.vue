<template>
  <div id="app">
    <the-header />
    <router-view />
    <the-footer />
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader';
import TheFooter from '@/components/layout/TheFooter';

export default {
  components: {
    TheHeader,
    TheFooter
  }
};
</script>

<style lang="scss">
$icon-svg-width: auto;
$icon-svg-height: auto;

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.hero .subtitle {
  padding: 3rem 0;
  line-height: 1.5;
}

.hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('../public/Fit-men-looking-down-dark-80.jpg');
  background-size: cover;
  background-position: center;
  width: 100wh;
  height: 100vh;
  display: flex;
}
</style>
