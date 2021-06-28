<template>
  <div id="app">

    <!--    ---------------------------------------标题--------------------------------------      -->
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">水果管理</el-menu-item>
      <el-menu-item index="2">
        <span >登录用户：{{userinfo.username}}     </span>
        <el-link icon="el-icon-cherry" align="right" @click="handleLogout()">退出登录</el-link>
      </el-menu-item>
    </el-menu>
    <br />
    <!--    ---------------------------------------查询区域--------------------------------------      -->
    <el-form :inline="true" :model="queryfruits" class="demo-form-inline" align="left">
      <el-form-item label="水果名称">
        <el-input v-model="queryfruits.fruitname" placeholder="请输入水果名称"></el-input>
      </el-form-item>
      <el-form-item label="创建人姓名">
        <el-input v-model="queryfruits.username" placeholder="请输入创建姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryfruits.status" placeholder="请选择状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未上架" value="0"></el-option>
          <el-option label="已上架" value="1"></el-option>
          <el-option label="已下架" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getFruitList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>

    <!--    ---------------------------------------新增按钮--------------------------------------      -->
    <el-row>
      <el-col :span="1" class="grid">
        <el-button
          type="primary"
          @click="dialogVisible = true"
          icon="el-icon-circle-plus-outline"
          round
        >新增</el-button>
      </el-col>
    </el-row>
    <br />
    <!--    ---------------------------------------列表部分--------------------------------------      -->
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
          <span>{{(queryfruits.index - 1) * queryfruits.pagesize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fruitname" label="水果名称" align="center"></el-table-column>
      <el-table-column prop="status" label="水果状态" align="center" :formatter="getstatus"></el-table-column>
      <el-table-column prop="stock" label="库存（箱）" align="center"></el-table-column>
      <el-table-column prop="desc" label="描述" align="left"></el-table-column>
      <el-table-column prop="username" label="创建人" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center"></el-table-column>
      <el-table-column label="上下架" width="100" align="center">
        <template slot-scope="scope">
          <el-switch class="switch" v-model="scope.row.tempStatus" active-text="上架" inactive-text="下架" :active-value="1"  :inactive-value="(0||2)" @change="changeStatus(scope.$index, scope.row)"  aria-setsize=""></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"  @click="handleEdit(scope.$index, scope.row)" align="center">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.row)" align="center">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryfruits.index"
      :page-sizes="[5, 10, 20]"
      :page-size="queryfruits.pagesize"
      style="float:right"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--    ---------------------------------------新增窗口--------------------------------------      -->
    <el-dialog
      title="新增水果"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="80px" >
        <el-form-item label="水果名称" label-width="100px" style="width:300px">
            <el-input v-model="addfruits.fruitname" placeholder="请输入水果名称"></el-input>
        </el-form-item>

        <el-form-item label="水果数量(箱)" label-width="100px"  style="width:400px">
          <el-input-number v-model="addfruits.stock" controls-position="right" :step="5":min="1" :max="999999999"></el-input-number>
        </el-form-item>

        <el-form-item label="描述" label-width="100px" style="width:400px">
            <el-input type="textarea"  autosize v-model="addfruits.desc" placeholder="请输入描述信息"></el-input>
        </el-form-item>
        <el-form-item align="left">
          <template slot-scope="scope">
            <el-button type="success" @click="addFruit()" :loading="addloading">提交</el-button>
            <el-button type="primary" @click="dialogVisible = false">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--    ---------------------------------------修改窗口--------------------------------------      -->
    <el-dialog
      title="修改水果信息"
      style="text-align:left !important"
      :visible.sync="dialog2Visible"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="80px" >
        <el-form-item label="水果名称" label-width="100px" style="width:300px" >
          <el-input v-model="updatefruits.fruitname" placeholder="请输入水果名称"></el-input>
        </el-form-item>

        <el-form-item label="水果数量(箱)" label-width="100px"  style="width:400px">
          <el-input-number v-model="updatefruits.stock" controls-position="right" :step="1":min="1" :max="999999999"></el-input-number>
        </el-form-item>

        <el-form-item label="描述" label-width="100px" style="width:400px">
          <el-input type="textarea"  autosize v-model="updatefruits.desc" placeholder="请输入描述信息"></el-input>
        </el-form-item>
        <el-form-item align="left">
          <template slot-scope="scope">
            <el-button type="success" @click="updateFruit()" :loading="updateloading">提交</el-button>
            <el-button type="primary" @click="dialog2Visible = false">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--    ---------------------------------------删除窗口--------------------------------------      -->
    <el-dialog
      title="提示"
      style="text-align:left !important"
      :visible.sync="dialog3Visible"
      :before-close="handleClose"
    >
      <span>你确定要删除这项水果吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delFruit()" :loading="delloading">提交</el-button>
        <el-button type="primary" @click="dialog3Visible = false">取消</el-button>
      </span>
    </el-dialog>

    <!--    ---------------------------------------退出窗口--------------------------------------      -->
    <el-dialog
      title="退出登录"
      style="text-align:left !important"
      :visible.sync="dialog4Visible"
      :before-close="handleClose"
    >
      <span>你确定要退出当前账号吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logout()" :loading="outloading">登出</el-button>
        <el-button type="primary" @click="dialog4Visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<!--    ---------------------------------------参数定义--------------------------------------      -->
<script>
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      userinfo:{
        username:window.sessionStorage.getItem("username")
      },
      queryfruits:{
        pagesize: 10,
        index: 1,
        fruitname: null,
        status:"",
        username:null,
        create_time:null,
        update_time:null
      },
      addfruits:{
        fruitname: null,
        stock:null,
        desc:null,
        create_time:null,
        update_time:null
      },
      updatefruits:{
        id:0,
        fruitname: null,
        stock:null,
        desc:null,
        update_time:null
      },
      delfruits:{
        id:0,
        update_time:null
      },
      updown:{
        id:0,
        status:null,
        update_time:null
      },
      addloading:false,
      updateloading:false,
      delloading:false,
      outloading:false,
      dialogVisible: false,
      dialog2Visible: false,
      dialog3Visible: false,
      dialog4Visible: false,
      value: false,
      total: 0,
      activeIndex2: "1",
      fruitList: [],
      fruit: {}
    };
  },
  watch:{
    //2.x版本的bug 以前用1.x发现没有 假如现在是第三页，只有一条数据了。将其删除，就没有第三页了。应该跳到第二页展示出5条数据。
    //可是数据没有展示。原因是获取list的时候page参数没有改变。依然是3
    total(){
      if(this.total==(this.queryfruits.index-1)*this.queryfruits.pagesize&& this.total!=0){
        this.queryfruits.index-=1;
        this.getFruitList()
      }
    }
  },

  methods: {
    getstatus(fruitList){
      var statusW;
      switch (fruitList.status) {
        case 0:statusW= "未上架";break;
        case 1:statusW= "已上架";break;
        case 2:statusW= "已下架";break;
      }
      return statusW
    },
    reset(){
      this.clear();
      this.getFruitList();
    },
    clear(){
      this.queryfruits={
        pagesize: 10,
        index: 1,
        fruitname: null,
        status:"",
        username:null};
      this.addfruits={};
      this.updatefruits={};
      this.delfruits={};
      this.updown={};
    },
    handleClose(done) {
      done();
    },
    handleSizeChange(val){
      this.queryfruits.pagesize = val
      this.getFruitList()
    },
    handleCurrentChange(val) {
      this.queryfruits.index = val;
      this.getFruitList();
    },
    async getFruitList() {
      this.axios
        .post("http://127.0.0.1:8686/fruit/list",
          {
            "pagesize": this.queryfruits.pagesize,
            "index": this.queryfruits.index,
            "status":this.queryfruits.status,
            "fruitname":this.queryfruits.fruitname,
            "username":this.queryfruits.username,
            "create_time":this.queryfruits.create_time,
            "update_time":this.queryfruits.update_time
          },{headers:{
              'token':window.sessionStorage.getItem("token"),
              'Content-Type': 'application/json'
            }})
        .then((response)=>{
            console.log(response)
            if(response.data.code == 200){

              this.total = response.data.data.totalcount;
              this.fruitList = response.data.data.list;
              this.fruitList.map(item => {
                item.tempStatus = item.status
                return item
              })
              this.$message({
                message: '查询成功',
                type: 'success',
                duration:500
              });;

            }else{
              var errormessage=response.data.message;
              this.$message.error(errormessage);
            }

      })
        .catch( (error)=>{
          console.log(error)
        });
    },
    addFruit(){
      this.addloading=true;
      //loading
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: 'Loading...'
      });
      this.axios
        .post("http://127.0.0.1:8686/fruit/add",
          {
            "stock": this.addfruits.stock,
            "fruitname":this.addfruits.fruitname,
            "desc":this.addfruits.desc,
            "create_time":this.getnowTime(),
            "update_time":this.getnowTime()
          },{headers:{
              'token':window.sessionStorage.getItem("token"),
              'Content-Type': 'application/json'
            }})
        .then((response)=>{
          console.log(response)
          if(response.data.code == 200){
            this.dialogVisible=false;
            this.addloading=false;
            loading.close();
            this.clear();
            this.$message({
              message: '新增成功',
              type: 'success',
              duration:500
            });

            this.$router.go(0);
            // setTimeout(location.reload(), 1000)

          }else{
            this.addloading=false;
            loading.close();
            var errormessage=response.data.message;
            this.$message.error(errormessage);
          }

        })
        .catch( (error)=>{
          console.log(error)
        });
    },
    handleEdit(index,row){
      this.dialog2Visible=true;
      this.updatefruits = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
    },
  async updateFruit() {
        this.updateloading=true;
    //loading
    const loading = this.$loading({
      lock: true,
      fullscreen: true,
      text: 'Loading...'
    });
    this.axios
          .post("http://127.0.0.1:8686/fruit/update",
            {
              "id":this.updatefruits.id,
              "stock": this.updatefruits.stock,
              "fruitname":this.updatefruits.fruitname,
              "desc":this.updatefruits.desc,
              "update_time":this.getnowTime()
            },{headers:{
                'token':window.sessionStorage.getItem("token"),
                'Content-Type': 'application/json'
              }})
          .then((response)=>{
            console.log(response)
            if(response.data.code == 200){
              this.dialog2Visible=false;
              this.updateloading=false;
              loading.close();
              this.clear();
              this.$message({
                message: '更新成功',
                type: 'success',
                duration:500
              });
              this.$router.go(0);
              // setTimeout(location.reload(), 1000)

            }else{
              this.updateloading=false;
              loading.close();
              var errormessage=response.data.message;
              this.$message.error(errormessage);
            }

          })
          .catch( (error)=>{
            console.log(error)
          });
  },
  async changeStatus(index,row) {
    const { id, tempStatus } = row
    this.updown = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
    //loading
    const loading = this.$loading({
      lock: true,
      fullscreen: true,
      text: 'Loading...'
    });
    this.axios
      .post("http://127.0.0.1:8686/fruit/update",
        {
          "id": id,
          "status": tempStatus,
          "update_time":this.getnowTime()
        },{headers:{
            'token':window.sessionStorage.getItem("token"),
            'Content-Type': 'application/json'
          }})
      .then((response)=>{
        console.log(response)
        if(response.data.code == 200){
          loading.close();
          this.clear();
          this.$message({
            message: '更新成功',
            type: 'success',
            duration:500
          });

          row.status=tempStatus;
          row.username=window.sessionStorage.getItem("username");

        }else{
          loading.close();
          var errormessage=response.data.message;
          this.$message.error(errormessage);
        }

      })
      .catch( (error)=>{
        console.log(error)
      });
  },
    handleDel(row){
      this.dialog3Visible=true;
      this.delfruits = Object.assign({}, row);
    },
    delFruit() {
      this.delloading=true;
      //loading
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: 'Loading...'
      });
      this.axios
        .post("http://127.0.0.1:8686/fruit/del",
          {
            "id":this.delfruits.id,
            "update_time":this.getnowTime()
          },{headers:{
              'token':window.sessionStorage.getItem("token"),
              'Content-Type': 'application/json'
            }})
        .then((response)=>{
          console.log(response)
          if(response.data.code == 200){
            this.dialog3Visible=false;
            this.delloading=false;
            loading.close();
            this.clear();
            this.$message({
              message: '更新成功',
              type: 'success',
              duration:500
            });
            this.$router.go(0);
            // setTimeout(location.reload(), 1000);

          }else{
            this.updateloading=false;
            loading.close();
            var errormessage=response.data.message;
            this.$message.error(errormessage);
          }

        })
        .catch( (error)=>{
          console.log(error)
        });
    },
    handleLogout(){
    this.dialog4Visible=true;
    },
    logout(){

      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: 'Loading...'
      });
      this.axios
        .post("http://127.0.0.1:8686/user/logout",{},{headers:{
              'token':window.sessionStorage.getItem("token"),
              'Content-Type': 'application/json'
            }})
        .then((response)=>{
          console.log(response)
          if(response.data.code == 200){
            this.dialog4Visible=false;
            loading.close();
            this.clear();
            window.sessionStorage.clear();
            this.$message({
              message: '登出成功',
              type: 'success',
              duration:500
            });
            this.$router.go(0);
            // setTimeout(location.reload(), 1000);

          }else{
            this.dialog4Visible=false;
            loading.close();
            this.clear();
            var errormessage=response.data.message;
            this.$message.error(errormessage);
          }

        })
        .catch( (error)=>{
          console.log(error)
        });
    },
    getnowTime(){
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      _this.gettime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
        return _this.gettime;
    },

  },
  mounted() {
    this.clear();
    this.getFruitList();
  },


};
</script>

<style>

#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  font-size: 62.5%;
}

.switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  }
 /*打开时文字位置设置*/
.switch .el-switch__label--right {
      z-index: 1;
       right: 10px;
     }
 /*关闭时文字位置设置*/
 .switch .el-switch__label--left {
        z-index: 1;
        left: 10px;
      }
 /*显示文字*/
 .switch .el-switch__label.is-active {
        display: block;
      }
 .switch.el-switch .el-switch__core,
 .el-switch .el-switch__label {
   width: 60px !important;
 }

</style>

