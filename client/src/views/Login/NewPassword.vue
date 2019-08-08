<template>
  <div class="password-wrapper">
    <LoginHeader>
      <el-form slot="container" :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="title">
          <h3>修改密码</h3>
        </div>
        <!-- password1 -->
        <el-form-item prop="password1">
          <el-input
            type="text"
            v-model="ruleForm.password1"
            auto-complete="off"
            placeholder="请输入新密码"
            show-password
          >
            <i slot="prefix" class="fa fa-lock"></i>
          </el-input>
        </el-form-item>

        <!-- password2 -->
        <el-form-item prop="password2">
          <el-input
            type="text"
            v-model="ruleForm.password2"
            auto-complete="off"
            placeholder="再次确认密码"
            show-password
          >
            <i slot="prefix" class="fa fa-lock"></i>
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
export default class NewPassword extends Vue {
  @Provide() loading: boolean = false; // 是否发起网络请求

  @Provide() ruleForm: {
    password1: string;
    password2: string;
    name: string;
  } = {
    password1: "",
    password2: "",
    name: ""
  };

  @Provide() rules = {
    password1: [
      { required: true, message: "请输入新密码", trigger: "blur" },
      { validator: this.verifyPasswordAgreement, trigger: "blur" }
    ],
    password2: [
      { required: true, message: "请输入新密码", trigger: "blur" },
      { validator: this.verifyPasswordAgreement, trigger: "blur" }
    ]
  };

  //自定义验证器
  verifyPasswordAgreement(rule: any, value: any, callback: any): void {
    if (
      rule.fullField == "password1" &&
      this.ruleForm.password2 !== "" &&
      value !== this.ruleForm.password2
    ) {
      callback(new Error("两次密码不一致"));
    } else if (
      rule.fullField == "password2" &&
      this.ruleForm.password1 !== "" &&
      value !== this.ruleForm.password1
    ) {
      callback(new Error("两次密码不一致"));
    } else {
      callback();
    }
  }

  handleSubmit(): void {
    //判断是否还有name
    if (!this.ruleForm.name) {
      this.$message({
        message: "账号不能为空，请返回重新验证",
        type: "error"
      });
      return;
    }
    (this.$refs["ruleForm"] as any).validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        // 网络请求
        (this as any).$axios
          .post("/api/user/newPassword", this.ruleForm)
          .then((res: any) => {
            this.loading = false;
            if (res.data.isSuccess) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({
                name: "login"
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

  mounted() {
    this.ruleForm.name = this.$route.params.name;
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
