<template>
  <!--  <el-button type="success" plain @click="formulaVisible = true" style="margin-bottom: 10px;">模型解读</el-button>-->
  <!--  <el-dialog v-model="formulaVisible" title="多重产业链关联耦合模型解读">-->
  <!--    <el-form label-position="left">-->
  <!--      <el-form-item label="节点含义：" :label-width="'150px'">-->
  <!--        <span>多重产业链上的企业</span>-->
  <!--      </el-form-item>-->
  <!--      <el-form-item label="网络层含义含义：" :label-width="'150px'">-->
  <!--        <span>多重产业链上的企业组成的不同关系网络</span>-->
  <!--      </el-form-item>-->
  <!--      <el-form-item label="垂直边含义：" :label-width="'150px'">-->
  <!--        <span>同一企业在不同关系网络中的映射</span>-->
  <!--      </el-form-item>-->
  <!--      <el-form-item label="不同颜色的节点含义：" :label-width="'180px'">-->
  <!--        <span>企业被划分到不同的企业协作团体</span>-->
  <!--      </el-form-item>-->
  <!--      <el-form-item label="不同颜色的水平边含义：" :label-width="'180px'">-->
  <!--        <span>左边的图中从上往下依次代表着不同的网络关系：合作关系，供应关系，竞争关系；右边的图中代表着整体的关联关系</span>-->
  <!--      </el-form-item>-->
  <!--    </el-form>-->
  <!--  </el-dialog>-->
  <div class="common-layout">
    <div id="main2" ref="chartContainer" class="container"
         style="flex: 1 0 50%;;height:460px;background-color: rgb(255,255,255)"></div>
    <div id="relationChart" ref="relationChart" class="container"
         style="flex: 1 0 50%;;height:460px;background-color: rgb(255,255,255)"></div>

  </div>
  <br>
  <div class="common-layout">

  </div>
  <div class="container-r">
    <div>
      <span
          style="font-size: 14px; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-right: 10px;font-weight: bold;">目标关联企业：</span>
      <el-select v-model="selectedNode" class="m-2" placeholder="请选择企业" size="large" filterable
                 @change="handleSelectChange">
        <el-option v-for="item in companyData" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span
          style="font-size: 14px; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-right: 10px;font-weight: bold;">目标关系网络：</span>
      <el-select v-model="selectedRelation" class="m-2" placeholder="不选则默认是整体关联网络" size="large" filterable
                 @change="handleSelectChange2">
        <el-option v-for="item in relationData" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>
        <el-button type="default" @click="reset">重置</el-button>
      </span>
    </div>
    <el-main>
      <div style="margin-bottom: 15px"><span style="font-size: 14px; font-weight: bold;">耦合关系展现：</span></div>
      <div class="container-t">
        <el-table :data="relatedNodesWithout.value" style="height:250px" border highlight-current-row
                  :header-cell-style="{height: '60px',}" :row-style="{ textAlign: 'center', height: '54px', }"
                  class="my-table custom-table">
          <el-table-column fixed type="index" :index="indexMethod" label="序号" width="100"/>
          <el-table-column prop="id" label="企业id" align="center" width="80px"/>
          <el-table-column prop="name" label="企业名称" align="center"/>
          <el-table-column prop="category" label="所属团体" align="center"/>
          <el-table-column prop="relation1" label="供应强度（0~1）" align="center"/>
          <el-table-column prop="relation2" label="合作强度（0~1）" align="center"/>
          <el-table-column prop="relation3" label="竞争强度（0~1）" align="center"/>
          <el-table-column prop="relation" label="整体关联强度（0~1）" align="center"/>
          <el-table-column prop="information" label="企业信息" width="">
            <template #default="scope">
              <el-button link type="primary" @click="handleInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next"
                     :total="relatedNodesWithout.length" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"/>

      <el-dialog v-model="infoDialogVisible" title="企业详情" align-center>
        <el-form :model="info">
          <el-form-item label="" :label-width="formLabelWidth">
            企业id：{{ info.id }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            企业名称：{{ info.name }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            所属产业链：{{ info.chain }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            所属企业团体：{{ info.category }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            市场份额：{{ (info.marketShare * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            市场增长率：：{{ (info.marketIncrease * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            盈利率：{{ (info.profitability * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            科研投入比例：{{ (info.investRatio * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            产品线宽度：{{ info.productWidth }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            产品线深度：{{ info.productDepth }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            品牌知名度：{{ Math.round(info.brandAwareness * 100) }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            供应商数量：{{ info.suppliersNum }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            库存周转率：{{ (info.turnover * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            准时交付率：：{{ (info.deliveryRate * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            物流水平：{{ (info.tradeLevel * 100).toFixed(1) }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            合作意愿强度：{{ (info.cooperationWillingness * 100).toFixed(1) }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            信誉分：{{ (info.reputation * 100).toFixed(1) }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            参与合作数量：{{ info.cooperationNum }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            合作成功率：{{ (info.cooperationSuccess * 100).toFixed(1) + "%" }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            合作项目平均收益率：{{ (info.averageRoi * 100).toFixed(1) + "%" }}
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-main>
  </div>

</template>


<script setup>
import {onMounted, reactive, ref, watch} from 'vue'
import * as echarts from 'echarts'
//import jsonData from "../../../assets/dataFusion/step3.json"
import {getAllCompanyAndLink, getAllCompanyWithoutLocation, getTotalRelation} from "@/api/datafusion/test";
//定义组件的自定义事件
const nodeData = reactive([]);
const companyData = reactive([]);
const relationData = reactive([]);
const linkData = reactive([]);
getAllCompanyAndLink().then(response => {
  for (const node of response.nodes) {
    nodeData.push({
      id: node.id,
      name: node.name,
      chain: node.chain,
      layer: node.layer,
      category: node.category,
      locationId: node.locationId
    });
  }
})
getTotalRelation().then(response => {
  for (const link of response.links) {
    linkData.push({
      source: link.sourceLocation,
      target: link.targetLocation,
      relation: link.strengthRelation,
      relation1: link.supplyRelation,
      relation2: link.cooperationRelation,
      relation3: link.competitionRelation,
      analysis: link.analysis
    });
  }
})
getAllCompanyWithoutLocation().then(response => {
  for (const node of response.nodes) {
    companyData.push({
      id: node.id,
      name: node.name,
      chain: node.chain,
      category: node.category,
      marketShare: node.marketShare,
      marketIncrease: node.marketIncrease,
      profitability: node.profitability,
      investRatio: node.investRatio,
      productWidth: node.productWidth,
      productDepth: node.productDepth,
      brandAwareness: node.brandAwareness,
      cooperationWillingness: node.cooperationWillingness,
      reputation: node.reputation,
      cooperationNum: node.cooperationNum,
      cooperationSuccess: node.cooperationSuccess,
      averageRoi: node.averageRoi,
      suppliersNum: node.suppliersNum,
      turnover: node.turnover,
      deliveryRate: node.deliveryRate,
      tradeLevel: node.tradeLevel,
    });
  }
})
const formulaVisible = ref(false)
const chartContainer = ref(null);
const relationChart = ref(null);
let myChart;
let myChart2;
// 读取json数据并将其存储到companyData数组和linkData数组中
const emits = defineEmits(['onNodeSelected']);
// for (const node of jsonData.nodes) {
//   companyData.push({
//     id: node.id,
//     name: node.name,
//     chain: node.chain,
//     requirements: node.requirements,
//     products: node.products,
//     field: node.field,
//     numbers: node.numbers,
//     lists: node.lists,
//     category: node.category,
//     frequency: node.frequency,
//   });
// }
relationData.push(
    {
      id: 1,
      name: "竞争关系"
    },
    {
      id: 2,
      name: "供应关系"
    },
    {
      id: 3,
      name: "合作关系"
    }
)

//分页展示，每页展示8个企业
const pageSize = 5
//当前页
let currentPage = ref(1);
// 计算与所选节点相关的所有节点信息和连接信息
const selectedNode = ref("");
const relatedNodes = ref([]);
const selectedRelation = ref("");
const relatedNodesWithout = reactive([]);
const relatedNodeIds = new Set();
const handleCurrentChange = (val) => {
  currentPage.value = val
}

function handleSizeChange(val) {
  // 改变每页显示的条数
  this.PageSize = val
  // 注意：在改变每页显示的条数时，要将页码显示到第一页
  this.state.currentPage = 1
}

watch([selectedNode], () => {
  if (!selectedNode.value) {
    relatedNodes.value = [];
    return;
  }
  // 获取与所选节点相关的所有连接
  const relatedLinks = linkData.filter(
      (link) => link.source === selectedNode.value || link.target === selectedNode.value
  );
  relatedNodeIds.clear();
  for (const link of relatedLinks) {
    relatedNodeIds.add(link.source);
    relatedNodeIds.add(link.target);
  }
  let tempRelatedNodes1 = companyData.filter((node) => relatedNodeIds.has(node.id) && node.id !== selectedNode.value); //没有加上选中节点
  // 将相关连接信息添加到相关节点信息中，并添加序号
  tempRelatedNodes1.forEach((node, index) => {
    node.relation = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation)
        .join(",");
    node.relation1 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation1)
        .join(",");
    node.relation2 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation2)
        .join(",");
    node.relation3 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation3)
        .join(",");
    node.analysis = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.analysis)
        .join(",");
    node.index = index + 1;
  });
  relatedNodesWithout.value = tempRelatedNodes1;

}, {deep: true});
//"查看详情"功能
const infoDialogVisible = ref(false)
const formLabelWidth = '140px'
let info = ref({
  id: '',
  name: '',
  chain: '',
  index: -1,
  marketShare: '',
  marketIncrease: '',
  profitability: '',
  investRatio: '',
  productWidth: '',
  productDepth: '',
  brandAwareness: '',
  cooperationWillingness: '',
  reputation: '',
  cooperationNum: '',
  cooperationSuccess: '',
  averageRoi: '',
  suppliersNum: '',
  turnover: '',
  deliveryRate: '',
  tradeLevel: '',
  category: '',
  relation1: [],
  relation2: [],
  relation3: [],
  analysis: [],
  x: -1,
  y: -1,
  deleted: false
});
const handleInfo = (row) => {
  infoDialogVisible.value = true
  info.value = row
}

onMounted(async () => {

  const chartDom = chartContainer.value;
  myChart = echarts.init(chartDom);
  myChart2 = echarts.init(relationChart.value);
  console.log(myChart)
  //const response = await axios.get('/src/assets/dataFusion/company.json');
  const response = ref(null);
  const response2 = ref(null);
  response.value = await getAllCompanyAndLink();
  //const response2 = await axios.get('/src/assets/dataFusion/step3.json');
  response2.value = await getTotalRelation();
  const graph = response.value;
  const graph2 = response2.value;
  console.log(graph)
  console.log(graph2)

  const containerWidth = chartContainer.value.clientWidth;
  const containerHeight = chartContainer.value.clientHeight;

//计算polygon的相对坐标点
  function calculatePoints(points) {
    const widthRatio = containerWidth / 800; // 宽度比例
    const heightRatio = containerHeight / 500; // 高度比例
    return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
  }

  function getColorBasedOnLayer(locationId, nodes) {
    const node = nodes.find(node => node.locationId === locationId);
    if (node) {
      // 根据节点的 layer 属性返回不同的颜色
      switch (node.layer) {
        case 1:
          return 'rgba(196,76,126,0.98)';
        case 2:
          return '#90ee90';
        case 3:
          return '#39779d';
        default:
          return 'black';
      }
    }
    // 如果节点不存在，默认颜色为黑色
    return 'black';
  }

// 计算节点的相对位置
  function calculatePoints(points) {
    const widthRatio = containerWidth / 815; // 宽度比例
    const heightRatio = containerHeight / 650; // 高度比例
    return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
  }

// 计算节点的相对位置
  graph.nodes.forEach(node => {
    node.locationX = node.locationX / 800 * containerWidth;
    node.locationY = node.locationY / 400 * containerHeight;
  });

  graph2.nodes.forEach(node => {
    node.locationX = node.locationX / 800 * containerWidth;
    node.locationY = node.locationY / 270 * containerHeight;
  });

//绘制ECharts关系图
  myChart.setOption({
    graphic: [
      {
        type: 'group',
        position: [100, 70], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, -30], [650, -30], [600, 90], [-50, 90]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'red',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [-50, 70], // 相对于 group 左上角位置的偏移量
            style: {
              text: '合作关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [100, 190], // 左上角位置，根据需要进行调整
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, -15], [650, -15], [610, 105], [-50, 105]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'black',
              lineWidth: 3,
              opacity: 0.3,
            }
          },
          {
            type: 'text',
            position: [-50, 80], // 相对于 group 左上角位置的偏移量
            style: {
              text: '供应关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [50, 310], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, 110], [645, 110], [685, -10], [50, -10]])  // 左下、右下、右上、左上
            },
            style: {
              fill: '#eee',
              stroke: 'blue',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [10, 85], // 相对于 group 左上角位置的偏移量
            style: {
              text: '竞争关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      }
    ],

    title: {
      text: '多重关系网络分析模型',
      // subtext: '这是一个副标题',
      top: 'top',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'node') {
          var id = params.data.id;
          var trueId = params.data.trueId;
          const name = params.data.name;
          const chain = params.data.chain;
          const category = params.data.category;
          const marketShare = (params.data.marketShare * 100).toFixed(1) + '%';
          const marketIncrease = (params.data.marketIncrease * 100).toFixed(1) + '%';
          const profitability = (params.data.profitability * 100).toFixed(1) + '%';
          const investRatio = (params.data.investRatio * 100).toFixed(1) + '%';
          const productWidth = params.data.productWidth;
          const productDepth = params.data.productDepth;
          const brandAwareness = Math.round(params.data.brandAwareness * 100);
          const cooperationWillingness = Math.round(params.data.cooperationWillingness * 100);
          const reputation = (params.data.reputation * 100).toFixed(0);
          const cooperationNum = params.data.cooperationNum;
          const cooperationSuccess = (params.data.cooperationSuccess * 100).toFixed(1) + '%';
          const averageRoi = (params.data.averageRoi * 100).toFixed(1) + '%';
          const suppliersNum = params.data.suppliersNum;
          const turnover = (params.data.turnover * 100).toFixed(1) + '%';
          const deliveryRate = (params.data.deliveryRate * 100).toFixed(1) + '%';
          const tradeLevel = (params.data.tradeLevel * 100).toFixed(0);
          const layer = params.data.layer;
          if (layer === 1) {
            return "id: " + trueId + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "市场份额：" + marketShare + '<br/>' + "市场增长率：" + marketIncrease + '<br/>' + "盈利率：" + profitability + '<br/>' + "科研投入比例：" + investRatio + '<br/>' + "产品线宽度：" + productWidth + '<br/>' + "产品线深度：" + productDepth + '<br/>' + "品牌知名度：" + brandAwareness;
          } else if (layer === 2) {
            return "id: " + trueId + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "供应商数量：" + suppliersNum + '<br/>' + "库存周转率：" + turnover + '<br/>' + "准时交付率：" + deliveryRate + '<br/>' + "物流水平：" + tradeLevel;
          } else if (layer === 3) {
            return "id: " + trueId + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "合作意愿强度：" + cooperationWillingness + '<br/>' + "信誉分：" + reputation + '<br/>' + "参与合作数量：" + cooperationNum + '<br/>' + "合作成功率：" + cooperationSuccess + '<br/>' + "合作项目平均收益率：" + averageRoi;
          }
        } else if (params.dataType === 'edge') {
          //console.log(params.data)
          var sourceLocationId = params.data.source + 1;
          var targetLocationId = params.data.target + 1;
          // 在节点数据中查找匹配的节点
          var sourceNode = graph.nodes.find(node => node.locationId === sourceLocationId);
          var targetNode = graph.nodes.find(node => node.locationId === targetLocationId);
          var layer = sourceNode.layer;
          //console.log(layer)
          // 获取找到的节点的真实 id
          var sourceNodeId = sourceNode ? sourceNode.name : null;
          var targetNodeId = targetNode ? targetNode.name : null;
          var label = params.data.label.formatter;
          if (layer === 1) {
            return "企业1：" + sourceNodeId + '<br/>' + "企业2：" + targetNodeId + '<br/>' + "竞争关联强度：" + label;
          } else if (layer === 2) {
            return "企业1：" + sourceNodeId + '<br/>' + "企业2：" + targetNodeId + '<br/>' + "供应关联强度：" + label;
          } else if (layer === 3) {
            return "企业1：" + sourceNodeId + '<br/>' + "企业2：" + targetNodeId + '<br/>' + "合作关联强度：" + label;
          }

        }

      }
    },
    // legend: [
    //   {
    //     orient: 'vertical',
    //     left: 'left',
    //     formatter: function(name) {
    //       return '团体 ' + name; // 在每个图例项前加上 "Category "
    //     }
    //   }
    // ],
    animationDuration: 1500, //初始动画的时长
    animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
    series: [{
      type: 'graph',
      layout: 'none',
      data: graph.nodes.map(node => ({
        id: node.locationId,  // 使用 locationId 作为唯一标识符
        trueId: node.id,
        x: node.locationX,
        y: node.locationY,
        symbolSize: 18,
        name: node.name,
        chain: node.chain,
        category: node.category - 1,
        marketShare: node.marketShare,
        marketIncrease: node.marketIncrease,
        profitability: node.profitability,
        investRatio: node.investRatio,
        productWidth: node.productWidth,
        productDepth: node.productDepth,
        brandAwareness: node.brandAwareness,
        cooperationWillingness: node.cooperationWillingness,
        reputation: node.reputation,
        cooperationNum: node.cooperationNum,
        cooperationSuccess: node.cooperationSuccess,
        averageRoi: node.averageRoi,
        suppliersNum: node.suppliersNum,
        turnover: node.turnover,
        deliveryRate: node.deliveryRate,
        tradeLevel: node.tradeLevel,
        layer: node.layer
      })),
      links: graph.links.map(link => ({
        source: graph.nodes.findIndex(node => node.locationId === link.sourceLocation),
        target: graph.nodes.findIndex(node => node.locationId === link.targetLocation),
        lineStyle: {
          color: getColorBasedOnLayer(link.sourceLocation, graph.nodes),
        },
        label: {
          show: true,
          formatter: link.strengthRelation !== null ? link.strengthRelation.toString() : "", // 将 strengthRelation 转为字符串作为注释
        },
      })),
      categories: [
        {name: "1"},
        {name: "2"},
        {name: "3"},
        {name: "4"},
        {name: "5"}
      ],
      roam: true,     //开启鼠标缩放和平移漫游

      label: {
        show: true,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        // formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
        formatter: function (params) {
          return params.data.trueId;
        }
      },
      //edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [4, 6],
      edgeLabel: {
        show: true,
        fontSize: 12,
        color: 'rgb(183,163,163)',
        emphasis: {
          color: 'rgb(9,9,9)',
          fontSize: 14,
        }
      },
      lineStyle: {
        // color: function (x) {
        //   console.log(x.links.label.type); // 添加调试输出
        //   return x.links.label.type === '1' ? 'green' : 'blue'; // type为1时线为绿色，否则为蓝色
        // },
        curveness: 0.2,
        width: 2,
        type: 'solid',
        arrow: {
          show: true,
          size: 6,
          offset: 0,
          symbol: 'arrow',
          symbolSize: [6, 12]
        }
      },

      emphasis: {
        focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {    //边的设置
          width: 10,
          type: "dotted",
          // shadowBlur:0.5,
          opacity: 0.7,
        },
        label: {
          show: true,
          formatter: function (params) {
            return params.data.name;  // 鼠标悬浮时显示节点的名称
          }
        }
      },
    }]


  });

  myChart.on('click', params => {

  });

  myChart.on('mousedown', params => {
    if (params.event.target.tagName === 'CANVAS') {
      const startPoint = myChart.convertFromPixel('grid', [params.event.offsetX, params.event.offsetY]);
      let rect = null;

      const mousemoveHandler = e => {
        const curPoint = myChart.convertFromPixel('grid', [e.offsetX, e.offsetY]);
        const minX = Math.min(startPoint[0], curPoint[0]);
        const maxX = Math.max(startPoint[0], curPoint[0]);
        const minY = Math.min(startPoint[1], curPoint[1]);
        const maxY = Math.max(startPoint[1], curPoint[1]);

        if (!rect) {
          rect = myChart.graphic.add({
            type: 'rect',
            shape: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            },
            style: {
              fill: 'rgba(255, 255, 255, 0.3)',
              stroke: '#666',
              lineWidth: 2
            }
          });
        } else {
          rect.setShape({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
          });
        }

        const nodes = myChart.getOption().series[0].data;
        const nodesInRect = nodes.filter(node => {
          const point = myChart.convertToPixel('grid', [node.x, node.y]);
          return myChart.graphic.isPointInGraphic(rect, point);
        });
        const selectedNodes = nodesInRect.map(node => node.name);
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: selectedNodes
        });
      };


      const mouseupHandler = () => {
        myChart.off('mousemove', mousemoveHandler);
        myChart.off('mouseup', mouseupHandler);
        if (rect) {
          myChart.graphic.remove(rect);
        }
      };

      myChart.on('mousemove', mousemoveHandler);
      myChart.on('mouseup', mouseupHandler);
    }
  });
  myChart2.setOption({
    graphic: [
      {
        type: 'group',
        position: [100, 190], // 左上角位置，根据需要进行调整
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[-20, -80], [660, -80], [610, 160], [-80, 160]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'black',
              lineWidth: 3,
              opacity: 0.3,
            }
          },
          {
            type: 'text',
            position: [-85, 125], // 相对于 group 左上角位置的偏移量
            style: {
              text: '整体关联关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      }
    ],

    title: {
      text: '多重产业链整体关联分析模型',
      // subtext: '这是一个副标题',
      top: 'top',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'node') {
          var id = params.data.id;
          const name = params.data.name;
          const chain = params.data.chain;
          const category = params.data.category;
          const marketShare = (params.data.marketShare * 100).toFixed(1) + '%';
          const marketIncrease = (params.data.marketIncrease * 100).toFixed(1) + '%';
          const profitability = (params.data.profitability * 100).toFixed(1) + '%';
          const investRatio = (params.data.investRatio * 100).toFixed(1) + '%';
          const productWidth = params.data.productWidth;
          const productDepth = params.data.productDepth;
          const brandAwareness = Math.round(params.data.brandAwareness * 100);
          const cooperationWillingness = params.data.cooperationWillingness * 100;
          const reputation = params.data.reputation * 100;
          const cooperationNum = params.data.cooperationNum;
          const cooperationSuccess = (params.data.cooperationSuccess * 100).toFixed(1) + '%';
          const averageRoi = (params.data.averageRoi * 100).toFixed(1) + '%';
          const suppliersNum = params.data.suppliersNum;
          const turnover = (params.data.turnover * 100).toFixed(1) + '%';
          const deliveryRate = (params.data.deliveryRate * 100).toFixed(1) + '%';
          const tradeLevel = params.data.tradeLevel * 100;
          return "id: " + id + '<br/>' + "企业名称：" + name;
          //return "id: " + id + '<br/>' + "企业名称：" + name + '<br/>' + "企业所属产业链：" + chain + '<br/>' + "所属团体：" + category + '<br/>' + "市场份额：" + marketShare + '<br/>' + "市场增长率：" + marketIncrease + '<br/>' + "盈利率：" + profitability + '<br/>' + "科研投入比例：" + investRatio + '<br/>' + "产品线宽度：" + productWidth + '<br/>' + "产品线深度：" + productDepth + '<br/>' + "品牌知名度：" + brandAwareness + '<br/>' + "供应商数量：" + suppliersNum + '<br/>' + "库存周转率：" + turnover + '<br/>' + "准时交付率：" + deliveryRate + '<br/>' + "物流水平：" + tradeLevel + '<br/>' + "合作意愿强度：" + cooperationWillingness + '<br/>' + "信誉分：" + reputation + '<br/>' + "参与合作数量：" + cooperationNum + '<br/>' + "合作成功率：" + cooperationSuccess + '<br/>' + "合作项目平均收益率：" + averageRoi;
        } else if (params.dataType === 'edge') {
          var source = params.data.sourceId;
          var target = params.data.targetId;
          var label = params.data.label.formatter;
          // 在节点数据中查找匹配的节点
          var sourceNode = graph.nodes.find(node => node.id === source);
          var targetNode = graph.nodes.find(node => node.id === target);
          //console.log(layer)
          // 获取找到的节点的真实 id
          var sourceNodeId = sourceNode ? sourceNode.name : null;
          var targetNodeId = targetNode ? targetNode.name : null;
          return "企业1：" + sourceNodeId + '<br/>' + "企业2：" + targetNodeId + '<br/>' + "整体关联强度：" + label;
        }
      }
    },
    legend: [
      {
        orient: 'vertical',
        left: 'left',
        formatter: function (name) {
          return '团体 ' + name; // 在每个图例项前加上 "Category "
        }
      }
    ],
    animationDuration: 1500, //初始动画的时长
    animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
    series: [{
      type: 'graph',
      layout: 'none',
      data: graph2.nodes.map(node => ({
        id: node.id,
        x: node.locationX,
        y: node.locationY,
        symbolSize: 20,
        name: node.name,
        chain: node.chain,
        category: node.category - 1,
        marketShare: node.marketShare,
        marketIncrease: node.marketIncrease,
        profitability: node.profitability,
        investRatio: node.investRatio,
        productWidth: node.productWidth,
        productDepth: node.productDepth,
        brandAwareness: node.brandAwareness,
        cooperationWillingness: node.cooperationWillingness,
        reputation: node.reputation,
        cooperationNum: node.cooperationNum,
        cooperationSuccess: node.cooperationSuccess,
        averageRoi: node.averageRoi,
        suppliersNum: node.suppliersNum,
        turnover: node.turnover,
        deliveryRate: node.deliveryRate,
        tradeLevel: node.tradeLevel,
      })),
      links: graph2.links.map(link => ({
        source: graph2.nodes.findIndex(node => node.id === link.sourceLocation),
        target: graph2.nodes.findIndex(node => node.id === link.targetLocation),
        sourceId: link.sourceLocation,
        targetId: link.targetLocation,
        lineStyle: {
          color: "rgba(71,82,71,0.8)"
        },
        label: {
          show: true,
          formatter: link.strengthRelation.toString(), // 将 strengthRelation 转为字符串作为注释
        },
      })),
      categories: [
        {name: "1"},
        {name: "2"},
        {name: "3"},
        {name: "4"},
        {name: "5"}
      ],
      roam: true,     //开启鼠标缩放和平移漫游

      label: {
        show: true,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        // formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
        formatter: function (params) {
          return params.data.id;
        }
      },
      //edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [4, 6],
      edgeLabel: {
        show: true,
        // formatter: function (x) {
        //   return x.links.label.type;
        // },
        fontSize: 12,
        color: 'rgb(183,163,163)',
        emphasis: {
          color: 'rgb(9,9,9)',
          fontSize: 14,
        }
      },
      lineStyle: {
        curveness: 0.2,
        width: 2,
        type: 'solid',
        arrow: {
          show: true,
          size: 6,
          offset: 0,
          symbol: 'arrow',
          symbolSize: [6, 12]
        }
      },

      emphasis: {
        focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {    //边的设置
          width: 10,
          type: "dotted",
          // shadowBlur:0.5,
          opacity: 0.7,
        },
        label: {
          show: true,
          formatter: function (params) {
            return params.data.name;  // 鼠标悬浮时显示节点的名称
          }
        }
      },
    }]


  });

  myChart2.on('click', params => {

  });

  myChart2.on('mousedown', params => {
    if (params.event.target.tagName === 'CANVAS') {
      const startPoint = myChart.convertFromPixel('grid', [params.event.offsetX, params.event.offsetY]);
      let rect = null;

      const mousemoveHandler = e => {
        const curPoint = myChart.convertFromPixel('grid', [e.offsetX, e.offsetY]);
        const minX = Math.min(startPoint[0], curPoint[0]);
        const maxX = Math.max(startPoint[0], curPoint[0]);
        const minY = Math.min(startPoint[1], curPoint[1]);
        const maxY = Math.max(startPoint[1], curPoint[1]);

        if (!rect) {
          rect = myChart.graphic.add({
            type: 'rect',
            shape: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            },
            style: {
              fill: 'rgba(255, 255, 255, 0.3)',
              stroke: '#666',
              lineWidth: 2
            }
          });
        } else {
          rect.setShape({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
          });
        }

        const nodes = myChart.getOption().series[0].data;
        const nodesInRect = nodes.filter(node => {
          const point = myChart.convertToPixel('grid', [node.x, node.y]);
          return myChart.graphic.isPointInGraphic(rect, point);
        });
        const selectedNodes = nodesInRect.map(node => node.name);
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: selectedNodes
        });
      };


      const mouseupHandler = () => {
        myChart.off('mousemove', mousemoveHandler);
        myChart.off('mouseup', mouseupHandler);
        if (rect) {
          myChart.graphic.remove(rect);
        }
      };

      myChart.on('mousemove', mousemoveHandler);
      myChart.on('mouseup', mouseupHandler);
    }
  });
})
;
const reset = () => {
  selectedRelation.value = "";
  selectedNode.value = "";
  relatedNodesWithout.value = "";
}
const handleSelectChange = () => {
  //selectedRelation.value="";
  //let selectedNodeIndices = selectedNode.value;
  //console.log(selectedNode.value);
  if (selectedRelation.value != "") {
    // if (selectedRelation.value === 1) {
    //   selectedNodeIndices = Number(selectedNode.value);
    // }
    // if (selectedRelation.value === 2) {
    //   selectedNodeIndices = Number(selectedNode.value) + 20;
    // }
    // if (selectedRelation.value === 3) {
    //   selectedNodeIndices = Number(selectedNode.value) + 40;
    // }
    const selected = nodeData.find(node => node.id === selectedNode.value && node.layer === selectedRelation.value);
    //const selectedNodeIndices = selected ? selected.locationId : null;
    const dataIndex = selectedNode ? nodeData.indexOf(selected) : -1;
    console.log(dataIndex);
    myChart.dispatchAction({
      type: 'highlight', // 触发高亮效果
      seriesIndex: 0,    // 替换成您的图表中的系列索引
      dataIndex: dataIndex, // 替换成您的数据中节点的索引或 ID
    });
  } else {
    let selectedNodeIndices = selectedNode.value;
    console.log(selectedNodeIndices);
    myChart2.dispatchAction({
      type: 'highlight', // 触发高亮效果
      seriesIndex: 0,    // 替换成您的图表中的系列索引
      dataIndex: selectedNodeIndices - 1, // 替换成您的数据中节点的索引或 ID
    });
  }
  // selectedRelation.value="";

};
const handleSelectChange2 = () => {
  //let selectedNodeIndices = selectedNode.value;
  //console.log(selectedNode.value);
  if (selectedNode.value != "") {
    // if (selectedRelation.value === 1) {
    //   selectedNodeIndices = Number(selectedNode.value);
    // }
    // if (selectedRelation.value === 2) {
    //   selectedNodeIndices = Number(selectedNode.value) + 20;
    // }
    // if (selectedRelation.value === 3) {
    //   selectedNodeIndices = Number(selectedNode.value) + 40;
    // }
    const selected = nodeData.find(node => node.id === selectedNode.value && node.layer === selectedRelation.value);
    //const selectedNodeIndices = selected ? selected.locationId : null;
    const dataIndex = selectedNode ? nodeData.indexOf(selected) : -1;
    console.log(dataIndex);
    myChart.dispatchAction({
      type: 'highlight', // 触发高亮效果
      seriesIndex: 0,    // 替换成您的图表中的系列索引
      dataIndex: dataIndex, // 替换成您的数据中节点的索引或 ID
    });
    // selectedRelation.value="";
  }

};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-r {
  align-content: center;
  border: 1px solid #bfbfbf; /* 添加1像素黑色边框 */
  padding: 20px; /* 可选：添加内边距，使内容区域不会贴紧边框 */
}

.common-layout {
  display: flex; /* 使用 Flexbox 布局 */
}

.common-layout > div {
  flex: 1; /* 平均分配容器的宽度 */
  margin: 10px; /* 可选的外边距，用于控制 <div> 之间的间距 */
}

.container {
  //width: 750px; flex: 1; /* 自动平均分配父容器的宽度 */
  border: 1px solid #bfbfbf; /* 添加1像素黑色边框 */
  padding: 20px; /* 可选：添加内边距，使内容区域不会贴紧边框 */
}

.container-t {
  width: 100%; /* 或者适当的宽度值 */
  /* 其他样式属性 */
}

.m-2 {
  margin-right: 10px;
}

.flex-container {
  display: flex;
  align-items: center;
}

.header-text {
  margin-right: 10px;
  font-weight: bold
}

.my-table {
  border: 1px solid #ebeef5;
  width: 100% !important;
  border-radius: 4px;
}

.custom-table .el-table__header-wrapper th,
.custom-table .el-table__body-wrapper td {
  border-width: 2px !important;
  //border-color: #333 !important;
}

/* 首行底色更深 */
.custom-table .el-table__header-wrapper th {
  background-color: rgba(194, 186, 186, 0.47) !important; /* 设置首行底色 */
}
</style>