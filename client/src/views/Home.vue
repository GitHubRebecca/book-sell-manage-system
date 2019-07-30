<template>
  <div class="home">home{{user.username}}</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";

@Component({
  components: {}
})
export default class Home extends Vue {
  @State("user") user: any
}
</script>
