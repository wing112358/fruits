<template>
    <div  class="page">
      <div class="login-logo">
        <!--   操作登录页图片-->
        <el-image :src="src"  class="login-image"></el-image>
      </div>
      <div>
        <el-form ref="loginFrom" :model="form" :rules="rules" label-width="80px" class="login-box">
          <h3 class ="login-title">欢迎光临</h3>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="form.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="text" v-model="form.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" v-on:click="mounted(),onsubmit('LoginForm')" round >登录</el-button>
            <el-button type="info" v-on:click="clear()" round >重置</el-button>
          </el-form-item>

        </el-form>

        <el-dialog
          title="温馨提示"
          :visible.sync="dialogVisible"
          width="30%"
          :append-to-body="true"
          :close-on-click-modal="false"
        >
          <span>请输入账号和密码</span>
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog
          title="警告"
          :visible.sync="dialog2Visible"
          width="30%"
          :append-to-body="true"
          :close-on-click-modal="false"
        >
          <span>账号密码错误，登录失败！</span>
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog2Visible = false">确 定</el-button>
      </span>
        </el-dialog>


      </div>
    </div>



</template>

<script>
import fruits from "@/assets/login/4.jpg";
export default {

  name: "Login",
  data(){
    return{
      form:{
        username:'',
        password:''
      },
      src:fruits,

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'}
        ]
      },

      // 对话框显示和隐藏
      dialogVisible: false,
      dialog2Visible:false

    }
  },

  methods:{
    onsubmit(loginFrom){
      // 为表单绑定验证功能
      // const token=store.getters.userInfo
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          const token=window.sessionStorage.getItem("token")
          if(token){
            this.$router.push("/List");
          }
        else{
          this.dialog2Visible = true;
          return false;
          }

        } else {
          this.dialogVisible = true;
          return false;
        }
      });
    },
    mounted() {
  this.axios
    .post('http://localhost:8080/login',{
      username:this.username,
      lastName:this.password
    })
    .then(function (response){
      console.log(response)
      window.sessionStorage.setItem("token",res.data.token)
    })
    .catch(function (error){
      console.log(error)
    })
},
   clear(){
      this.form.username='';
      this.form.password='';
   }
  }
    }


</script>

<style  scoped>

 .page{
   background-size: cover;
   height: 100%;
   width: 100%;
   position: fixed;
   top:0px;
   left:0px;
   right:0px;
   bottom:0px;
   background-color: #E3EDCD;
   backgroundSize: '100% auto';
 }

 .login-image{
   background-size: cover;
   height: 100%;
   width: 100%;
   position: fixed;
   top:0px;
   left:0px;
   right:0px;
   bottom:0px;
   /*background-color: #E3EDCD;*/
   backgroundSize: '100% auto';
   /*width: 20%;*/
   /*height: 20%;*/
   /*top:0px;*/
   /*bottom: 0px;*/
 }

  .login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  }

    .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
}
    [type="primary"]{
      align:center;
      width: 200px;
    }

</style>
