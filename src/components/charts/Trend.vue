<template>
  <!-- @contextmenu.prevent="revertMap" -->
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import { getRevenue } from "@/api";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 从服务器中获取的所有数据
      titleFontSize: 0, // 指明标题的字体大小
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, "wonderland");

      const initOption = {
        title: {
          text: "▎趋势",
          left: 20,
          top: 20,

        },
        grid: {
          left: "3%",
          top: "25%",
          right: "10%",
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "background-color: rgba(255, 255, 255, 0.7);color: black;border:1px solid grey",
        },
        legend: {
          top: "15%",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          scale: true,
        },
        series: [
          {
            name: "碳积分",
            type: "line",
            boundaryGap: false,
          },
          {
            name: "人民币",
            type: "line",
            boundaryGap: false,
            itemStyle:{
                color: "#7bd9a5",
            }
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const res = await getRevenue();
      if (res.code === 0) return this.$message.error("获取数据失败");
      this.allData = res.data;
      this.updateChart();
    },
    updateChart() {
      const xData = this.allData.map((item) => {
        return item.id.substr(5, 5);
      });
      const carbonData = this.allData.map((item) => {
        return item.carbonCoin;
      });
      const moneyData = this.allData.map((item) => {
        return item.money;
      });
      const dataOption = {
        xAxis: {
          data: xData,
        },
        series: [
          {
            data: carbonData,
          },
          {
            data: moneyData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 1.2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
}
</style>
