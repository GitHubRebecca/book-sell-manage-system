<template>
  <div class="table-data">
    <div class="search-box">
      <el-input size="small" v-model="searchKey" placeholder="请输入课本名称或用户名检索"></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" border style="width:100%" :height="tHeight" class="table-box">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="bookName" label="课本名称" min-width="300"></el-table-column>
      <el-table-column width="120" label="用户名" prop="userName"></el-table-column>
      <el-table-column width="100" label="出售数量" prop="saleCount"></el-table-column>
      <el-table-column width="220" label="出售时间" prop="showSaleDate"></el-table-column>
      <el-table-column width="160" label="书本卖价" prop="bookSellPrice"></el-table-column>
      <el-table-column width="160" label="提成比例" prop="book.percentage"></el-table-column>
      <el-table-column width="160" label="提成" prop="sellIncome"></el-table-column>
      <el-table-column label="操作" width="160" >
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index,scope.row)" size="mini">编辑</el-button>
          <!-- delete  -->
          <el-popover placement="left" trigger="click" v-model="scope.row.showDeletePopover">
            <div style="text-align: center;">
              <p style="line-height: 40px;">该订单您确定删除吗？</p>
              <el-button size="mini" @click="scope.row.showDeletePopover=false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.$index,scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" style="margin-left:10px;">删除</el-button>
          </el-popover>
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
export default class OrderList extends Vue {
  @Getter("user") getUser: any;

  @Provide() searchKey: string = ""; // 搜索框
  @Provide() tHeight: number = document.body.offsetHeight - 270;
  @Provide() tableData: any = []; // 表格数据
  @Provide() pageSize: number = 5; // 请求数据的个数 默认5
  @Provide() currentPage: number = 1; // 当前page
  @Provide() total: number = 0; // 总数据条数

  handleEdit(index: number, row: any) {
    row.bookId = row.book._id
    this.$router.push({
      name: "addorder",
      params: row
    })
  }

  handleDelete(index: number, row: any) {
    (this as any).$axios
      .delete(`/api/order/deleteOrder/${row._id}`)
      .then((res: any) => {
        row.showDeletePopover = false
        if(res.data.isSuccess){
          this.$message({
            message: res.data.msg,
            type: "success"
          });

          this.tableData.splice(index, 1);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      }).catch((err: any)=>{
        console.log(err)
        row.showDeletePopover = false
      });
  }

  DeletePopoverHide() {
    console.log(this.$refs["deletePopover"]);
    (this.$refs["deletePopover"] as any).value = false
  }

  created() {
    this.loadData();
  }

  loadData() {
    (this as any)
      .$axios.get(`/api/order/getOrders?searchKey=${this.searchKey}&pageSize=${this.pageSize}&currentPage=${this.currentPage}`)
      .then((res: any) => {
        res.data.result.orders.forEach((order: any) => { //对象类型的可以更改
          order.showDeletePopover = false
          order.showSaleDate = new Date(order.saleDate).toLocaleString();
        })
        this.tableData = res.data.result.orders
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
