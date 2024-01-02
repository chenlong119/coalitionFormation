<script setup>
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import * as echarts from 'echarts'
//引入axios
import axios from "axios";
import request from "@/utils/request";

const {proxy} = getCurrentInstance();
const map = ref(null);
let chartInstance = null;
const props = defineProps(['isloading']);
const lb = 0;
const lt = 50;
const width = 800;
const height = 120;
const layers1 = 30;
const gap = 50;
const nodes = ref([]);
const getNodes = async () => {
  const res = await request.post("/graph/getnodes", {
    lb,
    lt,
    width,
    height,
    layers1,
    gap
  });
  nodes.value = res;
};


const initChart = async () => {
  chartInstance = echarts.init(map.value);
  const res = await axios.get('/src/assets/chain.json');
  echarts.registerMap('china', res.data);
  const initOption = {
    // backgroundColor: "#012248",
    title: {
      text: '企业分布图',
      right: 0,
      bottom: '10',
      textStyle: {
        color: '#292a2f',
        fontSize: 20,
      }
    },
    geo: {
      type: 'map',
      map: 'china',
      top: '30%',
      bottom: '0',
      roam: true,
      zoom: 1.8,
      itemStyle: {
        normal: {
          areaColor: "#023677",
          borderColor: "#1180c7",
        },
        emphasis: {
          areaColor: "#4499d0",
        },
      },
    },
    tooltip: {
      trigger: 'item',
    }
  }
  chartInstance.setOption(initOption)
}
const updateChart = async () => {
  await getNodes();
  // 处理图表需要的数据
  const seriesArr =
      [{
        type: 'scatter',
        label: {
          show: true, // 显示标签
          position: 'bottom', // 标签位置
          formatter: '{b}', // 标签内容为数据项的名称
          fontSize: 15,
          fontWeight: 'bold'
        },
        itemStyle: {
          normal: {
            color: "#ff9ba9",
          },
        },
        symbolSize: 15,
        data: nodes.value,
        coordinateSystem: 'geo',
        tooltip: {
          formatter: function (params) {
            let park = params.data.desc.park;
            let id = params.data.desc.id;
            let name = params.data.desc.name;
            let state = params.data.desc.state;
            let chain = params.data.desc.chain;
            let neighbors = params.data.desc.neighbor;
            let task = params.data.desc.task;
            let str = "";
            if (id) {
              str += "企业ID：" + id + "<br>";
            }
            if (name) {
              str += "企业名称：" + name + "<br>";
            }
            if (state) {
              str += "企业状态：" + state + "<br>";
            }
            if (park) {
              str += "园区：" + park + "<br>";
            }
            if (chain) {
              str += "产业链：" + chain + "<br>";
            }
            if (neighbors) {
              str += "邻居企业：" + neighbors + "<br>";
            }
            let taskField = task == 0 ? "暂无" : task
            str += "当前任务：" + taskField;
            return str;
          }
        }
      }]
  const dataOption = {
    series: seriesArr
  }
  chartInstance.setOption(dataOption)
}

watch(() => props.isloading, () => {
  console.log("要重新加载喽")
  updateChart();
})
onMounted(() => {
  initChart()
  updateChart()
})
</script>

<template>
  <div ref="map" style="height: 100%; width:100%;"></div>
</template>

<style scoped lang="scss">

</style>