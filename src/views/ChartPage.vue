<template>
  <div class="screen-container">
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <Rank ref="rank"></Rank>
          <div class="resize">
            <img
              @click="changeSize('rank')"
              :src="
                fullScreenStatus.map ? 'imgs/compress.png' : 'imgs/expand.png'
              "
            />
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <Trend ref="trend"></Trend>
          <div class="resize">
            <img
              @click="changeSize('trend')"
              :src="
                fullScreenStatus.map ? 'imgs/compress.png' : 'imgs/expand.png'
              "
            />
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top">
          <div id="totalnum-container">
            <div>
              <span id="time">{{ total }}</span>
              <span id="perCarbon">已减少碳排放量</span>
            </div>
            <div>
              <span id="perCarbonCoin">{{ perCarbonCoin }}</span>
              <span>每公里碳积分</span>
            </div>
            <div>
              <span id="generate" >{{ generate }}</span>
              <span>增益碳积分</span>
            </div>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.map ? 'fullscreen' : '']"
        >
          <Map ref="map"></Map>
          <div class="resize">
            <img
              @click="changeSize('map')"
              :src="
                fullScreenStatus.map ? 'imgs/compress.png' : 'imgs/expand.png'
              "
            />
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div
          id="right-top"
          :class="[fullScreenStatus.time ? 'fullscreen' : '']"
        >
          <Time ref="time"></Time>
          <div class="resize">
            <img
              @click="changeSize('time')"
              :src="
                fullScreenStatus.map ? 'imgs/compress.png' : 'imgs/expand.png'
              "
            />
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.distance ? 'fullscreen' : '']"
        >
          <Distance ref="distance"></Distance>
          <div class="resize">
            <img
              @click="changeSize('distance')"
              :src="
                fullScreenStatus.distance
                  ? 'imgs/compress.png'
                  : 'imgs/expand.png'
              "
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Map from "@/components/charts/Map";
import Time from "@/components/charts/Time";
import Rank from "@/components/charts/Rank";
import Trend from "@/components/charts/Trend";
import Distance from "@/components/charts/Distance";
import { getGenerateCarbonCoin, getPerCarbonCoin, getTotalCarbon } from "@/api";

export default {
  created() {},
  destroyed() {},
  data() {
    return {
      fullScreenStatus: {
        map: false,
        time: false,
        rank: false,
        trend: false,
        distance: false,
      },
      totalNum: {
        total: 0,
        perCarbonCoin: 0,
        generate: 0,
      },
    };
  },
  computed: {
    total() {
      return this.numFormat(this.totalNum.total, 0);
    },
    perCarbonCoin() {
      return this.totalNum.perCarbonCoin;
    },
    generate() {
      return this.numFormat(this.totalNum.generate, 0);
    },
  },
  methods: {
    // 全屏的方法
    changeSize(chartName) {
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName];
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },
    async getData() {
      const res1 = await getTotalCarbon();
      const res2 = await getPerCarbonCoin();
      const res3 = await getGenerateCarbonCoin();
      if (res1.code === 0 || res2.code === 0 || res3.code === 0)
        return this.$message.error("获取数据失败");
      this.totalNum.total = res1.data;
      this.totalNum.perCarbonCoin = res2.data;
      this.totalNum.generate = res3.data;
    },
    numFormat(num, digits) {
      var si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (
        (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
      );
    },
  },
  mounted() {
    this.getData();
  },
  components: {
    Map,
    Time,
    Rank,
    Trend,
    Distance,
  },
};
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
  background-color: white;
}

.screen-container {
  width: 100%;
  // height: 750px;
  height: 100%;
  padding: 20px 20px;
  color: black;
  box-sizing: border-box;
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 500px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 43%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 25%;
      position: relative;
      #totalnum-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100px;
        font-size: 0.8em;
        height: 100%;
        // background-color: white;
        border-radius: 8px;
        // box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

        div {
          position: relative;
          margin: 0 15px;
          background-color: white;
          border: 0 0 0 1px solid black;
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

          span {
            position: relative;
            display: block;
            width: 130px;
            height: 100px;
            font-weight: 300;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3em;
            z-index: 10;
            background-color: var(--primary2);
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
            color: white;
          }
          span:nth-child(2) {
            height: 40px;
            font-size: 0.7em;
            font-weight: 500;
            z-index: 9;
            box-shadow: none;
            color: white;
            background-color: rgb(0, 182, 155);
          }
        }
      }
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 71%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 50%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  width: 25px;
  right: 20px;
  top: 20px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
