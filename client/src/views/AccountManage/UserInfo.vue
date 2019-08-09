<template>
  <div class="user-info">
    <div class="img-box">
      <h2 class="title">个人信息</h2>
      <img :src="getUser.avatar" alt />
      <h4>用户名：{{getUser.name}}</h4>
      <h4>角色：{{getCurrentUserRole(getUser.indentity)}}</h4>
      <h4>邮箱：{{getUser.email}}</h4>
    </div>
    <div class="info-box">
      <h2 class="title">修改密码</h2>
      <!-- form -->
      <el-form :model="userData" class="form-box" :rules="rules">
        <el-form-item label="新密码" prop="password1">
          <el-input type="password" v-model.trim ="userData.password1" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model.trim ="userData.password2" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="onSubmit"
            :disabled="!userData.password1 || !userData.password2"
            type="primary"
            :loading="loading"
          >修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
import { getUserRole } from "../../utils/role";
@Component({
  components: {}
})
export default class UserInfo extends Vue {
  @Getter("user") getUser: any;

  @Provide() rules: { password1: Array<any>; password2: Array<any> } = {
    password1: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
    password2: [
      { required: true, message: "确认密码不能为空", trigger: "blur" }
    ]
  };

  @Provide() userData: {
    password1: string;
    password2: string;
    name: string;
  } = {
    password1: "",
    password2: "",
    name: ""
  };

  @Provide() loading: boolean = false; // 是否发起网络请求

  onSubmit(): void {
    if(this.userData.password1 !== this.userData.password2) {
      this.$message({
        message: "两次密码不一致",
        type: "error"
      });
      return
    }
    this.userData.name = this.getUser.name;

    this.loading = true;

    // 发起请求
    (this as any).$axios
      .post("/api/user/newPassword", this.userData)
      .then((res: any) => {
        this.loading = false;
        if (res.data.isSuccess) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        this.loading = false;
      });
  }

  created() {
    console.log(this.getUser);
  }

  getCurrentUserRole: any = getUserRole;
}
</script>

<style lang="scss" scoped>
.user-info {
  height: calc(100%);
  display: flex;
  overflow: auto;
  color: #606266;
  .img-box,
  .info-box {
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    background: #fff;
    .title {
      border-bottom: 1px solid #dcdfe6;
      padding: 10px;
      text-align: left;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .img-box {
    text-align: center;
    width: 30%;
    margin-right: 10px;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    h4 {
      margin-top: 20px;
      font-size: 16px;
    }
  }
  .info-box {
    flex: 1;
    .form-box {
      padding: 10px;
    }
  }
}
</style>
