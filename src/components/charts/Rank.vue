<template>
  <!-- @contextmenu.prevent="revertMap" -->
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { getUserRank } from "@/api";
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
        this.$refs.rank_ref,
        "wonderland"
      );

      const initOption = {
        title: {
          text: "▎用户积分排名",
          left: 20,
          top: 20,
        },
        grid: {
          top: "25%",
          left: "3%",
          right: "10%",
          botton: "0%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          extraCssText:
            "background-color: rgba(255, 255, 255, 0.7);color: black;border:1px solid grey",
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,

                  color: "#4ea397",
                },
                {
                  offset: 0.5,
                  color: "#22c3aa",
                },
                {
                  offset: 1,
                  color: "#7bd9a5",
                },
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const res = await getUserRank();
      if (res.code === 0) return this.$message.error("获取数据失败");
      this.allData = res.data;
      this.updateChart();
    },
    updateChart() {
      const xData = this.allData.map((item) => {
        return item.userName;
      });
      const yData = this.allData.map((item) => {
        return item.carbonCoin;
      });
      xData.reverse();
      yData.reverse();
      const dataOption = {
        yAxis: {
          data: xData,
        },
        series: [
          {
            data: yData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
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
