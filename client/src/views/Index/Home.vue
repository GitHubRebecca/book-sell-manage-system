<template>
  <div>Home</div>
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
</style>
