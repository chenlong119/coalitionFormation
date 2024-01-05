<script setup>
import * as echarts from "echarts";
import {onMounted, ref, watch} from 'vue'
import axios from "axios";


let nodes = ref([]);
let nodes2 = ref([]);
let nodes3 = ref([]);
let nodes4 = ref([]);
let links = ref([]);
let interval = null;
const chart1 = ref(null);
const chart2 = ref(null);
let myChart2 = null;
let myChart1 = null;


const getNodes = async () => {
  const res = await axios.get('/src/assets/nodes.json');
  nodes.value = res.data;
}
const getNodes2 = async () => {
  const res = await axios.get('/src/assets/nodes2.json');
  nodes2.value = res.data;
}
const getNodes3 = async () => {
  const res = await axios.get('/src/assets/nodes3.json');
  nodes3.value = res.data;
}
const getNodes4 = async () => {
  const res = await axios.get('/src/assets/nodes4.json');
  nodes4.value = res.data;
}

const getLinks = async () => {
  const res = await axios.get('/src/assets/links.json');
  links.value = res.data;
};

const getcategories = (nodes) => {
  let cateList = nodes.value.map(item =>
      item.category
  )
  cateList = cateList.filter((item, index, arr) => {
    return arr.indexOf(item) === index
  });
//排序
  cateList.sort((a, b) => {
    return a - b
  })
  return cateList.map(item => {
    return {
      name: item === 0 ? "空闲" : "联盟" + item
    }
  });
}
const getLegend = (nodes) => {
  const categories = getcategories(nodes);
  return {
    data: categories.map(item => item.name),
    left: 0,
    top: 0
  };
}
const getNodesAndLinks = async () => {
  await getNodes();
  await getLinks();
  let legend = getLegend(nodes);
  let categories = getcategories(nodes);
  let tooltip = {
    formatter: function (params) {
      let park = params.data.desc?.park;
      let id = params.data.desc?.id;
      let name = params.data.desc?.name;
      let state = params.data.desc?.state;
      let chain = params.data.desc?.chain;
      let neighbors = params.data.desc?.neighbor;
      let task = params.data.desc?.task;
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
      str += "所属联盟：" + taskField;
      return str;
    }
  };
  let series = [
    {
      name: 'multi',
      type: 'graph',
      layout: 'none',
      data: nodes.value,
      links: links.value,
      categories: categories,
      symbolSize: 30,
      roam: true,
      tooltip: {},
      label: {
        show: true,
        position: 'bottom'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
        width: 3
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10
        }
      }
    }];
  let newOption = {
    series,
    tooltip,
    legend
  }
  myChart1.setOption(newOption);
  myChart2.setOption(newOption);
}

let option1 = {
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  graphic: [
    {
      type: 'polygon',
      shape: {
        points: [[40, 70], [850, 70], [810, 200], [0, 200]]
      },
      style: {
        fill: '#eee',
        stroke: 'red',
        lineWidth: 3,
        opacity: 0.3, //透明度
        shadowBlur: 10, //边框阴影模糊程度
        shadowColor: 'black', //边框阴影颜色
        shadowOffsetX: 5, //边框阴影水平偏移量
        shadowOffsetY: 5 //边框阴影垂直偏移量
      }
    },
    {
      type: 'polygon',
      shape: {
        points: [[0, 390], [810, 390], [850, 250], [40, 250]]  //左下、右下、右上、左上
      },
      style: {
        fill: '#eee',
        stroke: 'blue',
        lineWidth: 3,
        opacity: 0.3,
        shadowBlur: 10,
        shadowColor: 'black',
        shadowOffsetX: 5,
        shadowOffsetY: 5
      }
    },
    {
      type: 'polygon',
      shape: {
        points: [[0, 600], [810, 600], [850, 450], [40, 450]]  //左下、右下、右上、左上
      },
      style: {
        fill: '#eee',
        stroke: 'green',
        lineWidth: 3,
        opacity: 0.2,
        shadowBlur: 10,
        shadowColor: 'black',
        shadowOffsetX: 5,
        shadowOffsetY: 5
      }
    }
  ],
};
let data2 = [];
let data3 = [];
let data4 = [];
let option2 = null;
let option3 = null;
let option4 = null;
let index = ref(1);
const date = ref(null);
watch(date, () => {
  let random = Math.random();
  if (random < 0.33) {
    myChart1.setOption(option2);
    myChart2.setOption(option2);
  } else if (random < 0.66) {
    myChart1.setOption(option3);
    myChart2.setOption(option3);
  } else {
    myChart1.setOption(option4);
    myChart2.setOption(option4);
  }
})

const startTimer = () => {
  interval =
      setInterval(() => {
        if (index.value === 1) {
          myChart2.setOption(option1);
          index.value++;
        } else if (index.value === 2) {
          myChart2.setOption(option2);
          index.value++;
        } else if (index.value === 3) {
          myChart2.setOption(option3);
          index.value++;
        } else {
          myChart2.setOption(option4);
          index.value = 1;
        }
      }, 2000)
}
onMounted(async () => {
  myChart1 = echarts.init(chart1.value);
  myChart2 = echarts.init(chart2.value);
  myChart1.setOption(option1);
  myChart2.setOption(option1);
  await getNodesAndLinks()
  await getNodes2();
  await getNodes3();
  await getNodes4();
  option2 = {
    series: [{data: nodes2.value, categories: getcategories(nodes2)}],
    legend: getLegend(nodes2),
  }
  console.log(option2)
  option3 = {
    series: [{data: nodes3.value, categories: getcategories(nodes3)}],
    legend: getLegend(nodes3)
  }
  option4 = {
    series: [{data: nodes4.value, categories: getcategories(nodes4)}],
    legend: getLegend(nodes4)
  }
  startTimer();
})
const stopTimer = () => {
  clearInterval(interval);
}

</script>

<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span style="margin-right: 10px">初始企业联盟状态</span>
            <el-date-picker
                v-model="date"
                type="date"
                placeholder="请选择日期"
                size="default"
            />
          </template>
          <div ref="chart1" style="width: 100%; height:700px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span style="line-height: 30px">后续{{ index }}天企业联盟状态变化</span>
          </template>
          <div ref="chart2" style="width: 100%; height:700px" @mouseenter="stopTimer" @mouseleave="startTimer"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">


</style>