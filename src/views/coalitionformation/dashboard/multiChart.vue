<script setup>
import {onMounted, ref, watch} from "vue";
import request from "@/utils/request";
import * as echarts from "echarts";

const multiChart = ref(null);
const lb = 0;
const lt = 50;
const width = 800;
const height = 120;
const layers1 = 30;
const layere1 = layers1 + height;
const rb = lb + width;
const rt = lt + width;
const gap = 50;
const layers2 = layere1 + gap;
const layere2 = layers2 + height;
const layers3 = layere2 + gap;
const layere3 = layers3 + height;
let myChart = null;
let nodes = ref([]);
let links = ref([]);
let option = {
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  title: {
    text: '企业多重网络关系图',
    subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  graphic: [
    {
      type: 'polygon',
      shape: {
        points: [[lt, layers1], [rt, layers1], [rb, layere1], [lb, layere1]]
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
        points: [[lt, layers2], [rt, layers2], [rb, layere2], [lb, layere2]]
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
        points: [[lt, layers3], [rt, layers3], [rb, layere3], [lb, layere3]]
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

const props = defineProps(['isloading']);
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

const getLinks = async () => {
  const res = await request.get("/graph/getlinks");
  links.value = res;
};
const dynamicLoading = async () => {
  await getLinks();
  await getNodes();
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
  const categories = cateList.map(item => {
    return {
      name: item === 0 ? "空闲" : "联盟" + item
    }
  })
  const legend = {
    data: categories.map(item => item.name),
    left: 0,
    top: 0
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
  let newOption = {
    series,
    tooltip,
    legend
  }
  myChart.setOption(newOption);
}

watch(() => props.isloading, (newVal, oldVal) => {
  if (newVal) {
    dynamicLoading();
  }
});
onMounted(() => {
  myChart = echarts.init(multiChart.value);
  myChart.setOption(option);
  dynamicLoading();
});
</script>

<template>
  <div ref="multiChart" class="multi"></div>
</template>

<style scoped lang="scss">
.multi {
  height: 500px;
  width: 100%
}
</style>