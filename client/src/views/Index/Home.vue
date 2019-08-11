<template>
  <div class="home-wrapper">
    <img src="../../assets/bg.jpg" alt="home">
  </div>
</template>

<script lang="ts">
import { Provide, Component, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation } from "vuex-class";
@Component({
  //这个必须写
  components: {}
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
  .home-wrapper {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
