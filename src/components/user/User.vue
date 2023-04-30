<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="list" stripe border>
        <el-table-column type="index"> </el-table-column>

        <el-table-column prop="name" label="真实姓名" width="200">
        </el-table-column>
        <el-table-column prop="username" label="账户" width="200">
        </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex === "1" ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              active-text="启用"
              v-model="scope.row.status"
              @change="stateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editInfo(scope.row)"
              >编辑</el-button
            >
            <el-button type="primary" size="mini" @click="deleteUser"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->

    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="账户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <template>
            <el-radio v-model="editForm.sex" label="1">男</el-radio>
            <el-radio v-model="editForm.sex" label="0">女</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, updataUser } from "@/api";
export default {
  data() {
    // 手机验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
      if (regMobile.test(value)) {
        callback();
      }
      callback(new Error("请输入合法手机号码"));
    };
    return {
      queryInfo: {
        name: "",
        page: 1,
        pageSize: 5,
      },
      total: 1,
      list: [],
      //   编辑是否可见
      editDialogVisible: false,
      //   当前列的用户信息
      userForm: {
        id: "",
        name: "",
        username: "",
        password: "",
        phone: "",
        sex: "",
        idNUmber: "",
        status: "",
      },
      //   编辑对话框的信息
      editForm: {
        username: "",
        password: "",
        sex: "",
      },
      //   编辑表单验证规则
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 更新列表
    async getList() {
      const res = await getUserList(this.queryInfo);
      if (res.code === 0) return this.$message.error(res.msg);

      this.list = res.data.records;
      for (let i of this.list) {
        i.status = !!i.status;
      }
      this.total = res.data.total;
    },
    // 状态改变
    async stateChanged(user) {
      this.getEditForm(user);
      this.updateEditForm();
    },
    // 展示修改对话框
    editInfo(user) {
      this.editDialogVisible = true;
      this.getEditForm(user);
      this.editForm = this.userForm;
    },
    // 编辑关闭
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确认
    updateEdit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.updateEditForm();
        this.editDialogVisible = false;
      });
    },
    // 获取当前列的用户信息
    getEditForm(user) {
      const { id, name, username, password, phone, sex, idNUmber, status } =
        user;
      this.userForm = {
        id,
        name,
        username,
        password,
        phone,
        sex,
        idNUmber,
        status,
      };
    },
    // 提交修改
    async updateEditForm() {
      const res = await updataUser(this.userForm);
      if (res.code === 0) return this.$message.error("服务器错误，修改失败");
      this.$message.success("修改成功");
    },
    deleteUser() {
      this.$message.info("暂时没搞");
    },
    //   当页面大小被修改
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.getList();
    },
    //   第几页变化了
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped>
#sexItem span {
  margin: 10px;
}
</style>