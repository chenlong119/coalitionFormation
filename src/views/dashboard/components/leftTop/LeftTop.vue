<template>
  <Body :dec-id="3"  name="任务执行情况" icon="icon-report">
  <template #default>
    <!-- 4个主要的数据 -->
    <div class="main">
      <div
          v-for="(item, index) in numberData"
          :key="index"
          class="item"
      >
        <div class="top">
          <i class="iconfont" :class="[iconFont[index]]"/>
          <dv-digital-flop class="dv-digital-flop" :config="item.config"/>
        </div>
        <p class="text">
          <span> {{ item.text }} </span>
          <span>(个)</span>
        </p>
      </div>
    </div>
    <div class="chart">
      <Chart/>
    </div>
  </template>
  </Body>
</template>

<script setup>
import {onMounted, onUnmounted, reactive} from 'vue'
import Chart from './chart/Chart.vue'
import Body from "@/views/dashboard/components/main/component/Body.vue";
// 下层数据
const dataArr = [
  {
    number: 25,
    text: '今日完成总量'
  },
  {
    number: 57,
    text: '总共完成数量'
  },
  {
    number: 18,
    text: '正在执行数量'
  },
  {
    number: 6,
    text: '未通过数量'
  }
]
// 对应图标
const iconFont = [
  'icon-summary',
  'icon-el-hg-icon-sum',
  'icon-process',
  'icon-a-PaperFail'
]
const numberData = reactive([])
// let intervalInstance = null
onMounted(() => {
  setData()
})

const setData = () => {
  dataArr.forEach(e => {
    numberData.push({
      config: {
        number: [e.number],
        toFixed: 1,
        content: '{nt}',
        style: {
          fontSize: 24
        }
      },
      text: e.text
    })
  })
}
</script>

<style scoped lang="scss">
.chart {
  height: 65%;
  display: flex;
  justify-content: center;
}

.main {
  height: 35%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-items: center;
  grid-gap: 10px;

  .item {
    .top {
      display: flex;

      i {
        font-size: 20px;
        line-height: 30px;
        font-weight: 800;
        color: #004d8c;
      }
    }

    .text {
      span:nth-child(2) {
        color: #ee9900;
      }
    }

    .dv-digital-flop {
      height: 30px;
      width: 80px;
    }
  }

}
</style>