<template>
  <div class="login-wrapper">
    <LoginHeader>
      <el-form :model="loginForm" :rules="rules" slot="container" ref="loginForm">
        <div class="title">
          <h3>账号密码登录</h3>
        </div>
        <!-- username -->
        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username" placeholder="账号">
            <i slot="prefix" class="fa fa-user-o"></i>
          </el-input>
        </el-form-item>

        <!-- password -->
        <el-form-item prop="pwd">
          <el-input type="password" v-model="loginForm.pwd" placeholder="密码">
            <i slot="prefix" class="fa fa-lock"></i>
          </el-input>
        </el-form-item>

        <!-- 登录button -->
        <el-form-item>
          <el-button
            :loading="isLogin"
            @click.native.prevent="login"
            type="primary"
            style="width:100%;"
          >登录</el-button>
        </el-form-item>

        <!-- 7天登录和忘记密码 -->
        <el-form-item>
          <el-checkbox v-model="loginForm.autoLogin" :checked="loginForm.autoLogin">7天内自动登录</el-checkbox>
          <el-button @click="$router.push('/password')" type="text" class="forget">忘记密码？</el-button>
        </el-form-item>
      </el-form>
    </LoginHeader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import LoginHeader from "@/components/LoginHeader.vue";
import { State, Getter, Mutation, Action } from "vuex-class";
@Component({
  components: {
    LoginHeader
  }
})
export default class Login extends Vue {
  //设置action
  @Action("setUser") setCurrentUser: any;
  //装饰器 装饰data 以前写在data(){}方法里面的
  @Provide() loginForm: {
    username: String;
    pwd: String;
    autoLogin: Boolean;
  } = {
    username: "",
    pwd: "",
    autoLogin: true
  };

  @Provide() rules: Object = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
  };

  @Provide() isLogin: Boolean = false;

  login(): void {
    (this.$refs["loginForm"] as any).validate((valid: Boolean) => {
      if (valid) {
        this.isLogin = true;
        (this as any).$axios
          .post("/api/user/login", this.loginForm)
          .then((res: any) => {
            this.isLogin = false;
            //存储token
            localStorage.setItem("bsToken", res.data.token);
            //存储用户到vuex
            this.setCurrentUser(res.data.token);
            // 登录成功 跳转 /
            this.$router.push("/");
          })
          .catch((err: any) => {
            console.log(err);
            this.isLogin = false;
          });
      }
    });
  }
}
</script>

<style scoped lang="scss">
.login-wrapper {
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  i {
    margin-left: 8px;
  }
  .forget {
    float: right;
  }
}
</style>
