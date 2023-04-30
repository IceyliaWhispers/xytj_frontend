<template>
  <!-- @contextmenu.prevent="revertMap" -->
  <div class="com-container">
    <div class="com-chart" ref="distance_ref"></div>
  </div>
</template>

<script>
import { getDistance } from "@/api";
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
      this.chartInstance = this.$echarts.init(
        this.$refs.distance_ref,
        "wonderland"
      );
      const initOption = {
        title: {
          text: "▎距离",
          left: 20,
          top: 20,
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "background-color: rgba(255, 255, 255, 0.7);color: black;border:0.5px solid grey",
        },
        grid: {
          top: "25%",
          left: "5%",
          right: "10%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: {
          type: "bar",
          label: {
            show: true,
            position: "top",
          },
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const res = await getDistance();
      if (res.code === 0) return this.$message.error("获取数据失败");
      this.allData = res.data;

      this.updateChart();
    },
    updateChart() {
      const xData = this.allData.map((item) => {
        return item.id.substr(5, 5);
      });
      const seriesData = this.allData.map((item) => {
        return item.distance;
      });
      const dataOption = {
        xAxis: {
          type: "category",
          data: xData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.distance_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 1.2,
          },
        },
        series: [
          {
            barWidth: this.titleFontSize * 1.8,
          },
        ],
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
