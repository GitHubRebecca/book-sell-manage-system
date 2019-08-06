<template>
  <div class="newpassword-wrapper">
    <LoginHeader>
      <el-form slot="container" :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="title">
          <h3>验证码</h3>
        </div>
        <!-- code -->
        <el-form-item prop="code">
          <el-input type="text" v-model="ruleForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="fa fa-wrench"></i>
          </el-input>
        </el-form-item>

        <!-- 确定 -->
        <el-form-item>
          <el-button
            @click="handleSubmit"
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
export default class Code extends Vue {
  @Provide() name: string = ''

  @Provide() loading: boolean = false; // 是否发起网络请求

  @Provide() ruleForm: { code: string } = {
    code: ""
  };

  @Provide() rules = {
    code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
  };

  handleSubmit(): void {
    this.$router.push("/newpassword")
    return
    (this.$refs["ruleForm"] as any).validate((valid: boolean) => {
      if (valid) {
        this.loading = true;
        // 网络请求
        (this as any).$axios
          .post("/api/user/verifyCode", this.ruleForm)
          .then((res: any) => {
            this.loading = false;
            if (res.data.isSuccess) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({
                name: "newpassword",
                params: { name: this.name } //params传参刷新页面 参数取不到
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
    this.name = this.$route.params.name
  }
}
</script>

<style scoped lang="scss">
.newpassword-wrapper {
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
