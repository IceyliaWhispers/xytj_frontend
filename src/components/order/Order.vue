<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>骑行记录</el-breadcrumb-item>
      <el-breadcrumb-item>记录管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input
            placeholder="请输入记录ID"
            v-model="queryId"
            clearable
            @clear="getList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="queryById"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="list" stripe border>
        <el-table-column type="index"> </el-table-column>

        <el-table-column
          prop="id"
          label="记录编号"
          width="200"
        ></el-table-column>
        <el-table-column prop="userId" label="用户编号" width="200">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="结束时间"> </el-table-column>
        <el-table-column prop="distance" label="骑行距离"> </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import { getOrderById, getOrderList } from "@/api";
export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        pageSize: 5,
      },
      id: "",
      total: 1,
      list: [],
      queryId: "",
    };
  },
  methods: {
    // 更新列表
    async getList() {
      const res = await getOrderList(this.queryInfo);
      if (res.code === 0) return this.$message.error(res.msg);
      this.list = res.data.records;
      this.total = res.data.total;
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
    async queryById() {
      const res = await getOrderById(this.queryId);
      if (res.code === 0) return this.$message.error("未查询到对应记录");
      this.list = [res.data];
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style scoped>
</style>