<template>
  <div>
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
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="list" stripe border>
        <el-table-column type="index"> </el-table-column>

        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="price" label="价格(元)"> </el-table-column>
        <el-table-column prop="carbonIntegral" label="所需碳积分">
        </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
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
            <el-button type="primary" size="mini" @click="deleteCate"
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
    <el-drawer
      title="填写商品信息"
      :before-close="handleClose"
      :visible.sync="addDialogVisible"
      direction="rtl"
      ref="addDialogRef"
      size="40%"
    >
      <el-card>
        <div class="demo-drawer__content">
          <!-- 进度条区域 -->
          <el-steps
            :active="activeIndex - '0'"
            finish-status="success"
            align-center
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品描述"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>

          <!-- tab栏 -->
          <el-form
            ref="addFormRef"
            :rules="addFormRules"
            :model="addForm"
            label-width="100px"
            label-position="top"
            id="addForm"
          >
            <el-tabs
              tab-position="left"
              v-model="activeIndex"
              :before-leave="beforeTabLeave"
            >
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="name">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格(元)" prop="price">
                  <el-input v-model="addForm.price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="碳积分" prop="carbonIntegral">
                  <el-input
                    v-model="addForm.carbonIntegral"
                    type="number"
                  ></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="1">
                <el-upload
                  :limit="1"
                  :action="this.$http.defaults.baseURL + '/common/upload'"
                  :on-remove="
                    (file) => {
                      addForm.image = '';
                    }
                  "
                  list-type="picture"
                  :on-success="handleSuccess"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="2">
                <textarea
                  v-model="addForm.description"
                  maxlength="20"
                  cols="60"
                  rows="10"
                  autofocus
                ></textarea>
                <el-button type="primary" @click="add" class="btnAdd"
                  >添加商品</el-button
                >
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-card>
    </el-drawer>
  </div>
</template>
<script>
import { addCommodity, getCommodityList, updateCommodity } from "@/api";
export default {
  data() {
    //校验规则
    var checkPrice = (rule, value, callback) => {
      const regPrice = /^\+?[1-9]\d*$/;
      if (regPrice.test(value)) {
        callback();
      }
      callback(new Error("不能为负数或0"));
    };
    return {
      // 查询所有商品的信息
      queryInfo: {
        name: "",
        page: 1,
        pageSize: 5,
      },
      total: 0,

      // 更改商品的信息
      cateInfo: {
        carbonIntegral: "",
        description: "",
        image: "",
        name: "",
        price: "",
        id: "",
      },
      //  新增商品的表单
      addForm: {
        carbonIntegral: "",
        description: "",
        image: "",
        name: "",
        price: "",
      },
      list: [],
      addDialogVisible: false,
      activeIndex: "0",
      addFormRules: {
        name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        carbonIntegral: [
          { required: true, message: "请填写商品兑换积分", trigger: "blur" },
          {
            validator: checkPrice,
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
          {
            validator: checkPrice,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getList() {
      const res = await getCommodityList(this.queryInfo);
      if (res.code === 0) return this.$message.error("获取商品列表失败");
      this.list = res.data.records;
      for (let i of this.list) {
        i.status = !!i.status;
      }
      this.total = res.data.total;
    },
    stateChanged(user) {
      this.getCateForm(user);
      this.updateCateForm(user);
    },
    editInfo(user) {},
    getCateForm(user) {
      const { carbonIntegral, description, image, name, price, id } = user;
      this.cateInfo = { carbonIntegral, description, image, name, price, id };
    },
    // 提交修改
    async updateCateForm() {
      const res = await updateCommodity(this.cateInfo);
      if (res.code === 0) return this.$message.error("服务器错误，修改失败");
      this.$message.success("修改成功");
    },
    // 删除功能
    deleteCate() {
      this.$message.info("还没写");
    },
    // 添加对话关闭
    handleClose() {
      this.$refs.addFormRef.resetFields();
      this.addDialogVisible = false;
    },
    submitAdd() {},
    cancelForm() {
      clearTimeout(this.timer);
    },
    // 上传成功
    handleSuccess(response) {
      this.addForm.image = response.data;
    },
    // 标签切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0") {
        let isvalid = false;
        this.$refs.addFormRef.validate((valid) => {
          isvalid = valid;
        });
        return isvalid;
      }
      if (oldActiveName === "1" && activeName === "2") {
        if (this.addForm.image === "") {
          this.$message.error("请先上传商品图片");
          return false;
        }
      }
    },
    // 添加按钮的功能
    async add() {
      const res = await addCommodity(this.addForm);
      if (res.code === 0) return this.$message.error("新增失败");
      this.$message.success("新增商品成功");
      this.addDialogVisible = false;
      this.getList();
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
.el-tabs--left,
.el-tabs--right {
  margin-top: 20px;
}
.el-tabs--left .el-tabs__header.is-left {
  margin-right: 46px !important;
  margin-top: 17px !important;
  margin-left: 20px !important;
}
.demo-drawer__content {
  margin-top: 20px;
}
</style>