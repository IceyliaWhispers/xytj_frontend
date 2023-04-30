<template>
  <!-- @contextmenu.prevent="revertMap" -->
  <div class="com-container">
    <div class="com-chart" ref="time_ref"></div>
  </div>
</template>

<script>
import { getTimeValue } from "@/api";
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
        this.$refs.time_ref,
        "wonderland"
      );

      const initOption = {
        title: {
          text: "▎时间",
          left: 20,
          top: 20,
        },
        tooltip: {
          trigger: "item",
          extraCssText: "background-color: rgba(0, 0, 0, 0);",
          formatter(param) {
            return `<div style="background-color: rgba(255, 255, 255, 0.7);;border: 1px solid ${param.color}; color: black;width: auto;border-radius: 3%;display: flex; align-items: center; ">
        <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:${param.color}"></span>
        <span style="width: auto;text-align: center;">${param.value}  (${param.percent}%)</span>
    </div>`;
          },
        },
        series: {
          type: "pie",
          radius: ["20%", "70%"],
          label: {
            show: true,
            formatter(param) {
              // correct the percentage
              return param.name;
            },
          },
          labelLine: {
            show: true,
          },
          itemStyle: {
            borderRadius: 20,
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const res = await getTimeValue();
      if (res.code === 0) return this.$message.error("获取数据失败");
      this.allData = res.data;
      this.updateChart();
    },
    updateChart() {
      const seriesData = this.allData.map((item) => {
        return {
          name: item.id,
          value: item.num,
        };
      });
      const dataOption = {
        series: {
          data: seriesData,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.time_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 1.2,
          },
        },
        series: {
          label: {
            fontSize: this.titleFontSize / 1.4,
          }
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
