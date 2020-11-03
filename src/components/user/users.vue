<template>
    <div>
         <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20" >
                <el-col :span="5">
                    <el-input placeholder="请输入内容" v-model="param.findUser.username" :clearable="true" @clear="getUserList">
                        <template slot="prepend">姓名</template>
                    </el-input>
                </el-col>
                <el-col :span="5">
                     <el-input placeholder="请输入内容" v-model="param.findUser.email" :clearable="true" @clear="getUserList">
                        <template slot="prepend">邮箱</template>
                    </el-input>
                </el-col>
                <el-col :span="5">
                     <el-input placeholder="请输入内容" v-model="param.findUser.phone" :clearable="true" @clear="getUserList">
                        <template slot="prepend">电话</template>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary"  @click="getUserList" style="margin-left: 30px;width:100px;">查询</el-button>
                    <el-button type="primary"  @click="empty" style="margin-left: 30px;width:100px;">重置</el-button>
                </el-col>
                <!-- <el-col :span="5">
                    <el-input>
                     <template>
                            <el-select v-model="param.findUser.email" clearable placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" >
                <el-col :span="5">
                    <el-input placeholder="请输入内容" v-model="param.findUser.username">
                        <template slot="prepend">部门</template>
                    </el-input>
                </el-col>
                <el-col :span="5">
                     <el-input placeholder="请输入内容" v-model="param.findUser.email">
                        <template slot="prepend">角色</template>
                    </el-input>
                </el-col> -->
              
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" style="margin-top: 15px;">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--用户列表区-->
            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="departmentName" label="部门"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="userStatusChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="param.PageBean.currPage"
                :page-sizes="[5, 10, 50, 100]"  :page-size="param.PageBean.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </el-card>

        <!--添加用户对话框-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="addForm.phone"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
        </el-dialog>

        <!--修改用户对话框-->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
         <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="departmentId">
                <el-input v-model="editForm.departmentId"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-input v-model="editForm.roleId"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        //验证手机号规则
        var checkPhoneNumber = (rule, value, callback) => {
            const regMobile = /^((1[3,5,8,7,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
            if(regMobile.test(value)){ 
                return callback()
            }
            callback(new Error("请输入合法手机号"))
        };
        return {
            options:[{
                    value:'选项1',
                    label:'黄金糕'
                    }, {
                    value:'选项2',
                    label:'双皮奶'
                    }],
            param:{
                PageBean: {
                    currPage:1,//当前页数
                    pageSize:10,//每页显示的记录数
                    totalCount:'',//总记录数
                    totalPage:'',//总页数
                    lists:''//每页的显示的数据
                },
                findUser: {
                    username:'',
                    email:'',
                    phone:''
                },
            },
            userList: [],
            totalCount: 0,
            totalPage:0,
            addDialogVisible: false,
            //添加用户表单数据
            addForm: {
                username:'',
                password:'',
                email:'',
                phone:''
            },
            //添加表单验证规则对象
            addFormRules: {
                username: [{required: true,message:'请输入用户名',trigger:'blur'},{min:3,max:10,message:'用户名长度在3~10个字符之间'}],
                email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
                phone: [{required: true,message:'请输入电话',trigger:'blur'},{validator: checkPhoneNumber,trigger:'blur'}]
            },
            editDialogVisible:false,
            editForm: {
                username:'',
                email:'',
                phone:'',
                roleId:'',
                departmentId:''
            },
            editFormRules: {
                email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
                phone: [{required: true,message:'请输入电话',trigger:'blur'},{validator: checkPhoneNumber,trigger:'blur'}]
            },
        
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
            const {data: res} = await this.$http.post('getPageUserList',this.param)
            console.log(res)
            this.userList = res.lists
            this.totalCount = res.totalCount
            this.totalPage = res.totalPage
        },
        handleSizeChange(newSize){
            this.param.PageBean.pageSize = newSize
            this.getUserList()
        },
        handleCurrentChange(newPage){
            this.param.PageBean.currPage = newPage
            this.getUserList()
        },
        async userStatusChanged(userInfo){
            const {data: res} = await this.$http.put(`updateUserStatus/${userInfo.id}/${userInfo.status}`)
            if(res.status !== 200){
                return this.$message.error(res.msg);
            }else{
                return this.$message.success(res.msg);
            }
        },
        empty(){
            this.param.findUser.username = '',
            this.param.findUser.email = '',
            this.param.findUser.phone = ''
        },
        //校验新增的用户信息
        addUser(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const{data:res} = await this.$http.post('addUser',this.addForm)
                if(res.status!=200){
                   return this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        async showEditDialog(id){
            const{data:res} = await this.$http.get('getUserById/'+id)
            this.editForm = res
            //console.log(res)
            this.editDialogVisible = true
            
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        editUser(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                const{data:res} = await this.$http.post('updateUser',this.editForm)
                // console.log(res)
                if(res.status!=200){
                   return this.$message.error(res.msg)
                }
                this.$message.success('修改用户成功')
                this.editDialogVisible = false
                this.getUserList()
            })
        },
        async deleteUser(id){
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            //用户确认删除，返回confirm字符串
            //用户取消删除，返回cancel字符串
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            const{data:res} = await this.$http.put('deleteUser/'+id)

            if(res.status !== 200){
                return this.$message.error(res.msg)
            }
            this.$message.success(res.msg)
            this.getUserList()
        }
    }
}
</script>
<style lang="less" scoped>
.el-table{
    margin-top: 15px;
    font-size: 12px;
}
.el-pagination {
    margin-top: 15px;
}
</style>