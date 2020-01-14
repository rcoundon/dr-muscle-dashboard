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

@keyframes blink {
  /**
     * At the start of the animation the dot
     * has an opacity of .2
     */
  0% {
    opacity: 0.2;
  }
  /**
     * At 20% the dot is fully visible and
     * then fades out slowly
     */
  20% {
    opacity: 1;
  }
  /**
     * Until it reaches an opacity of .2 and
     * the animation can start again
     */
  100% {
    opacity: 0.2;
  }
}

.processing span {
  /**
     * Use the blink animation, which is defined above
     */
  animation-name: blink;
  /**
     * The animation should take 1.4 seconds
     */
  animation-duration: 1.4s;
  /**
     * It will repeat itself forever
     */
  animation-iteration-count: infinite;
  /**
     * This makes sure that the starting style (opacity: .2)
     * of the animation is applied before the animation starts.
     * Otherwise we would see a short flash or would have
     * to set the default styling of the dots to the same
     * as the animation. Same applies for the ending styles.
     */
  animation-fill-mode: both;
}

.processing span:nth-child(2) {
  /**
     * Starts the animation of the third dot
     * with a delay of .2s, otherwise all dots
     * would animate at the same time
     */
  animation-delay: 0.2s;
}

.processing span:nth-child(3) {
  /**
     * Starts the animation of the third dot
     * with a delay of .4s, otherwise all dots
     * would animate at the same time
     */
  animation-delay: 0.4s;
}

</style>
