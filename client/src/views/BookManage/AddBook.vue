<template>
  <div class="add-book">
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="120px">
      <el-form-item label="课本名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入课本名称"></el-input>
      </el-form-item>
      <el-form-item label="课本分类" prop="type">
        <el-select v-model="form.type" placeholder="请选择课本类型">
          <el-option label="前端" value="前端"></el-option>
          <el-option label="后端" value="后端"></el-option>
          <el-option label="数据库" value="数据库"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="form.stock" placeholder="请输入库存" type="number"></el-input>
      </el-form-item>
      <el-form-item label="书本进价" prop="incomePrice">
        <el-input v-model="form.incomePrice" placeholder="请输入书本进价" type="number"></el-input>
      </el-form-item>
      <el-form-item label="书本卖价" prop="sellPrice">
        <el-input v-model="form.sellPrice" placeholder="请输入书本卖价" type="number"></el-input>
      </el-form-item>
      <el-form-item label="提成比例" prop="percentage">
        <el-input v-model="form.percentage" placeholder="请输入提成比例" type="number"></el-input>
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
@Component({
  components: {}
})
export default class AddBook extends Vue {
  @Provide() form: object = {
    name: "",
    type: "",
    incomePrice: "",
    sellPrice: "",
    stock: "",
    percentage: ""
  };

  @Provide() isEdit: boolean = false;

  @Provide() rules: any = {
    name: [{ required: true, message: "请输入课本名称", trigger: "blur" }],
    type: [{ required: true, message: "请选择课本类型", trigger: "change" }],
    incomePrice: [
      { required: true, message: "请输入书本进价", trigger: "blur" }
    ],
    sellPrice: [{ required: true, message: "请输入书本卖价", trigger: "blur" }],
    stock: [{ required: true, message: "请输入书本库存", trigger: "blur" }],
    percentage: [{ required: true, message: "请输入提成比例", trigger: "blur" }]
  };

  submitForm(formName: string) {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        if (this.isEdit) {
          (this as any).$axios
          .put(`/api/book/updateBook/${(this as any).form._id}`, this.form)
          .then((res: any) => {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push({
              name: 'booklist'
            })
          });
        } else {
          (this as any).$axios
            .post(`/api/book/addBook`, this.form)
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
