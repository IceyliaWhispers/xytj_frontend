<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
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
        <el-col :span="4" :offset="0">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加管理员</el-button
          >
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
    <!-- 添加对话框 -->
    <el-dialog
      title="添加管理员"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="addForm.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" id="sexItem">
          <template>
            <el-radio v-model="addForm.sex" label="1">男</el-radio>
            <el-radio v-model="addForm.sex" label="0">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addAdminApi, getAdminList, updateAdmin2 } from "@/api";
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
    var checkId = (rule, value, callback) => {
      const idNum =
        /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/;
      if (idNum.test(value)) {
        callback();
      }
      callback(new Error("身份证号码不合法"));
    };
    var checkName = (rule, value, callback) => {
      const name = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
      if (name.test(value)) {
        callback();
      }
      callback(new Error("姓名不合法"));
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
      //   添加是否可见
      addDialogVisible: false,
      //   当前列的用户信息
      userForm: {
        id: "",
        name: "",
        username: "",
        password: "",
        phone: "",
        sex: "",
        idNumber: "",
        status: "",
      },
      //   编辑对话框的信息
      editForm: {
        username: "",
        password: "",
        sex: "",
      },
      //   需要添加的用户信息
      addForm: {
        idNumber: "430422200504190532",
        name: "王二",
        phone: "15845756574",
        sex: "1",
        username: "wanger",
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
      addFormRules: {
        name: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
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
        idNumber: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            validator: checkId,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 更新列表
    async getList() {
      const res = await getAdminList(this.queryInfo);
      if (res.code !== 1) return this.$message.error(res.msg);

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
    // 添加关闭
    addFormClosed() {
      this.$refs.addFormRef.resetFields();
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
      const { id, name, username, password, phone, sex, idNumber, status } =
        user;
      this.userForm = {
        id,
        name,
        username,
        password,
        phone,
        sex,
        idNumber,
        status,
      };
    },
    // 提交修改
    async updateEditForm() {
      const res = await updateAdmin2(this.userForm);
      if (res.code === 0) return this.$message.error("服务器错误，修改失败");
      this.$message.success("修改成功");
    },
    deleteUser() {
      this.$message.info("暂时没搞");
    },
    // 添加管理员，点击确定
    addAdmin() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await addAdminApi(this.addForm);
        if (res.code === 0) return this.$message.error("添加失败");
        this.$message.success("添加管理员成功");
        this.addDialogVisible = false;
      });
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