<template>
  <el-container class="home-container">
      <!--头部-->
    <el-header>
      <div>
        <img src="../assets/images/logo3.png" width="25%" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
        <!--左侧边栏-->
      <el-aside :width="isCollapse ? '70px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu  background-color="#333744" text-color="#fff" active-text-color="#409eff" 
        :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
            <!--一级菜单-->
            <!--:index只接收字符串不接收数值，所以item.id + ''数值+字符串变为字符串-->
            <el-submenu :index="itemP.id + ''" v-for="itemP in parentMenulist" :key="itemP.id">
                <template slot="title">
                    <i :class="itemP.icon"></i>
                    <span>{{itemP.name}}</span>
                </template>
                <!--二级菜单-->
                <!--v-for的优先级高于v-if-->
                <!-- <el-menu-item :index="itemC.id + ''" v-for="itemC in childMenulist" :key="itemC.id" v-if="itemC.parentId==itemP.id"> 
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{itemC.name}}</span>
                    </template>
                </el-menu-item> -->
                <template v-for="(itemC, index) in childMenulist">
                    <el-menu-item  :prop="itemC.prop" :key="index" :index="'/'+itemC.url" v-if="itemC.parentId==itemP.id" @click="saveNavState('/'+itemC.url)"> 
                        <template slot="title">
                            <i :class="itemC.icon"></i>
                            <span>{{itemC.name}}</span>
                        </template>
                    </el-menu-item>
                </template>
            </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主体-->
      <el-main>
          <!--路由占位符router-view进行渲染展示-->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            parentMenulist: [],
            childMenulist: [],
            isCollapse:false, //是否折叠
            activePath:'' //被激活的链接地址
            
        }
    },
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        logout() {
        //清空token
        window.sessionStorage.clear();
        //跳转到登录页
        this.$router.push("/login");
        },
        //获取所有菜单
        async getMenuList() {
            const {data: res} = await this.$http.get('getMenu')
            if(res.status !== 200) return this.$message.error("菜单数据获取失败");
            this.parentMenulist = res.parentMenu
            this.childMenulist = res.childMenu
        },
        //点击按钮切换左侧菜单折叠展开
        toggleCollapse(){
            this.isCollapse=!this.isCollapse
        },
        //保存菜单栏的地址激活状态，即高亮
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath
            // this.$router.replace(activePath)
        }
    },
};
</script>

<style lang="less" scoped>
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 30px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.home-container{
    height: 100%;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>