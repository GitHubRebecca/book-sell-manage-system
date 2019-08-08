<template>
  <div class="account-data">
    <div class="add-box">
      <el-button @click="addAccount" type="primary">新增账户</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width:100%"
      v-loading="loading"
      element-loading-text="拼命加载中..."
    >
      <el-table-column label="用户名" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" v-if="scope.row.edit"></el-input>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <el-select
            @change="selectChange(scope.row)"
            v-if="scope.row.edit"
            v-model="scope.row.role"
          >
            <el-option
              v-for="option in options"
              :label="option.role"
              :value="option.role"
              :key="option.key"
            ></el-option>
          </el-select>
          <span v-else>{{getUserRole(scope.row.indentity)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.$index,scope.row)"
            v-if="!scope.row.edit"
            size="mini"
          >编辑</el-button>
          <el-button
            @click="handleSave(scope.$index,scope.row)"
            v-else
            type="success"
            size="mini"
          >完成</el-button>

          <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddAccount
      @update="getData"
      @closeDialog="closeDialog"
      :dialogVisible="dialogVisible"
      :options="options"
    ></AddAccount>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import AddAccount from "./AddAccount.vue";
import { getUserRole } from "../../utils/role";
@Component({
  components: { AddAccount }
})
export default class AccountData extends Vue {
  @Provide() tableData: any = [];

  @Provide() loading: boolean = false;

  @Provide() dialogVisible: Boolean = false;

  // select数据
  @Provide() options: any = [
    {
      key: "admin",
      role: "管理员",
      des: "Super Administrator. Have access to view all pages."
    },
    {
      key: "editor",
      role: "客服",
      des: "Normal Editor. Can see all pages except permission page"
    },
    {
      key: "visitor",
      role: "游客",
      des: "Just a visitor. Can only see the home page and the document page"
    }
  ];

  getUserRole: any = getUserRole;

  addAccount() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  created() {
    this.getData();
  }

  handleEdit(index: number, row: any): void {
    // 编辑
    row.edit = true;
  }

  handleDelete(index: number, row: any): void {
    // 删除
    (this as any).$axios
      .delete(`/api/users/deleteUser/${row._id}`)
      .then((res: any) => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });

        this.tableData.splice(index, 1);
      });
  }

  handleSave(index: number, row: any): void {
    // 完成
    row.edit = false;
    (this as any).$axios
      .post(`/api/users/editUser/${row._id}`, row)
      .then((res: any) => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      });
  }

  selectChange(item: any) {
    this.options.map((option: any) => {
      if (option.role == item.role) {
        item.key = option.key;
        item.des = option.des;
      }
    });
  }

  getData() {
    this.loading = true;
    (this as any)
      .$axios("/api/user/getUsers")
      .then((res: any) => {
        this.loading = false;
        if (res.data.isSuccess) {
          // 设置编辑状态
          res.data.result.forEach((item: any) => {
            item.edit = false;
          });
          this.tableData = res.data.result;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.account-data {
  height: 100%;
  overflow: auto;
  .add-box {
    margin-bottom: 10px;
  }
}
</style>
