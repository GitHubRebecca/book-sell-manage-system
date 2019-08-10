<template>
  <div class="add-book">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="120px">
      <el-form-item label="课本名称" prop="bookId">
        <el-select v-model="form.bookId" placeholder="请选择课本">
          <el-option v-for="book of options" :key="book.value" :label="book.label" :value="book.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出售数量" prop="saleCount">
        <el-input v-model.trim="form.saleCount" placeholder="请输入出售数量" type="number"></el-input>
      </el-form-item>
      <el-form-item label="出售时间" prop="saleDate">
        <el-date-picker
          v-model="form.saleDate"
          type="datetime"
          placeholder="选择出售时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import {Getter} from 'vuex-class'
@Component({
  components: {}
})
export default class AddOrder extends Vue {
  @Getter("user") getUser: any

  @Provide() form: any = {
    bookId: "",
    userId: "",
    saleCount: "",
    saleDate: null
  };

  @Provide() options: Array<object> = []

  @Provide() isEdit: boolean = false;

  @Provide() rules: any = {
    bookId: [{ required: true, message: "请选择课本", trigger: "change" }],
    saleCount: [
      { required: true, message: "请输入出售数量", trigger: "blur" }
    ],
    saleDate: [{ required: true, message: "请选择出售日期", trigger: "blur" }],
  };

  submitForm(formName: string) {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        this.form.userId = this.getUser.id
        if (this.isEdit) {
          (this as any).$axios
          .put(`/api/order/updateOrder/${(this as any).form._id}`, this.form)
          .then((res: any) => {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push({
              name: 'orderlist'
            })
          });
        } else {
          (this as any).$axios
            .post(`/api/order/addOrder`, this.form)
            .then((res: any) => {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.resetForm(formName);
            });
        }
      }
    });
  }

  resetForm(formName: string) {
    (this as any).$refs[formName].resetFields();
  }

  getAllBooks() {
    (this as any).$axios.get("/api/book/getAllBooks").then((res: any) => {
      this.options = res.data.result.map((book: any) => {
        return {
          label: book.name,
          value: book._id
        }
      })
    })
  }

  created() {
    this.getAllBooks()
  }

  mounted() {
    if (Object.keys(this.$route.params).length > 0) {
      this.form = this.$route.params;
      this.isEdit = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.add-book {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  padding: 20px 0px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  height: 100%;

  .el-input,
  .el-select {
    width: 200px !important;
  }
  .division {
    margin: 0 10px;
    color: #606266;
  }
}
</style>
