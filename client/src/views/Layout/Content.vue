<template>
  <el-container class="layout-content">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <slot name="left"></slot>
    </el-aside>

    <!-- 右侧页面 -->
    <el-main>
      <!-- 面包屑 -->
      <div class="top">
        <i class="fa fa-reorder"></i>
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item
            v-for="(item,index) in breadCrumbItems"
            :key="index"
            :to="{path:item.path}"
          >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 页面内容 -->
      <div class="content">
        <slot name="content"></slot>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Content extends Vue {
  @Provide() breadCrumbItems: any; // 面包屑的数组

  @Watch("$route") function (to: any, from: any) {
    console.log(to, from) //这两个参数很重要
    this.initBreadCrumbItems(this.$route);
  }

  created() {
    this.initBreadCrumbItems(this.$route);
  }
  //更新面包屑
  initBreadCrumbItems(router: any) {
    let breadCrumbItems: any = [];

    // 遍历父级到当前子路由的页面的title和path 存储到数组里
    for (const index in router.matched) {
      if (router.matched[index].meta && router.matched[index].meta.title) {
        breadCrumbItems.push({
          path: router.matched[index].path ? router.matched[index].path : "/",
          title: router.matched[index].meta.title
        });
      }
    }

    this.breadCrumbItems = breadCrumbItems;
  }
}
</script>

<style lang="scss" scoped>
.layout-content {
  width: 100%;
  height: calc(100% - 65px);//height100%获取的是父容器的高度
  .el-main {
    padding: 0;
    .top {
      background: #fff;
      height: 54px;
      border-right: none;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      i {
        font-size: 20px;
        cursor: pointer;
        padding-left: 16px;
      }
      .breadcrumb {
        padding-left: 16px;
      }
    }
    .content {
      padding: 10px;
      height: calc(100% - 55px);
      box-sizing: border-box;
    }
  }
}
</style>