<template>
  <div class="sidebar-wrapper">
    <!-- 使用router 开启index跳转路径模式 -->
    <el-menu class="el-menu-slide" :default-active="$route.path" router> <!-- 也可以使用$router.currentRoute.path-->
      <template
        v-for="item in getRouters"
        v-if="!item.hidden&&item.children&&item.children.length>0"
      >
        <el-menu-item
          v-if="item.children.length==1"
          :index="(item.path == '/' ? '/' : item.path + '/') + item.children[0].path"
          :key="item.name"
        >
          <i v-if="item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
          <span slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
        <!-- 多个子元素 -->
        <el-submenu v-else :index="item.path" :key="item.name">
          <template slot="title">
            <i v-if="item.meta.icon" :class="item.meta.icon"></i>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </template>
          <el-menu-item v-for="child in item.children" :index="(item.path == '/' ? '/' : item.path + '/') + child.path" :key="child.name">
            <i v-if="child.meta.icon" :class="child.meta.icon"></i>
            <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
@Component({
  components: {}
})
export default class Sidebar extends Vue {
  @Getter("routes") getRouters: any;

  created() {
    console.log('accessRoute:', this.getRouters);
    console.log("router:", this.$router);
    console.log("route: ", this.$route);
  }
}
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  height: 100%;
  border-right: 1px solid #e6e6e6;
  background: #fff;
  .el-menu-slide {
    border-right: none;
    i {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
  }
}
</style>
