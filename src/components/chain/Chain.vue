<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>区块链</el-breadcrumb-item>
      <el-breadcrumb-item>区块链溯源</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card">
      <el-row :gutter="20">
        <el-col class="input" :span="8" :offset="0">
          <el-input
            placeholder="请输入需要查询的区块链ID"
            v-model="id"
            clearable
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div class="result-container">
        <!-- -->
        <el-timeline v-if="list.length > 0" reverse>
          <el-timeline-item
            type="success"
            v-for="(item, index) in list"
            :key="index"
            :timestamp="item.timestamp.seconds"
            placement="top"
          >
            <el-card>
              <p><span class="title">tx_id:</span> {{ item.tx_id }}</p>
              <p><span class="title">tx_value:</span>{{ item.value }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无数据"></el-empty>
      </div>
    </el-card>
  </div>
</template>
<script>
import { queryHistory } from "@/api";
export default {
  data() {
    return {
      id: "",
      list: [],
    };
  },
  methods: {
    async getList() {
      const res = await queryHistory(this.id);
      this.list = res;
      if(this.list.length <= 0) return;
      this.list.forEach((item) => {
        item.timestamp.seconds = this.$dayjs
          .unix(item.timestamp.seconds)
          .format("YYYY-MM-DD HH:mm:ss");
      });
    },
  },
  mounted() {
    // this.getList();
  },
};
</script>
<style lang="less" scoped>
.container {
  .card {
    padding-right: 20px;
  }
}
.result-container {
  margin-top: 20px;
  // background-color: cyan;
}
.title {
  font-weight: bold;
}
</style>