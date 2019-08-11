<template>
  <div class="account-data">
    <div class="add-box">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-input @clear="getData" v-model.trim="searchKey" type="text" clearable placeholder="用户名" @keyup.native.enter="handlSearch" size="small">
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="handlSearch">
            </i>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button @click="addAccount" type="primary" size="small">新增用户</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      border
      style="width:100%"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      empty-text="暂无数据"
    >
      <el-table-column label="用户名" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <el-select
            @change="selectChange(scope.row)"
            v-if="scope.row.edit"
            v-model="scope.row.indentity"
          >
            <el-option
              v-for="option in options"
              :label="option.role"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
          <span v-else>{{scope.row.indentity}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="200">
        <template slot-scope="scope">
          {{scope.row.status == 'enable' ? '正常' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.$index,scope.row)"
            v-if="!scope.row.edit"
            size="mini"
            type="primary"
          >编辑</el-button>
          <el-button
            @click="handleSave(scope.$index,scope.row)"
            v-else
            type="success"
            size="mini"
          >完成</el-button>

          <el-button @click="handleStatus(scope.$index,scope.row)" size="mini" :type="scope.row.status == 'enable' ? 'warning' : 'success'">{{scope.row.status ==  'enable' ? '禁用' : '启用'}}</el-button>

          <el-popover v-model="scope.row.showDeletePopover" placement="left">
            <div style="text-align:center;">
              <p style="line-height:40px;">该用户您确定删除吗？</p>
              <el-button size="mini" @click="scope.row.showDeletePopover=false">取消</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">确定</el-button>
            </div>
            <el-button style="margin-left:10px;" slot="reference" size="mini" type="danger">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <section class="pagination-wrapper">
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :page-sizes="[5,10]"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="total">
      </el-pagination>
    </section>
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
import {Getter} from 'vuex-class'
import AddAccount from "./AddAccount.vue";
import { getUserRole } from "../../utils/role";
@Component({
  components: { AddAccount }
})
export default class AccountData extends Vue {
  @Provide() tableData: any = [];

  @Provide() total: number = 0
  @Provide() pageSize: number = 5
  @Provide() currentPage: number = 1

  @Provide() loading: boolean = false;

  @Provide() dialogVisible: boolean = false;

  @Provide() searchKey: string = ''

  // select数据
  @Provide() options: Array<any> = [
    {
      role: "店长",
      value: "shopowner"
    },
    {
      role: "导购",
      value: "shopguide"
    }
  ];

  getUserRole: any = getUserRole;

  @Getter("user") getUser: any

  addAccount() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  handleSizeChange(val: number) {
    this.pageSize = val
    this.getData()
  }

  handleCurrentChange(val: number) {
    this.currentPage = val
    this.getData()
  }

  handlSearch(val: any){
    if (this.searchKey == '') return
    this.currentPage = 1
    this.getData()
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
      .delete(`/api/user/deleteUser/${row._id}`)
      .then((res: any) => {
        if(res.data.isSuccess){
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

        this.tableData.splice(index, 1);
      });
  }

  handleStatus(index: number, row: any): void {
    const status = row.status == 'enable' ? 'disable' : 'enable';
    (this as any).$axios
      .put(`/api/user/updateStatus/${row._id}`, {status: status})
      .then((res: any) => {
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
        this.getData()
      });
  }

  handleSave(index: number, row: any): void {
    // 完成
    row.edit = false;
    (this as any).$axios
      .put(`/api/user/updateRole/${row._id}`, {indentity: row.indentity})
      .then((res: any) => {
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
        this.getData()
      });
  }

  selectChange(item: any) {
    console.log(item)
  }

  getData() {
    this.loading = true;
    this.tableData = [];
    (this as any)
      .$axios.get(`/api/user/getUsers?searchKey=${this.searchKey}&pageSize=${this.pageSize}&currentPage=${this.currentPage}&id=${this.getUser.id}`)
      .then((res: any) => {
        this.loading = false;
        if (res.data.isSuccess) {
          // 设置编辑状态
          res.data.result.users.forEach((item: any) => {
            item.edit = false;
            item.indentity = this.getUserRole(item.indentity)
            item.showDeletePopover = false
          });
          this.tableData = res.data.result.users;
          this.total = res.data.result.count
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      })
      .catch((err: any) => {
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

  .pagination-wrapper {
    padding: 30px 0px;
    text-align: right;
  }
}
</style>
