<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue';
import * as echarts from "echarts";
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";

const {proxy} = getCurrentInstance();
const {  chain_stage } = proxy.useDict('chain_stage');
let companyStage = ref("原料供应");
const multiChart = ref(null);


const handleStageChange=()=>{
  drawRelationShip()
}

let multiChartInstance = null;
const allocateSpace = (nodes) => {
  let choose = [];
  nodes.forEach(node => {
    while (true) {
      const randomPos = Math.floor(Math.random() * 45) + 1;
      if (choose.indexOf(randomPos) === -1) {
        choose.push(randomPos);
        //每一份大小40*50，起点为（50,30),一共45份，分布为3行，每行15份
        // node.x = 50 + ((randomPos - 1) % 15) * 50 + 25;
        // node.y = 30 + Math.floor((randomPos - 1) / 15) * 40 + 20;

        //每一份大小50*50，起点为（50,100),一共45份，分布为3行，每行15份
        node.x = 50 + ((randomPos - 1) % 15) * 50 + 25;
        node.y = 100 + Math.floor((randomPos - 1) / 15) * 50 + 25;
        break;
      }
    }
  })
}
let width = 860;

const drawRelationShip = async () => {
  let type=companyStage.value==="原料供应"?1:companyStage.value
  const nodes = await request({
    url: '/graph/getnodes',
    method: 'get',
    params:{
      companyType:type
    }
  });
  const links = await request({
    url: '/graph/getedges',
    method: 'get',
    params:{
      linkType:type
    }
  });
  links.forEach((link) => {
    link.source = link.source + " " + link.layer;
    link.target = link.target + " " + link.layer;
  });
  nodes.forEach((node) => {
    if (node.layer_id != 3) {
      let temp = nodes.filter(item => {
        return item.id === node.id && item.layer_id > node.layer_id;
      })
      if (temp.length > 0) {
        links.push({
          source: node.id + " " + node.layer_id,
          target: temp[0].id + " " + temp[0].layer_id,
          lineStyle: {
            width: 4,
            curveness: 0.2,
            type: 'dotted'
          },
        })
      }
    }
  });
  nodes.forEach((node) => {
    node.id = node.id + " " + node.layer_id;
    node.symbolSize = node.value * 30;
    node.category = node.layer_id - 1;
  })
  let node_l1 = nodes.filter(node => node.layer_id === 1);
  const node_l2 = nodes.filter(node => node.layer_id === 2);
  const node_l3 = nodes.filter(node => node.layer_id === 3);
  allocateSpace(node_l1);
  allocateSpace(node_l2);
  allocateSpace(node_l3);
  // 根据层对节点的y值进行校正
  node_l2.forEach(node => {
    node.y += 190;
  });
  node_l3.forEach(node => {
    node.y += 380;
  });
  let node_all = node_l1.concat(node_l2).concat(node_l3);
  const relationOption = {
    tooltip: {
      formatter: function (params) {
        let cid=params.data.id?.split(" ")[0];
        return "企业编号:"+cid+"</br>"+
            "企业名称:"+params.data.name;
      }
    },
    legend: {
      left: 0,
      top: 0
    },
    series: [
      {
        name: '企业多重网络关系',
        type: 'graph',
        layout: 'none',
        data: node_all,
        categories: [
          {
            name: '洗衣机产业链'
          },
          {
            name: '空调产业链'
          },
          {
            name: '汽车产业链'
          }
        ],
        // coordinateSystem: 'none',
        links: links,
        roam: false,
        lineStyle: {
          color: 'source',
          width: 2.5,
          curveness: 0.1
        },
        emphasis: {
          focus: 'adjacency',
        },
        // edgeLabel: {
        //   show: true,
        //   formatter: function (params) {
        //     return params.data.weight; // 显示边的权重
        //   }
        // }
      },
    ]
  }
  multiChartInstance.setOption(relationOption);
}
const loadingStore = useLoadingStore()
watch(() => loadingStore.isloading, (newval) => {
  if (newval) {
    drawRelationShip();
    loadingStore.isloading = false;
  }
})

let name_title = "多重产业链网络企业关系图";

const initChart=()=>{
  const lb = 0;
  const lt = 30;
  const height = 120;
  const layers1 = 30;
  // console.log(multiChart.value.getBoundingRect().width)
  let domwidth=multiChart.value.offsetWidth;
  if(domwidth<=900)
    width=domwidth-40
  const rb = lb + width;
  const rt = lt + width;
  const layere1 = layers1 + height;
  const gap = 50;
  const layers2 = layere1 + gap;
  const layere2 = layers2 + height;
  const layers3 = layere2 + gap;
  const layere3 = layers3 + height;
  let baseOption = {
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
  multiChartInstance.setOption(baseOption);
}

onMounted(() => {
  multiChartInstance = echarts.init(multiChart.value);
  initChart();
  drawRelationShip();
})
</script>

<template>
  <el-card shadow="hover">
    <div style="margin-bottom: 10px">
      <span style="margin-right: 10px;font-size: 16px">当前阶段:</span>
      <el-select v-model="companyStage" placeholder="请选择企业类型"  @change="handleStageChange" style="width: 120px;">
        <el-option
            v-for="dict in chain_stage"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
        />
      </el-select>
      <span style="font-weight: 800;font-size: 18px;margin-left: 150px">{{name_title}}</span>
    </div>
    <div class="relationChart" ref="multiChart">
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.relationChart {
  width: 100%;
  height: 500px;
}
</style>