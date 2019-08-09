<template>
  <el-dialog
    title="新增用户"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
    width="30%"
  >
    <el-form :rules="rules" ref="ruleForm" :model="account" class="form-box" label-width="120px">
      <el-form-item label="请输入用户名" prop="name">
        <el-input v-model.trim="account.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="请输入邮箱" prop="email">
        <el-input v-model.trim="account.email" placeholder="请输入用邮箱"></el-input>
      </el-form-item>
      <el-form-item label="请输入密码" prop="password">
        <el-input v-model.trim="account.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="请选择角色" prop="indentity">
        <el-select @change="selectChange" v-model="account.indentity" placeholder="请选择角色">
          <el-option
            v-for="option in options"
            :label="option.role"
            :value="option.value"
            :key="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeDialog')">取消</el-button>
      <el-button @click="handleAdd" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide, Emit } from "vue-property-decorator";
import {Getter} from 'vuex-class'

@Component({
  components: {}
})
export default class AddAccount extends Vue {
  // prop
  @Prop(Boolean) dialogVisible!: boolean;
  @Prop(Array) options!: any;

  @Getter("user") getUser: any

  @Provide() account: object = {
    indentity: "",
    name: "",
    email: "",
    password: "",
    createUser: ""
  };

  @Provide() rules: any = {
    name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    indentity: [{ required: true, message: "请选择角色", trigger: "change" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
    ]
  };

  selectChange(select: string) {}

  @Emit("closeDialog")//关闭窗口
  handleAdd() {
    (this as any).account.createUser = this.getUser.id;
    (this as any).$refs["ruleForm"].validate((valid: boolean) => {
      if (valid) {
        (this as any).$axios
          .post("/api/user/register", this.account)
          .then((res: any) => {
            this.$emit("update");
            if(res.data.isSuccess) {
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
          }).catch((err: any) => {
            console.log(err)
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
</style>

