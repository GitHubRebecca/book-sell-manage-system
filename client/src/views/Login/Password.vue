<template>
  <div class="password-wrapper">
    <LoginHeader>
      <el-form slot="container" :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="title">
          <h3>账号邮箱验证</h3>
        </div>
        <!-- username -->
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号">
            <i slot="prefix" class="fa fa-user-o"></i>
          </el-input>
        </el-form-item>

        <!-- email -->
        <el-form-item prop="email">
          <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="邮箱">
            <i slot="prefix" class="fa fa-envelope-o"></i>
          </el-input>
        </el-form-item>

        <!-- 确定 -->
        <el-form-item>
          <el-button
            @click.native.prevent="handleSubmit"
            :loading="loading"
            type="primary"
            style="width:100%;"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </LoginHeader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import LoginHeader from "@/components/LoginHeader.vue";
@Component({
  components: {
    LoginHeader
  }
})
export default class Password extends Vue {
  @Provide() loading: boolean = false; // 是否发起网络请求

  @Provide() ruleForm: { username: string; email: string } = {
    username: "",
    email: ""
  };

  @Provide() rules = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    email: [
      {
        required: true,
        message: "请输入邮箱地址",
        trigger: "blur"
      },
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: "blur"
      }
    ]
  };

  handleSubmit(): void {
    (this.$refs["ruleForm"] as any).validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        // 网络请求
        (this as any).$axios
          .post("/api/user/sendCode", this.ruleForm)
          .then((res: any) => {
            this.loading = false;
            if (res.data.isSuccess) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({
                name: "code",
                params: { name: this.ruleForm.username } //params传参刷新页面 参数取不到
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch((err: any) => {
            this.loading = false;
            console.log(err);
          });
      }
    });
  }
}
</script>

<style scoped lang="scss">
.password-wrapper {
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  i {
    margin-left: 8px;
  }
}
</style>
