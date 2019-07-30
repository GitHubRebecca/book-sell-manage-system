<template>
  <div class="login-page">
    <div class="page-center">
      <div class="info">
        <div class="title">
          <span>网上书城管理系统</span>
        </div>
        <div class="detail">
          <span>一个管理书本买卖的网站!</span>
        </div>
      </div>
      <!-- 插槽 -->
      <div class="container">
        <slot name="container"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class LoginHeader extends Vue {}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-image: url(../assets/login-back.svg);
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  display: flex;
  justify-content: center;
  .page-center {
    width: 400px;
    padding-top: 80px;
    min-height: 500px;
    .info {
      text-align: center;
      .title {
        display: flex;
        justify-content: center;
        align-items: Center;
        font-size: 32px;
        color: rgba(0, 0, 0, 0.85);
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
      }
      .detail {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        padding: 20px 0px;
        line-height: 1.5;
      }
    }
    .container {
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
    }
  }
}
</style>
