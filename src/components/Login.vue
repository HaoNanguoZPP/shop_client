<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区-->
            <div class="avatar_box">
                <img src="../assets/images/logo1.png" alt="">
            </div>
            <!--登录表单区-->
            <el-form ref="loginFormRef" :model="user" :rules="loginFormRules" label-width="0" class="login_form">
                <el-form-item class="input_css" prop="username">
                    <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item class="input_css" prop="password">
                    <el-input placeholder="密码" prefix-icon="el-icon-lock" v-model="user.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    //点击登录时，先调用 validate方法，验证表单内容是否有错误；valid 表单验证的结果，布尔值 
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        //console.log(valid)
        if (!valid) return;//return结束，不发送请求；
        //this访问原型上的$http成员,发起 ajax请求；post(请求地址，this.user 请求参数)
        //result返回结果是promise，所以用async/await；
        //async 加在最近的一个函数上；result对象，包含了6个属性，都是axios封装的，只用data属性，把它结构赋值出来；解构赋值：const { age, gender } = user user是一个对象；
        //返回值是promise,用await async简化，await只能用在async修饰的方法中   async(异步)
        const {data:res}=await this.$http.post("login", this.user)
        if(res.status !==200) return  this.$message.error(res.msg);
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token) 
        //调用API 保存session；('token 键'，值是 res.data 中保存的 token)   
        this.$router.push('/home') //编程式导航，跳转到 '/home' 页面；

      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
 background: #ffffff;
 height: 50%;
 width: 40%;
 border-radius: 5px;
 position: absolute;
 left: 50%;
 top: 50%;
 // 在X,Y轴各移动-50%
 transform: translate(-50%,-50%);

 .avatar_box{
     height: 250px;
     width: 250px;
     border: 1px solid #eee;
     border-radius: 50%;
     padding: 10px;
     position: absolute;
     left: 50%;
      // 在X,Y轴各移动-50%
     transform: translate(-50%,-50%);
     background-color: #E6E6E6;
     img{
         width: 100%;
         height: 100%;
         border-radius: 50%;
         background-color: #E6E6E6;
     }
 }
}

.login_form{
    position: absolute;
    bottom: 10%;
    width: 100%;
    padding: 0 50px;
    box-sizing: border-box;
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .input_css{
        height: 30px;
        padding: 20px 0;
    }
}
</style>
