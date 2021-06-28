<template>
    <div  class="page">
      <div class="login-logo">
        <!--   操作登录页图片-->
        <el-image :src="src"  class="login-image"></el-image>
      </div>
      <div>
        <el-form ref="loginFrom" :model="login" :rules="loginrules" label-width="80px" class="login-box">
          <h3 class ="login-title">欢迎光临</h3>
          <el-form-item label="用户名"   prop="username">
            <el-input type="text" v-model="login.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码"   prop="password">
            <el-input type="text" v-model="login.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <br />
          <el-form-item >
            <el-button type="primary" v-on:click="onsubmit('LoginForm')" :loading="loginloading" round>登录</el-button>
            <el-button type="info" v-on:click="clear(),clearLoginvirify()" round >重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-link @click="dialogVisible = true">还没有账号？点击注册</el-link>
          </el-form-item>

        </el-form>

      </div>
      <el-dialog
        title="注册"
        class="regiesterbox"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :before-close="handleClose">
        <el-form ref="regiesterFrom"  :model="regiester" label-width="100px" :rules="regiesterrules">
          <el-form-item label="账号"  label-width="100px" style="width:300px" prop="username">
            <el-input v-model="regiester.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="登录密码" label-width="100px" style="width:300px" prop="password">
            <el-input v-model="regiester.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="确认密码"  label-width="100px" style="width:300px" prop="checkpassword">
            <el-input v-model="regiester.checkpassword" placeholder="请确认密码"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="用户描述"  label-width="100px" style="width:300px" prop="desc">
            <el-input type="textarea"  autosize v-model="regiester.desc" placeholder="请输入描述"></el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button type="primary" @click="handleregiester()" :loading="regloading">注册</el-button>
            <el-button type="info" @click="clear(),clearregiestervirify(),dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>



</template>

<script>
import fruits from "@/assets/login/4.jpg";
export default {

  name: "Login",
  data(){
    var validatePass = (rule, value, callback) => {
      if (value !== this.regiester.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return{
      login:{
        username:'',
        password:''
      },
      regiester:{
        username:'',
        password:'',
        checkpassword:'',
        desc:''
      },

      src:fruits,
      dialogVisible:false,
      loginloading:false,
      regloading:false,

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      loginrules: {
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'},
          {pattern:/^[a-zA-Z0-9_-]{4,16}$/,message: '4到16位（字母，数字，下划线，减号）', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'},
          {pattern:/^[a-zA-Z]\w{5,17}$/,message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur'}
        ]
      },
      regiesterrules: {
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'},
          {pattern:/^[a-zA-Z0-9_-]{4,16}$/,message: '4到16位（字母，数字，下划线，减号）', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'},
          {pattern:/^[a-zA-Z]\w{5,17}$/,message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur'}
        ],
        checkpassword: [
          {required: true, message: '密码不可为空', trigger: 'blur'},
          {pattern:/^[a-zA-Z]\w{5,17}$/,message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ]
      },

    }
  },

  methods:{
    onsubmit(){
      // 为表单绑定验证功能
      // const token=store.getters.userInfo
      this.$refs.loginFrom.validate((valid) => {
        if (valid)  {

          //loading
          const loading = this.$loading({
            lock: true,
            fullscreen: true,
            text: 'Loading...'
          });
          this.clearLoginvirify();
          this.axios
            .post('http://localhost:8686/user/login',{
              "username":this.login.username,
              "password":this.login.password
            })
            .then((response)=>{
              console.log(response)
              if(response.data.code == 200){
                window.sessionStorage.setItem("token",response.data.data.token)
                window.sessionStorage.setItem("username",this.login.username)
                // this.$message({
                //   message: '登录成功',
                //   type: 'success'
                // });
                loading.close();

                this.clear();
                this.$router.push("/List").catch(() =>{});
              }else{
                loading.close();
                this.clear();
                var errormessage=response.data.message;
                this.$message.error(errormessage);
              }

            })
            .catch( (error)=>{
              console.log(error)
            });
        }
      });
    },
    handleregiester(){
      this.$refs.regiesterFrom.validate((valid) => {
        if (valid) {
          this.clearregiestervirify();
          //loading
          const loading = this.$loading({
            lock: true,
            fullscreen: true,
            text: 'Loading...'
          });
          this.axios
            .post('http://localhost:8686/user/regiester',{
              "username":this.regiester.username,
              "password":this.regiester.password,
              "checkpassword":this.regiester.checkpassword,
              "desc":this.regiester.desc
            })
            .then((response)=>{
              console.log(response)
              if(response.data.code == 200){
                window.sessionStorage.setItem("token",response.data.data.token)
                this.$message({
                  message: '注册成功',
                  type: 'success'
                });;
                loading.close();
                this.dialogVisible=false;
                this.clear();
                this.login.username=this.regiester.username;
                this.login.password=this.regiester.password;
              }else{
                loading.close();
                this.dialogVisible=false;
                this.clear();
                var errormessage=response.data.message;
                this.$message.error(errormessage);
              }

            })
            .catch( (error)=>{
              console.log(error)
            });
        }
      });
    },
    handleClose(done) {
      done();
    },
   clear(){
     this.login={
       username:'',
         password:''
     };
     this.regiester={
       username:'',
         password:'',
         checkpassword:'',
         desc:''
     };

   },
    clearLoginvirify(){
      this.$nextTick(()=>{
        this.$refs["loginFrom"].clearValidate();
      });
    },
    clearregiestervirify(){
      this.$nextTick(()=>{
        this.$refs["regiesterFrom"].clearValidate();
      });
    },
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
  .regiesterbox{
    text-align:left !important;
    width:50%;
    position: absolute;
    top: 5%;
    left: 27%;
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
