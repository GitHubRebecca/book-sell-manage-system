<template>
  <div class="table-data">
    <div class="search-box">
      <el-input size="small" v-model="searchKey" placeholder="请输入课本名称检索"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" border style="width:100%" :height="tHeight" class="table-box">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="课本名称" prop="name"></el-table-column>
      <el-table-column width="120" label="课本分类" prop="type"></el-table-column>
      <el-table-column width="120" label="库存" prop="stock"></el-table-column>
      <el-table-column width="120" label="书本进价" prop="incomePrice"></el-table-column>
      <el-table-column width="160" label="书本卖价" prop="sellPrice"></el-table-column>
      <el-table-column width="160" label="提成比例" prop="percentage"></el-table-column>
      <el-table-column v-if="getUser.key != 'visitor'" label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index,scope.row)" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages" ref="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10]"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
@Component({
  components: {}
})
export default class BookList extends Vue {
  @Getter("user") getUser: any;

  @Provide() searchKey: string = ""; // 搜索框
  @Provide() tHeight: number = document.body.offsetHeight - 270;
  @Provide() tableData: any = []; // 表格数据
  @Provide() pageSize: number = 5; // 请求数据的个数 默认5
  @Provide() currentPage: number = 1; // 当前page
  @Provide() total: number = 0; // 总数据条数

  handleEdit(index: number, row: any) {
    this.$router.push({
      name: "addbook",
      params: row
    })
  }

  handleDelete(index: number, row: any) {
    (this as any).$axios
      .delete(`/api/book/deleteBook/${row._id}`)
      .then((res: any) => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });

        this.tableData.splice(index, 1);
      });
  }

  created() {
    this.loadData();
  }

  loadData() {
    (this as any)
      .$axios.get(`/api/book/getBooks?searchKey=${this.searchKey}&pageSize=${this.pageSize}&currentPage=${this.currentPage}`)
      .then((res: any) => {
        this.tableData = res.data.result.books;
        this.total = res.data.result.count;
      });
  }

  handleSizeChange(val: number): void {
    this.pageSize = val;
    this.loadData();
  }

  handleCurrentChange(val: number): void {
    this.currentPage = val;
    this.loadData();
  }

  handleSearch(): void {
    // 点击搜索
    if(!this.searchKey) return
    this.currentPage = 1;
    this.loadData();
  }
}
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  .table-box {
    font-size: 14px;
  }
  .pages {
    background: #fff;
    margin-top: 10px;
    padding: 10px 10px;
    text-align: right;
    height: 55px;
    box-sizing: border-box;
  }
  .search-box {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    height: 55px;
    box-sizing: border-box;
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>
