<script setup>
import {onMounted, ref} from 'vue';
import * as echarts from "echarts";
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";

const multiChart = ref(null);
const lb = 20;
const lt = 50;
const width = 1300;
const height = 130;
const layers1 = 30;
const rb = lb + width;
const rt = lt + width;
const layere1 = layers1 + height;
const gap = 30;
const layers2 = layere1 + gap;
const layere2 = layers2 + height;
const layers3 = layere2 + gap;
const layere3 = layers3 + height;


let baseOption = {
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',

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
let multiChartInstance = null;
const allocateSpace = (nodes) => {
  let choose = [];
  nodes.forEach(node => {
    while (true) {
      const randomPos = Math.floor(Math.random() * 45) + 1;
      if (choose.indexOf(randomPos) === -1) {
        choose.push(randomPos);

        // 每一份大小40*50，起点为（50,30)，一共45份，分布为3行，每行15份
        const row = Math.floor((randomPos - 1) / 15); // 计算行数
        const column = (randomPos - 1) % 15; // 计算列数

        const offsetX = column * 60 + 80; // x 坐标偏移量，增加每列之间的空隙
        node.x = column * 50  + offsetX;
        node.y = 30 + Math.floor((randomPos - 1) / 15) * 40 + 30;
        // 调整上方第一个区域的节点向上移动
        if (row === 0) {
          node.y -= 15; // 调整向上的偏移量
        }
        // 调整下方最后一个区域的节点向下移动
        if (row === 2) {
          node.y += 15; // 调整向下的偏移量
        }
        break;
      }
    }
  })
}


const drawRelationShip = async () => {
  const nodes = await request({
    url: '/income/manage/getAllNode',
    method: 'get'
  });
  const links = await request({
    url: '/income/manage/getAllLink',
    method: 'get'
  });

  //将node和link的字段名进行转换，以符合echarts的要求
  nodes.forEach((node) => {
    node.id = node.locationId  //节点id(必须有一个id字段，用于画图)
    node.symbolSize = 30;
  })
    links.forEach((link) => {
    link.source = link.sourceLocation
    link.target = link.targetLocation
  })

  //随机化节点的位置 
  const node_l1 = nodes.filter(node => node.layerRelation=== 1);
  const node_l2 = nodes.filter(node => node.layerRelation=== 2);
  const node_l3 = nodes.filter(node => node.layerRelation === 3);
  allocateSpace(node_l1);
  allocateSpace(node_l2);
  allocateSpace(node_l3);
  //根据层对节点的y值进行校正
  node_l2.forEach(node => {
    node.y += 230;
  });
  node_l3.forEach(node => {
    node.y += 450;
  });
  let node_all = node_l1.concat(node_l2).concat(node_l3);


  const relationOption = {
    tooltip: {
      show: true,
      trigger: "item",
      formatter: function (params) {
        if (params.dataType === "node") {
          var locationId = params.locationId;
          var companyId = params.data.companyId;
          var name = params.name;
          var field = params.data.field;
          var layerId = params.data.layerId;
          var chainName;
          if (layerId == 1) chainName = "洗衣机产业链";
          else if (layerId == 2) chainName = "空调产业链";
          else if (layerId== 3) chainName = "汽车产业链";
          else chainName = "冰箱产业链";
          return (
            "企业ID: " +
            companyId +
            "<br/>" +
            "企业：" +
            name +
            "<br/>" +
            "所处领域：" +
            field +
            "<br/>" +
            "所处产业链: " +
            chainName +
            "<br/>"
          );
        } else if (params.dataType === "edge") {
          var layer = params.data.layerRelation;
          var relation;
          if (layer == 1) relation = "竞争关系";
          else if (layer == 2) relation = "供应关系";
          else if (layer== 3) relation = "合作关系";
          else relation = "同一企业";
          return (
            "连接关系：" +
            relation
          );
        }
      },
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
        links: links,
        roam: false,
        categories: [
          {
          name: '竞争关系',
          itemStyle: {
            color: 'red', 
          },
        },
        {
          name: '供应关系',
          itemStyle: {
            color: 'blue', 
          },
        },
        {
          name: '合作关系',
          itemStyle: {
            color: 'green', 
          },
        }],

        label: {
          show: true, //是否显示节点标签
          formatter: "{b}", //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
          textStyle: {
            color: "black", // 设置节点标签的字体颜色
          },
        },
        lineStyle: {
          color: 'source',
          width: 2.5,
          curveness: 0.1
        },
        
        emphasis: {
          focus: "adjacency", //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
          lineStyle: {
            width: 10,
            type: "dotted",
            opacity: 0.7,
          },
        },
      },
    ],

    legend: [
      {
        left: "60px",
        padding: [10, 100, 0, 0],
        textStyle: {
          color: "black", // 设置图例字体颜色
        },
      },
    ],

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
onMounted(() => {
  multiChartInstance = echarts.init(multiChart.value);
  multiChartInstance.setOption(baseOption);
  drawRelationShip();
})
</script>

<template>
  <div class="relationChart" ref="multiChart">
  </div>
</template>

<style scoped lang="scss">
.relationChart {
  width: 1500px;
  height: 500px;
}
</style>