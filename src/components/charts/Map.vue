<!-- 中国地图和成都市地图 -->
<template>
  <!-- @contextmenu.prevent="revertMap" -->
  <div class="com-container" @contextmenu.prevent="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import {
  getChenDuMap,
  getChenDuValue,
  getChinaMap,
  getChinaValue,
} from "@/api";
export default {
  data() {
    return {
      chartInstance: null,
      allData: [],
      mapData: {}, // 所获取的省份的地图矢量数据
      chenDuData: [],
      chinaMaxNum: 0,
      chenDuMaxNum: 0,
      chinaSeriesData: [],
      chenduSeriesData: [],
      isChenDu: false,
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
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "wonderland");
      // 获取中国地图的矢量数据
      const res = await getChinaMap();
      const chenDuRes = await getChenDuMap();
      this.$echarts.registerMap("china", res);
      this.$echarts.registerMap("chendu", chenDuRes);

      const initOption = {
        title: {
          text: "▎ 地图",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          roam: false,
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
        tooltip: {
          trigger: "item",
          extraCssText: "background-color: rgba(0, 0, 0, 0);",

          formatter(param) {
            return `<div style="background-color: rgba(255, 255, 255, 0.7);;border: 1px solid ${param.color}; color: black;width: auto;border-radius: 3%;display: flex; align-items: center; ">
        <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:#F58DB2"></span>
        <span style="width: auto;text-align: center;">${param.name}:${param.value}</span>
    </div>`;
          },
        },
        series: [
          {
            type: "map",
            geoIndex: 0,
          },
        ],
        visualMap: {
          min: 0,
          inRange: {
            color: ["white", "#4ea397"],
          },
          calculable: true,
          text: ["high", "low"],
        },
      };
      this.chartInstance.setOption(initOption);
      // 切换到成都地图
      this.chartInstance.on("click", async (arg) => {
        if (arg.data.name === "四川" && this.isChenDu === false) {
          this.isChenDu = true;
          const changeOption = {
            geo: {
              map: "chendu",
            },
            series: [
              {
                data: this.chenduSeriesData,
              },
            ],
            visualMap: {
              max: this.chenDuMaxNum,
            },
          };
          this.chartInstance.setOption(changeOption);
        }
      });
    },
    async getData() {
      const res = await getChinaValue();
      if (res.code === 0) return this.$message.error("获取省份数据失败");
      this.allData = res.data;
      const chendu_res = await getChenDuValue();
      if (chendu_res.code === 0) return this.$message.error("获取省份数据失败");
      this.chenDuData = chendu_res.data;
      this.updateChart();
    },
    updateChart() {
      // 处理图表需要的数据
      // 图例的数据
      this.chinaSeriesData = this.allData.map((item) => {
        if (item.num > this.chinaMaxNum) {
          this.chinaMaxNum = item.num;
        }
        if (
          item.id.substr(0, 3) === "黑龙江" ||
          item.id.substr(0, 3) === "内蒙古"
        ) {
          return {
            name: item.id.substr(0, 3),
            value: item.num,
          };
        }
        return {
          name: item.id.substr(0, 2),
          value: item.num,
        };
      });
      this.chenduSeriesData = this.chenDuData.map((item) => {
        if (item.num > this.chenDuMaxNum) {
          this.chenDuMaxNum = item.num;
        }
        return {
          name: item.id,
          value: item.num,
        };
      });
      this.chinaMaxNum += this.chinaMaxNum * 0.1;
      this.chenDuMaxNum += this.chenDuMaxNum * 0.1;
      const dataOption = {
        series: [
          {
            data: this.chinaSeriesData,
          },
        ],
        visualMap: {
          max: this.chinaMaxNum,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize / 1.2,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 回到中国地图
    revertMap() {
      this.isChenDu = false;
      const changeOption = {
        geo: {
          map: "china",
        },
        series: {
          data: this.chinaSeriesData,
        },
        visualMap: {
          max: this.chinaMaxNum,
        },
      };
      this.chartInstance.setOption(changeOption);
    },
  },
};
</script>

<style lang='less' scoped>
.com-container::after{
  content: "数据来源于高德开发平台";
  position: absolute;
  right: 3%;
  bottom: 2%;
  margin: 0 auto;
  font-size: 12px;
}
</style>
