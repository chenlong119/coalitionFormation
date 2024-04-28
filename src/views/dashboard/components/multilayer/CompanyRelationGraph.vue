<script setup>
import { onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";

const multiChart = ref(null);
let width = 0;
let height = 0;

let multiChartInstance = null;

const loadingStore = useLoadingStore();
watch(
  () => loadingStore.isloading,
  (newval) => {
    if (newval) {
      drawRelationShip();
      loadingStore.isloading = false;
    }
  }
);

onMounted(() => {
  multiChartInstance = echarts.init(multiChart.value);

  width = multiChart.value.offsetWidth - 60;
  height = multiChart.value.offsetHeight / 4;
  
  let lb = 20;
  let lt = 50;
  const layers1 = 30;
  const rb = lb + width;
  const rt = lt + width;
  const layere1 = layers1 + height;
  const gap = 40; //矩形间距
  const layers2 = layere1 + gap;
  const layere2 = layers2 + height;
  const layers3 = layere2 + gap;
  const layere3 = layers3 + height;

  let baseOption = {
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    graphic: [
      {
        type: "polygon",
        shape: {
          points: [
            [lt, layers1],
            [rt, layers1],
            [rb, layere1],
            [lb, layere1],
          ],
        },
        style: {
          fill: "#eee",
          stroke: "blue",
          lineWidth: 3,
          opacity: 0.3, //透明度
          shadowBlur: 10, //边框阴影模糊程度
          shadowColor: "black", //边框阴影颜色
          shadowOffsetX: 5, //边框阴影水平偏移量
          shadowOffsetY: 5, //边框阴影垂直偏移量
        },
      },
      {
        type: "polygon",
        shape: {
          points: [
            [lt, layers2],
            [rt, layers2],
            [rb, layere2],
            [lb, layere2],
          ],
        },
        style: {
          fill: "#eee",
          stroke: "green",
          lineWidth: 3,
          opacity: 0.3,
          shadowBlur: 10,
          shadowColor: "black",
          shadowOffsetX: 5,
          shadowOffsetY: 5,
        },
      },
      {
        type: "polygon",
        shape: {
          points: [
            [lt, layers3],
            [rt, layers3],
            [rb, layere3],
            [lb, layere3],
          ],
        },
        style: {
          fill: "#eee",
          stroke: "yellow",
          lineWidth: 3,
          opacity: 0.2,
          shadowBlur: 10,
          shadowColor: "black",
          shadowOffsetX: 5,
          shadowOffsetY: 5,
        },
      },
    ],
  };

  multiChartInstance.setOption(baseOption);

  const allocateSpace = (nodes) => {
    let choose = [];
    nodes.forEach((node) => {
      while (true) {
        const randomPos = Math.floor(Math.random() * 45) + 1;
        if (choose.indexOf(randomPos) === -1) {
          choose.push(randomPos);

          // 每一份大小40*50，起点为（50,30)，一共45份，分布为3行，每行15份
          const row = Math.floor((randomPos - 1) / 15); // 计算行数
          const column = (randomPos - 1) % 15; // 计算列数

          const offsetX = column * 60 + 80; // x 坐标偏移量，增加每列之间的空隙
          node.x = column * 50 + offsetX;
          node.y = Math.floor((randomPos - 1) / 15) * height / 4;
          // 调整上方第一个区域的节点向上移动
          if (row === 0) {
            node.y -= height / 10; 
          }
          // 调整下方最后一个区域的节点向下移动
          if (row === 2) {
            node.y += height / 10; 
          }
          break;
        }
      }
    });
  };

  const drawRelationShip = async () => {
    const nodes = await request({
      url: "/home/getnodes",
      method: "get",
    });
    const links = await request({
      url: "/home/getlinks",
      method: "get",
    });

    nodes.forEach((node) => {
      if (node.layer_id != 3) {
        let temp = nodes.filter((item) => {
          return item.id === node.id && item.layer_id > node.layer_id;
        });
        if (temp.length > 0) {
          links.push({
            source: node.id + " " + node.layer_id,
            target: temp[0].id + " " + temp[0].layer_id,
            lineStyle: {
              width: 4,
              curveness: 0.2,
              type: "dotted",
            },
          });
        }
      }
    });
    nodes.forEach((node) => {
      node.id = node.id + " " + node.layer_id; //节点分层
      node.symbolSize = 30;
      node.category = node.layer_id - 1; //产业链的类别
    });
    const node_l1 = nodes.filter((node) => node.layer_id === 1);
    const node_l2 = nodes.filter((node) => node.layer_id === 2);
    const node_l3 = nodes.filter((node) => node.layer_id === 3);
    allocateSpace(node_l1);
    allocateSpace(node_l2);
    allocateSpace(node_l3);
    //根据层对节点的y值进行校正
    node_l2.forEach((node) => {
      node.y += 1.9*height;
    });
    node_l3.forEach((node) => {
      node.y += 3.8*height;
    });
    let node_all = node_l1.concat(node_l2).concat(node_l3);

    const relationOption = {
      tooltip: {
        show: true,
        trigger: "item",
        formatter: function (params) {
          if (params.dataType === "node") {
            var id = params.data.id;
            var name = params.name;
            var company_type = params.data.company_type;
            var chain_name = params.data.chain_name;
            return (
              "id: " +
              id +
              "<br/>" +
              "企业：" +
              name +
              "<br/>" +
              "所处领域：" +
              company_type +
              "<br/>" +
              "所处产业链: " +
              chain_name +
              "<br/>"
            );
          } else if (params.dataType === "edge") {
            var layer = params.data.layer;
            var relation;
            if (layer == 1) relation = "竞争关系";
            else if (layer == 2) relation = "供应关系";
            else if (layer == 3) relation = "合作关系";
            else relation = "同一企业";
            return "连接关系：" + relation;
          }
        },
      },
      legend: {
        left: 0,
        top: 0,
      },

      series: [
        {
          name: "企业多重网络关系",
          type: "graph",
          layout: "none",
          data: node_all,
          links: links,
          roam: false,
          categories: [
            {
              name: "家电产业链",
            },
            {
              name: "汽车产业链",
            },
            {
              name: "电子产业链",
            },
          ],

          label: {
            show: true, //是否显示节点标签
            formatter: "{b}", //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
            textStyle: {
              color: "white", // 设置节点标签的字体颜色
            },
          },
          lineStyle: {
            color: "source",
            width: 2.5,
            curveness: 0.1,
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
            color: "white", // 设置图例字体颜色为白色
          },
        },
      ],
    };

    multiChartInstance.setOption(relationOption);
  };

  drawRelationShip();
});
</script>

<template>
  <div class="relationChart" ref="multiChart"></div>
</template>

<style scoped lang="scss">
.relationChart {
  width: 100%;
  height: 100%;
}
</style>