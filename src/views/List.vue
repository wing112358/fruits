<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">水果管理</el-menu-item>
    </el-menu>
    <br />
    <el-row>
      <el-col :span="1" class="grid">
        <el-button
          type="success"
          @click="addFlag=true;dialogVisible = true "
          icon="el-icon-circle-plus-outline"
          size="mini"
          round
        >新增</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table
      :data="fruitList"
      border
      style="width: 100%"
      stripe
      ref="multipleTable"
      tooltip-effect="dark"
    >
      <el-table-column label="序号" type="index" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{(page - 1) * size + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="水果名称" align="center"></el-table-column>
      <el-table-column prop="Status" label="水果状态" align="center"></el-table-column>
      <el-table-column prop="Stock" label="库存" align="center"></el-table-column>
      <el-table-column prop="Creater" label="创建人" align="center"></el-table-column>
      <el-table-column label="上下架" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="value" active-text="上架" inactive-text="下架" @change="changeStatus(scope.row)" ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editFruit(scope.row)" align="center">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delFruit(scope.row)" align="center">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="size"
      style="float:right"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      :title="addFlag?'新增水果':'修改水果信息'"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="水果名称" style="width:300px">
          <el-input v-model="fruit.Name" placeholder="请输入水果名称"></el-input>
        </el-form-item>
        <el-form-item label="水果数量" style="width:280px">
          <el-input v-model="fruit.Stock" placeholder="请输入水果数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="saveFruit()">提交</el-button>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      style="text-align:left !important"
      :visible.sync="dialog2Visible"
      :before-close="handleClose"
    >
      <span>你确定要删除这项水果吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDel()">提交</el-button>
        <el-button type="primary" @click="dialog2Visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      dialogVisible: false,
      dialog2Visible: false,
      value: false,
      activeIndex2: "1",
      total: 0,
      size: 5,
      page: 1,
      fruitList: [],
      fruit: {},
      addFlag: true,
      curId: ""
    };
  },
  watch:{
    //2.x版本的bug 以前用1.x发现没有 假如现在是第三页，只有一条数据了。将其删除，就没有第三页了。应该跳到第二页展示出5条数据。
    //可是数据没有展示。原因是获取list的时候page参数没有改变。依然是3
    total(){
      if(this.total==(this.page-1)*this.size&& this.total!=0){
        this.page-=1;
        this.getFruitList()
      }
    }
  },
  methods: {
    handleClose(done) {
      done();
    },
    handleSizeChange(val){
      this.size = val
      this.getFruitList()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getFruitList();
    },
    async getFruitList() {
      try {
        let res = await axios.post(
          "http://localhost:8080/list",
          qs.stringify({
            page: this.page,
            size: this.size
          })
        );
        this.total = res.data.Data.Total;
        this.fruitList = res.data.Data.List;

      } catch (e) {
        console.log(e);
      }
    },
  async saveFruit() {
    try {
      let res = await axios.post(
        "http://localhost:8080/save",
        qs.stringify({
          id: this.fruit.ID,
          status: this.fruit.Status,
          stock: this.fruit.Stock,
        })
      );
      this.dialogVisible = false;
      this.fruit = {};
      this.$message({
        message: res.data.Msg,
        type: "success"
      });
      this.getFruitList();
    } catch (e) {
      console.log(e);
    }
  },
  async changeStatus() {
    try {
      let res = await axios.post(
        "http://localhost:8080/up",
        qs.stringify({
          id: this.fruit.ID,
          status: this.fruit.Status,
        })
      );
      this.fruit = {};
      this.$message({
       message: res.data.Msg,
        type: "success"
      });
      this.getFruitList();
    } catch (e) {
     console.log(e);
    }
  },
    delFruit(row) {
      this.addFlag = false;
      this.dialog2Visible = true;
      this.curId = row.ID;
    },
    async handleDel() {
      try {
        let res = await axios.post(
          "http://localhost:8080/del",
          qs.stringify({
            id: this.curId
          })
        );
        this.curId = "";
        this.dialog2Visible = false;
        this.$message({
          message: res.data.Msg,
          type: "success"
        });
        this.getFruitList();
      } catch (e) {
        console.log(e);
      }
    },

    editFruit(row) {
      this.fruit = row;
      this.dialogVisible = true;
      this.addFlag = false;
    }
  },
  mounted() {
    this.getFruitList();
  },


};
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>

