<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container">
        <div class="flex-container">
          <span class="header-text">评估企业：</span>
          <el-select
            v-model="selectedId"
            class="m-2"
            placeholder="请选择企业"
            size="large"
            filterable
          >
            <el-option
              v-for="item in allCompanyName"
              :key="item.companyId"
              :label="item.name"
              :value="item.companyId"
            />
          </el-select>
        </div>

        <el-button
          type="success"
          plain
          style="margin-left: 50px"
          @click="handleGraph()"
          >查看关联企业图</el-button
        >
      </el-header>
      <el-container>
        <!-- <el-main>
          <span class="content-text">企业关系图：</span>
          <div id="legend" class="legend">
            <div class="legend-item">
              <div class="color-box" style="background-color: grey"></div>
              竞争关系
            </div>
            <div class="legend-item">
              <div class="color-box" style="background-color: orange"></div>
              供应关系
            </div>
            <div class="legend-item">
              <div class="color-box" style="background-color: lightgreen"></div>
              合作关系
            </div>
          </div>
          <div ref="relationGraph" style="height: 650px; width: 500px"></div>
        </el-main> -->

        <el-main>
          <div style="margin-bottom: 30px">
            <span class="content-text">关联企业：</span>
          </div>
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <el-table
              :data="currentPageData"
              style="width: 88%; height: 600px; margin-bottom: 20px"
              highlight-current-row
              :header-cell-style="{ height: '60px' }"
              :row-style="{ textAlign: 'center', height: '70px' }"
              class="my-table"
            >
              <el-table-column
                fixed
                type="index"
                :index="indexMethod"
                label="序号"
                :min-width="7"
                align="center"
              />
              <el-table-column
                prop="companyId"
                label="企业ID"
                :min-width="8"
                align="center"
              />
              <el-table-column
                prop="name"
                label="企业名称"
                :min-width="15"
                align="center"
              />
              <el-table-column
                prop="field"
                label="所处领域"
                :min-width="15"
                align="center"
              />
              <el-table-column
                prop="category"
                label="所处产业链"
                :min-width="15"
                align="center"
              />
              <el-table-column :min-width="20" align="center">
                <template #header>
                  <div style="text-align: center">关联关系</div>
                </template>
                <template #default="scope">
                  <el-tag type="warning" v-if="scope.row.isSupply === 1"
                    >供应关系</el-tag
                  >
                  <el-tag type="success" v-if="scope.row.isCooperation === 1"
                    >合作关系</el-tag
                  >
                  <el-tag type="info" v-if="scope.row.isCompetition === 1"
                    >竞争关系</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="totalRelation"
                label="关联强度"
                align="center"
                :min-width="10"
              />
              <el-table-column
                prop="infomation"
                label="企业详情"
                :min-width="13"
                align="center"
              >
                <template #default="scope">
                  <el-button link type="primary" @click="handleInfo(scope.row)"
                    >查看详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div
            style="display: flex; justify-content: flex-end; margin-right: 6%"
          >
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[6, 8]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalItems"
            ></el-pagination>
          </div>

          <el-dialog
            v-model="infoDialogVisible"
            title="企业详情"
            align-center
            class="info_content"
          >
            <el-form :model="info">
              <el-form-item label="" :label-width="formLabelWidth">
                企业名称：{{ info.name }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                企业市场份额：{{ info.marketShare }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                企业市场增长率：{{ info.marketIncrease }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                库存周转率：{{ info.turnover }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                准时交付率：{{ info.deliveryRate }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                盈利率：{{ info.earningsRate }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                平均收益回报率：{{ info.averageRoi }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                企业负债（万元）：{{ info.liability }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                企业所有者收益（万元）：{{ info.ownerEquity }}
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog
            v-model="graphDialogVisible"
            title="关联企业图"
            align-center
            :width="graphLabelWidth"
            :height="graphLabelHeight"
          >
            <div class="text-container">
              <div id="legend" class="legend">
                <div class="legend-item">
                  <div
                    class="color-box"
                    style="background-color: lightgreen"
                  ></div>
                  合作关系
                </div>
                <div class="legend-item">
                  <div class="color-box" style="background-color: orange"></div>
                  供应关系
                </div>
                <div class="legend-item">
                  <div class="color-box" style="background-color: grey"></div>
                  竞争关系
                </div>
              </div>
            </div>
            <div
              id="multiChartId"
              ref="multiChart"
              style="height: 600px; width: 1350px"
            ></div>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
  
  
<script setup>
import {
  ref,
  toRefs,
  reactive,
  computed,
  watch,
  onMounted,
  nextTick,
} from "vue";
import * as echarts from "echarts"; //引入echarts
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getAllCompany,
  getCompanyById,
  getRelatedCompany,
  getAllNode,
  getAllLink,
} from "@/api/income/manage.js";
import { componentSizeMap } from "element-plus";

// 初始化ECharts实例
const myChart = ref(null);
const relationGraph = ref(null);
const initGraphNode = reactive([]);
const initGraphLink = reactive([]);
const relatedNode = reactive([]);
const relatedLink = reactive([]);

const emits = defineEmits(["onSelectedCompanyInfo", "onRelatedList"]); //定义组件的自定义事件
const allCompanyName = reactive([]); //下拉框数据(所有企业id和名称)
const selectedId = ref(""); //用户选择的企业id
const selectedCompanyInfo = reactive({}); //用户选择的企业所有收益信息
const relatedCompanyList = reactive([]); //用户选择的节点的关联企业列表

const myChart1 = ref(null);
const multiChart = ref(null);

onMounted(async () => {
  // 调用API接口，获取所有的企业id和名称
  getAllCompany()
    .then((response) => {
      response.forEach((item) => {
        allCompanyName.push({
          companyId: item.companyId,
          name: item.name,
        });
      });
    })
    .catch((error) => {
      console.error("API请求失败", error);
    });

  // 调用API接口，获取关系图中所有连接
  getAllLink()
    .then((response) => {
      response.forEach((item) => {
        initGraphLink.push({
          source: item.sourceLocation,
          target: item.targetLocation,
          relation: item.relation,
          strength: item.strength,
        });
      });
      // 使用 JSON 方法进行深拷贝
      relatedLink.value = JSON.parse(JSON.stringify(initGraphLink));
    })
    .catch((error) => {
      console.error("API请求失败", error);
    });

  //初始化图表
  relationGraph.value && (myChart.value = echarts.init(relationGraph.value));
  const points = [
    {
      layer: 1,
      points: [
        [lt, layers1],
        [rt, layers1],
        [rb, layere1],
        [lb, layere1],
      ],
    },
    {
      layer: 2,
      points: [
        [lt, layers2],
        [rt, layers2],
        [rb, layere2],
        [lb, layere2],
      ],
    },
    {
      layer: 3,
      points: [
        [lt, layers3],
        [rt, layers3],
        [rb, layere3],
        [lb, layere3],
      ],
    },
  ];
  const jsonPoints = JSON.stringify(points); //平行四边形的坐标（json格式传给后端）

  // 调用API接口，获取关系图中所有企业
  getAllNode(jsonPoints)
    .then((response) => {
      response.forEach((item) => {
        initGraphNode.push({
          locationId: item.locationId,
          companyId: item.companyId,
          name: item.name,
          field: item.field,
          category: item.category,
          layer: item.layer,
          locationX: item.locationX,
          locationY: item.locationY,
          isSelected: false,
        });
      });
      //使用 JSON 方法进行深拷贝
      relatedNode.value = JSON.parse(JSON.stringify(initGraphNode));
    })
    .catch((error) => {
      console.error("API请求失败", error);
    });
});

// 定义格式化函数
function formatPercentage(rate) {
  return `${rate * 100}%`;
}

//选择评估企业
watch([selectedId], async () => {
  if (!selectedId.value) {
    relatedCompanyList.value = [];
    totalItems.value = 0;
    return;
  }

  try {
    // 调用API接口，根据id查询企业信息
    const companyInfo = await getCompanyById(selectedId.value);
    Object.assign(selectedCompanyInfo, companyInfo);

    // 调用API接口，根据用户选择的id去查找关联企业信息
    const relatedCompanies = await getRelatedCompany(selectedId.value);
    relatedCompanyList.splice(0);
    relatedCompanies.forEach((item) => {
      relatedCompanyList.push({
        companyId: item.companyId,
        name: item.name,
        field: item.field,
        category: item.category,
        marketShare: formatPercentage(item.marketShare),
        marketIncrease: formatPercentage(item.marketIncrease),
        turnover: formatPercentage(item.turnover),
        deliveryRate: formatPercentage(item.deliveryRate),
        earningsRate: formatPercentage(item.earningsRate),
        averageRoi: formatPercentage(item.averageRoi),
        liability: item.liability,
        ownerEquity: item.ownerEquity,
        isSupply: item.isSupply,
        isCooperation: item.isCooperation,
        isCompetition: item.isCompetition,
        totalRelation: item.totalRelation,
        analysis: item.analysis,
      });
    });
    totalItems.value = relatedCompanyList.length;

    // relatedNode.value = relatedNode.value.filter(node => {
    //     return (
    //         relatedCompanyList.some(item => item.companyId === node.companyId) ||
    //         node.companyId === selectedCompanyInfo.companyId
    //     );
    // });

    // 遍历initGraphNode数组，找到与selectedCompanyId匹配的企业
    relatedNode.value.forEach((node) => {
      if (node.companyId === selectedCompanyInfo.companyId) {
        node.isSelected = true;
      }
    });
    // // 绘制关系图
    // drawGraph(relatedNode, relatedLink);

    // 重置节点信息
    relatedNode.value = JSON.parse(JSON.stringify(initGraphNode));
    // // 重置连接信息
    // relatedLink.value = JSON.parse(JSON.stringify(initGraphLink));

    // 将节点信息和连接信息直接同步传递给父组件
    emits("onSelectedCompanyInfo", selectedCompanyInfo); //用户选择的企业
    emits("onRelatedList", relatedCompanyList); //关联企业列表
  } catch (error) {
    console.error("操作失败", error);
  }
});

//数据分页
const currentPage = ref(1); // 当前页码
const pageSize = ref(8); // 每页显示的条数
const totalItems = ref(0); // 总条数
const currentPageData = computed(() => {
  // 根据当前页码和每页显示的条数计算当前页的数据
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  if (relatedCompanyList.length === 0) return (relatedCompanyList.value = []);
  return relatedCompanyList.slice(startIndex, endIndex);
});
function handleSizeChange(size) {
  // 每页显示的条数发生变化时，更新pageSize，并重新计算当前页的数据
  pageSize.value = size;
  currentPage.value = 1; // 将当前页重置为第一页
}
function handleCurrentChange(newPage) {
  // 当前页码发生变化时，更新currentPage，并重新计算当前页的数据
  currentPage.value = newPage;
}
//分页之后数据的序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};

//"查看详情"功能
const infoDialogVisible = ref(false);
const formLabelWidth = "140px";
let info = ref({
  name: "",
  marketShare: "",
  marketIncrease: "",
  turnover: "",
  deliveryRate: "",
  earningsRate: "",
  averageRoi: "",
  liability: "",
  ownerEquity: "",
});
const handleInfo = (row) => {
  infoDialogVisible.value = true;
  info.value = row;
};

//企业关系图弹窗
const lb = 0;
const lt = 150;
const width = 1150;
const height = 150;
const layers1 = 30;
const layere1 = layers1 + height;
const rb = lb + width;
const rt = lt + width;
const gap = 50;
const layers2 = layere1 + gap;
const layere2 = layers2 + height;
const layers3 = layere2 + gap;
const layere3 = layers3 + height;
const graphDialogVisible = ref(false);
const graphLabelWidth = "1350px";
const graphLabelHeight = "600px";
let option1 = {
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
        fill: "#fff",
        stroke: "red",
        lineWidth: 3,
        opacity: 0.3, //透明度
        shadowBlur: 10, //边框阴影模糊程度
        shadowColor: "grey", //边框阴影颜色
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
        fill: "#fff",
        stroke: "blue",
        lineWidth: 3,
        opacity: 0.3,
        shadowBlur: 10,
        shadowColor: "grey",
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
        fill: "#fff",
        stroke: "green",
        lineWidth: 3,
        opacity: 0.3,
        shadowBlur: 10,
        shadowColor: "grey",
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      },
    },
  ],
};
const dynamicLoading = (relatedNode, selectedCompanyInfo, relatedLink) => {
  relatedNode.value.forEach((node) => {
    if (node.companyId === selectedCompanyInfo.companyId) {
      node.isSelected = true;
    }
  });
  option1.series = [
    {
      type: "graph",
      layout: "none", // 可以设置布局方式
      data: relatedNode.value.map((node) => ({
        id: node.locationId,
        companyId: node.companyId,
        name: node.name,
        field: node.field,
        category: node.category,
        layer: node.layer,
        x: node.locationX,
        y: node.locationY,
        isSelected: node.isSelected,
        symbolSize: 20,
        label: {
          show: true, //是否显示节点标签
          formatter: `${node.companyId}`, //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
        },
      })),
      links: relatedLink.value.map((link) => ({
        source: link.source,
        target: link.target,
        relation: link.relation,
        strength: link.strength,
        lineStyle: {
          normal: {
            width: 2, // 设置线条粗细
            curveness: 0.15, // 设置线条弯曲程度
            color: (() => {
              // 根据关系类型设置颜色
              if (link.relation === "供应关系") {
                return "orange";
              } else if (link.relation === "合作关系") {
                return "lightgreen";
              } else if (link.relation === "竞争关系") {
                return "grey";
              }
            })(),
          },
        },
        label: {
          show: false, // 显示连线标签
          formatter: "{c}", // 连线标签的内容格式器，{c} 代表关系强度
        },
      })),
      roam: true, //开启鼠标缩放和平移漫游
      left: "center",
      top: "center",
      itemStyle: {
        //设置节点颜色
        normal: {
          color: function (params) {
            if (params.data.isSelected) return "Crimson";
            else return "RoyalBlue";
          },
        },
      },
      emphasis: {
        focus: "adjacency", // 当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {
          width: 5,
          type: "dotted",
          opacity: 0.7,
        },
      },
    },
  ];
  option1.tooltip= {
        show: true,
        trigger: "item",
        formatter: function (params) {
          if (params.dataType === "node") {
            const nodeData = params.data;
            return "企业ID: " + nodeData.companyId + '<br/>' + "企业名称：" + nodeData.name + '<br/>' + "所处领域：" + nodeData.field + '<br/>' + "所处产业链：" + nodeData.category;
          }
          // else if (params.dataType === "edge") {
          // }
        },
      },
  myChart1.value.setOption(option1);
};
const initGraph = () => {
  multiChart.value && (myChart1.value = echarts.init(multiChart.value));
  myChart1.value.setOption(option1);
};
const handleGraph = () => {
  if (selectedId.value === "") {
    ElMessage({
      type: "error",
      message: "请先选择收益评估的企业！",
      duration: 3000,
    });
  } else {
    graphDialogVisible.value = true;
    nextTick(() => {
      initGraph();
      myChart1.value.setOption(option1);
      dynamicLoading(relatedNode, selectedCompanyInfo, relatedLink);
    });
  }
};

// // 绘制关系图的函数
// function drawGraph(relatedNode, relatedLink) {
//   const width = 500; // 指定的宽度
//   const height = 650; // 指定的高度
//   const spacing = 50; // 定义固定的间距
//   const polygonWidth = width - spacing * 2;
//   const polygonHeight = (height - spacing * 4) / 3;
//   const polygons = [
//     {
//       points: [
//         [spacing, spacing],
//         [spacing + polygonWidth, spacing],
//         [spacing + polygonWidth, spacing + polygonHeight],
//         [spacing, spacing + polygonHeight],
//       ],
//     },
//     {
//       points: [
//         [spacing, spacing + polygonHeight + spacing],
//         [spacing + polygonWidth, spacing + polygonHeight + spacing],
//         [spacing + polygonWidth, spacing + 2 * polygonHeight + spacing],
//         [spacing, spacing + 2 * polygonHeight + spacing],
//       ],
//     },
//     {
//       points: [
//         [spacing, spacing + 2 * polygonHeight + 2 * spacing],
//         [spacing + polygonWidth, spacing + 2 * polygonHeight + 2 * spacing],
//         [spacing + polygonWidth, spacing + 3 * polygonHeight + 2 * spacing],
//         [spacing, spacing + 3 * polygonHeight + 2 * spacing],
//       ],
//     },
//   ];
//   function getRandomCoordinates(polygon, spacing) {
//     const minX = Math.min(
//       polygon.points[0][0],
//       polygon.points[1][0],
//       polygon.points[2][0],
//       polygon.points[3][0]
//     );
//     const maxX = Math.max(
//       polygon.points[0][0],
//       polygon.points[1][0],
//       polygon.points[2][0],
//       polygon.points[3][0]
//     );
//     const minY = Math.min(
//       polygon.points[0][1],
//       polygon.points[1][1],
//       polygon.points[2][1],
//       polygon.points[3][1]
//     );
//     const maxY = Math.max(
//       polygon.points[0][1],
//       polygon.points[1][1],
//       polygon.points[2][1],
//       polygon.points[3][1]
//     );
//     let randomPoint = getRandomPoint(minX, maxX, minY, maxY, spacing);
//     while (
//       !isPointInsidePolygon(randomPoint[0], randomPoint[1], polygon.points)
//     ) {
//       randomPoint = getRandomPoint(minX, maxX, minY, maxY, spacing);
//     }
//     return randomPoint;
//   }

//   // 生成随机坐标点
//   function getRandomPoint(minX, maxX, minY, maxY, spacing) {
//     const x =
//       Math.floor((Math.random() * (maxX - minX)) / spacing) * spacing + minX;
//     const y =
//       Math.floor((Math.random() * (maxY - minY)) / spacing) * spacing + minY;
//     return [x, y];
//   }
//   // 检查点是否在多边形内部
//   function isPointInsidePolygon(x, y, polygonPoints) {
//     let inside = false;
//     for (
//       let i = 0, j = polygonPoints.length - 1;
//       i < polygonPoints.length;
//       j = i++
//     ) {
//       const xi = polygonPoints[i][0];
//       const yi = polygonPoints[i][1];
//       const xj = polygonPoints[j][0];
//       const yj = polygonPoints[j][1];

//       const intersect =
//         yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
//       if (intersect) {
//         inside = !inside;
//       }
//     }
//     return inside;
//   }

//   // 添加节点信息
//   function placeNodesInPolygons(nodes, polygons, spacing) {
//     const placedNodes = [];
//     const occupiedPoints = new Set();
//     // 遍历节点
//     for (const node of nodes) {
//       const { layer } = node;
//       // 根据节点的 layer 找到对应的多边形
//       const polygon = polygons[layer - 1];
//       // 生成随机坐标并将节点放置到多边形中
//       let [x, y] = getRandomCoordinates(polygon, spacing);
//       // 检查是否有节点占据该坐标点，如果有，则重新选择坐标
//       while (occupiedPoints.has(`${x},${y}`)) {
//         [x, y] = getRandomCoordinates(polygon, spacing);
//       }
//       node.x = x;
//       node.y = y;
//       placedNodes.push(node);
//       // 将占据的坐标点添加到集合中
//       for (let i = x - spacing / 2; i <= x + spacing / 2; i++) {
//         for (let j = y - spacing / 2; j <= y + spacing / 2; j++) {
//           occupiedPoints.add(`${i},${j}`);
//         }
//       }
//     }
//     return placedNodes;
//   }

//   // 调用函数，获取关系图节点信息
//   const placedNodes = placeNodesInPolygons(
//     relatedNode.value,
//     polygons,
//     spacing
//   );
//   //绘制图形
//   const option = {
//     animationDuration: 1000, //初始动画的时长
//     animationEasingUpdate: "quinticInOut", //节点和边的动画方式（缓动函数）
//     graphic: polygons.map((polygon, index) => ({
//       type: "polygon",
//       shape: {
//         points: polygon.points,
//       },
//       style: {
//         stroke: index === 0 ? "red" : index === 1 ? "blue" : "green",
//         fill: "#eee",
//         lineWidth: 3,
//         opacity: 0.3,
//         shadowBlur: 10,
//         shadowColor: "black",
//         shadowOffsetX: 5,
//         shadowOffsetY: 5,
//       },
//     })),
//     series: [
//       {
//         type: "graph",
//         layout: "none", // 可以设置布局方式
//         data: placedNodes.map((node) => ({
//           id: node.locationId,
//           companyId: node.companyId,
//           name: node.name,
//           field: node.field,
//           category: node.category,
//           layer: node.layer,
//           x: node.x,
//           y: node.y,
//           isSelected: node.isSelected,
//           symbolSize: 15,
//           label: {
//             show: true, //是否显示节点标签
//             formatter: `${node.companyId}`, //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
//           },
//         })),

//         links: relatedLink.value.map((link) => ({
//           source: link.source,
//           target: link.target,
//           relation: link.relation,
//           strength: link.strength,
//           lineStyle: {
//             normal: {
//               width: 2, // 设置线条粗细
//               curveness: 0.2, // 设置线条弯曲程度
//               color: (() => {
//                 // 根据关系类型设置颜色
//                 if (link.relation === "供应关系") {
//                   return "orange";
//                 } else if (link.relation === "合作关系") {
//                   return "lightgreen";
//                 } else if (link.relation === "竞争关系") {
//                   return "grey";
//                 }
//               })(),
//             },
//           },
//           label: {
//             show: false, // 显示连线标签
//             formatter: "{c}", // 连线标签的内容格式器，{c} 代表关系强度
//           },
//         })),
//         roam: true, //开启鼠标缩放和平移漫游
//         left: "center",
//         top: "center",
//         itemStyle: {
//           //设置节点颜色
//           normal: {
//             color: function (params) {
//               if (params.data.isSelected) return "Crimson";
//               else return "RoyalBlue";
//             },
//           },
//         },
//         emphasis: {
//           focus: "adjacency", // 当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
//           label: {
//             show: true, // 鼠标移动到节点上时显示节点标签
//             formatter: function (params) {
//               // 自定义节点标签的内容格式器，params.data 代表节点数据
//               const nodeData = params.data;
//               return `{a|公司id: ${nodeData.companyId}\n名称: ${nodeData.name}\n领域: ${nodeData.field}\n产业链: ${nodeData.category}}`;
//             },
//             rich: {
//               a: {
//                 align: "left", // 左对齐
//                 padding: [6, 8], // 内边距，上下各为6，左右各为8
//                 backgroundColor: "rgba(0, 0, 0, 0.7)", // 透明框的背景颜色
//                 borderRadius: 4, // 边框圆角
//                 lineHeight: 20, // 行高
//                 color: "#fff", // 字体颜色
//               },
//             },
//           },
//           lineStyle: {
//             // 边的设置
//             width: 5,
//             type: "dotted",
//             opacity: 0.7,
//           },
//         },
//       },
//     ],
//   };

//   nextTick(() => {
//     myChart.value.setOption(option);
//   });
// }
</script>

<style>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-container {
  display: flex;
  align-items: center;
}
.header-text {
  margin-right: 10px;
  font-weight: bold;
}
.content-text {
  margin-right: 10px;
  margin-bottom: 10px;
  font-weight: bold;
}
.my-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.text-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.legend {
  padding-left: 100px;
  padding-top: 10px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.color-box {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}

/* 查看详情 */
.info_content {
  width: 26%;
  height: 55%;
}

/* 关联企业图 */
.dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.parallelogram-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.parallelogram {
  background-color: rgba(0, 0, 0, 0.1);
  transform-origin: top left;
  margin: 10px;
}
.spacer {
  height: 20px;
}
</style>