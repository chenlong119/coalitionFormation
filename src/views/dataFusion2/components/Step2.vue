<template>
  <div class="common-layout" style="align-items: center;">
    <div id="main2" ref="chartContainer" class="container"
         style="flex: 1 0 70%; height: 460px; background-color: rgb(255,255,255)">
    </div>
    <el-button type="primary"  @click="toggleLegendAndCategories" style="margin: 10px; padding: 8px; font-size: 16px; height: 100px" class="vertical-text-button">
      <span>{{ buttonText }}</span>
      </el-button>
    <div id="pieChart" ref="pieChart" class="container"
         style="flex: 1 0 25%; height: 460px; background-color: rgb(255,255,255)">
    </div>
  </div>
  <br>
  <div class="common-layout">
    <div class="container">
      <el-row>
        <el-form :inline="true" :model="singleCompanyForm" class="demo-form-inline">
          <el-form-item label="企业个体查询">
            <!--            <el-input v-model="singleCompanyForm.companyName" placeholder="请输入企业名称"/>-->
            <el-autocomplete
                v-model="singleCompanyForm.companyName"
                placeholder="请输入企业名称"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                clearable
                class="inline-input w-50"
                @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button type="primary" @click="searchSingleCompany">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table :data="currentTaskList2" style="width: 100%" border class="table custom-table">
          <el-table-column fixed prop="name" label="企业名称" width="" align="center"/>
          <el-table-column prop="category" label="所属企业团体" width="" align="center"/>
          <el-table-column prop="marketShare" label="市场份额" width="" align="center" :formatter="formatPercentage"/>
          <el-table-column prop="cooperationNum" label="参与合作次数" width="" align="center"/>
          <el-table-column prop="suppliersNum" label="供应商数量" width="" align="center"/>
          <el-table-column prop="cooperationWillingness" label="合作意愿强度(0~100)" width="150px" align="center"
                           :formatter="formatHundred"/>
          <el-table-column prop="cooperationSuccess" label="合作成功率" width="" align="center"
                           :formatter="formatPercentage"/>
        </el-table>
      </el-row>
    </div>
    <div class="container">
      <el-row>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="企业团体查询">
            <el-select v-model="formInline.region" placeholder="类别查询" @change="showGroupFeatures">
              <el-option label="团体1" value="1"/>
              <el-option label="团体2" value="2"/>
              <el-option label="团体3" value="3"/>
              <el-option label="团体4" value="4"/>
              <el-option label="团体5" value="5"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchTasks">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-table :data="currentTaskList" style="width: 100%" border class="table custom-table">
          <el-table-column fixed prop="name" label="企业名称" width="" align="center"/>
          <el-table-column prop="marketShare" label="市场份额" width="" align="center" :formatter="formatPercentage"/>
          <el-table-column prop="cooperationNum" label="参与合作次数" width="" align="center"/>
          <el-table-column prop="suppliersNum" label="供应商数量" width="" align="center"/>
          <el-table-column prop="cooperationWillingness" label="合作意愿强度(0~100)" width="150px" align="center"
                           :formatter="formatHundred"/>
          <el-table-column prop="cooperationSuccess" label="合作成功率" width="100px" align="center"
                           :formatter="formatPercentage"/>
          <el-table-column prop="averageRoi" label="合作平均收益率" width="120px" align="center"
                           :formatter="formatPercentage"/>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="tableData.filterData.length"
            @current-change="handleCurrentChange"
            class="mt-4"
        />
      </el-row>
    </div>
  </div>
</template>


<script setup>
import {ref, reactive, computed, watch, onMounted, nextTick} from 'vue'
import * as echarts from 'echarts'
import axios from "axios";
import {getAllCompany, getAllCompanyAndLink, getAllCompanyWithoutLocation, getGroupInfo} from "@/api/datafusion/test";
import {View} from "@element-plus/icons-vue";  //引入echarts
const formulaVisible = ref(false)
const singleCompanyForm = reactive({
  companyName: ""
})
let legendConfig = {
  data: [], // 初始为空
  selectedMode: 'none',
};
const legendAndCategoriesEnabled = ref(false);
const buttonText = ref('团体划分');
// 渲染饼状图的函数
const renderPieChart = async () => {
  // 在每次调用前清空数据
  groupData.value = [];
  pieData.value = [];
  const chartInstance = echarts.init(pieChart.value);
  chartInstance.setOption(chartOptions);

  let res = await getGroupInfo();

  //...（剩余的逻辑，包括生成 pieData、tooltip、series 等）
  for (const group of res) {
    groupData.value.push({
      value: group.value,
      name: group.name,
      list: group.list,
      describe: group.describe,
    });
  }

  for (const group of groupData.value) {
    const dataItem = {
      value: group.value,
      name: group.name,
      list: group.list,
      describe: group.describe,
    };
    pieData.value.push(dataItem);
  }


  const tooltip = {
    trigger: 'item',
    // formatter: '{b} :<br/>企业数量： {c} ({d}%)'
    formatter: function (params) {
      // 查找对应团体的企业信息
      const groupInfo = groupData.value.find(group => group.name === params.name);
      if (groupInfo) {
        return `团体${params.name}企业数量: ${params.value} (${params.percent}%)<br>企业名单：${groupInfo.list}<br>团体特征：${groupInfo.describe}`;
      } else {
        return `${params.id}: ${params.value} (${params.percent}%)`;
      }
    },
  }
  const series = [
    {
      type: 'pie',
      left: 'center',
      bottom: 0,
      radius: '130%',
      roseType: 'area',
      data: pieData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        position: 'outside',  // 将标签放在扇形外部
        show: false,
      },
      focusNodeAdjacency: true,
      itemStyle: {
        borderWidth: 0,
      },
    },
  ];
  chartOptions.tooltip = tooltip;
  chartOptions.series = series;
  chartOptions.title = {
    text: '企业协作团体总览图',
        textAlign: 'center', // 设置标题文本水平居中
        left: '50%', // 将标题水平居中
        top: 'top', // 距离底部的距离
  },
  chartInstance.setOption(chartOptions);
};
const toggleLegendAndCategories = () => {
  legendAndCategoriesEnabled.value = !legendAndCategoriesEnabled.value;
  if (legendAndCategoriesEnabled.value) {
    legendConfig = {
      data: [
        { name: '1' },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5' },
      ],
      selectedMode: 'all',
    };
  }else {
    legendConfig={
      data: [], // 初始为空
      selectedMode: 'none',
    };
  }

  const chartDom = chartContainer.value;
  const myChart = echarts.init(chartDom);
  // 根据状态设置图例和类别的显示/隐藏
  myChart.setOption({
    legend: [],
    title: {
      text: legendAndCategoriesEnabled.value ? '多重产业链企业协作团体划分模型' : '多重产业链企业关系图',
    },
    series: [
      {
        categories: legendAndCategoriesEnabled.value
            ? [
              { name: '1' },
              { name: '2' },
              { name: '3' },
              { name: '4' },
              { name: '5' },
            ]
            : [],
        itemStyle: legendAndCategoriesEnabled.value
          ? [] : {
              normal: {
                color: function(params) {
                  // 根据节点的 layer 值来设置颜色
                  // 这里的示例是根据不同的 layer 设置不同的颜色
                  const layerColors = ['#61a0a8', '#63b2ee', '#76da91', '#feb64d', '#f76d7c'];
                  return layerColors[params.data.layer];
                },
              },
              // 指定节点的高亮样式
              emphasis: {
                color: '#c23531',  // 节点的高亮颜色
              }
            }
      },
    ],
  });
  buttonText.value = legendAndCategoriesEnabled.value ? '关系展示' : '团体划分';
  renderPieChart();
};
const companyName = reactive([]);
getAllCompanyWithoutLocation().then(response => {
  for (const node of response.nodes) {
    companyName.push({
      value: node.name
    });
  }
})
const selectedGroup = ref(null)
const selectedGroupFeature = ref(null);
const chartContainer = ref(null);
const pieChart = ref(null);
let myChart = null;
const formInline = reactive({
  user: '',
  region: '',
})

let tableData = reactive({
  filterData: []
})
let tableData2 = reactive({
  filterData: []
})
const pageSize = 3

//当前页
let currentPage = ref(1);
let currentTaskList = computed(() => {
  return tableData.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
let currentTaskList2 = computed(() => {
  return tableData2.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const querySearch = (queryString, cb) => {
  const results = queryString
      ? companyName.filter(createFilter(queryString))
      : companyName
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

function formatPercentage(row, column) {
  // 获取当前列的字段名
  const field = column.property;

  // 获取当前行的对应字段的值
  const value = row[field];

  // 将数值转换为百分比格式
  if (value !== null && value !== undefined) {
    return `${(value * 100).toFixed(1)}%`;
  } else {
    return ''; // 处理空值的情况
  }
}

function formatHundred(row, column) {
  // 获取当前列的字段名
  const field = column.property;

  // 获取当前行的对应字段的值
  const value = row[field];

  // 将数值转换为百分比格式
  if (value !== null && value !== undefined) {
    return `${(value * 100).toFixed(0)}`;
  } else {
    return ''; // 处理空值的情况
  }
}

const handleSelect = (item) => {
  console.log(item)
}

function showGroupFeatures() {
  selectedGroup.value = formInline.region;
  selectedGroupFeature.value = groupFeatures.find(group => group.name === formInline.region)?.feature || '';
}

function searchSingleCompany() {
  const name = singleCompanyForm.companyName;
  getAllCompanyWithoutLocation().then(response => {
    let data = response.nodes;
    tableData2.filterData = data.filter(item => item.name == name);
    //console.log(tableData.filterData)
  })
  currentPage.value = 1;
}

function searchTasks() {
  const category = formInline.region;
  getAllCompanyWithoutLocation().then(response => {
    let data = response.nodes;
    console.log(data.filter(item => item.category == category));
    tableData.filterData = data.filter(item => item.category == category);
  })
  // axios.get('/src/assets/dataFusion/step2.json').then(response => {
  //   let data = response.data.nodes;
  //   tableData.filterData = data.filter(item => item.category == category);
  // })
  currentPage.value = 1;
}

let groupData = ref([]);
let pieData = ref([]);

let chartOptions = null;
chartOptions = {
  title: {
    text: '点击按钮进行企业协作团体划分',
    textAlign: 'center', // 设置标题文本水平居中
    left: '50%', // 将标题水平居中
    top: 'top', // 距离底部的距离
  },
  legend: {
    textStyle:
        {
          color: 'black',
          fontSize: 10,
        },
    left: 'center',
    top: 'bottom',
    formatter: function (id) {
      return '团体 ' + id; // 在每个图例项前加上 "Category "
    },
  },
};

// const createPieChart = () => {
//
//     }
// ;
onMounted(async () => {
  const chartInstance = echarts.init(pieChart.value);
  chartInstance.setOption(chartOptions);
  // let res = await getGroupInfo()
  // console.log(res);
  // for (const group of res) {
  //   groupData.value.push({
  //     value: group.value,
  //     name: group.name,
  //     list: group.list,
  //     describe: group.describe,
  //   });
  // }
  //
  // for (const group of groupData.value) {
  //   const dataItem = {
  //     value: group.value,
  //     name: group.name,
  //     list: group.list,
  //     describe: group.describe,
  //   };
  //   pieData.value.push(dataItem);
  // }
  //
  const tooltip = {
    trigger: 'item',
    // formatter: '{b} :<br/>企业数量： {c} ({d}%)'
    formatter: function (params) {
      // 查找对应团体的企业信息
      const groupInfo = groupData.value.find(group => group.name === params.name);
      if (groupInfo) {
        return `团体${params.name}企业数量: ${params.value} (${params.percent}%)<br>企业名单：${groupInfo.list}<br>团体特征：${groupInfo.describe}`;
      } else {
        return `${params.id}: ${params.value} (${params.percent}%)`;
      }
    },
  }
  const series = [
    {
      type: 'pie',
      left: 'center',
      bottom: 0,
      radius: '130%',
      roseType: 'area',
      data: pieData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        position: 'outside',  // 将标签放在扇形外部
        show: false,
      },
      focusNodeAdjacency: true,
      itemStyle: {
        borderWidth: 0,
      },
    },
  ];
  chartOptions.tooltip = tooltip;
  chartOptions.series = series;
  chartInstance.setOption(chartOptions);

  const chartDom = chartContainer.value;
  const myChart = echarts.init(chartDom);
  // const response = await axios.get('/src/assets/dataFusion/company.json');
  const response = ref(null);
  try {
    response.value = await getAllCompanyAndLink();
    //console.log(response.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  const graph = response.value;

  const containerWidth = chartContainer.value.clientWidth;
  const containerHeight = chartContainer.value.clientHeight;

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
//计算polygon的相对坐标点
  function calculatePoints(points) {
    const widthRatio = containerWidth / 800; // 宽度比例
    const heightRatio = containerHeight / 650; // 高度比例
    return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
  }

// 计算节点的相对位置
  graph.nodes.forEach(node => {
    node.locationX = node.locationX / 800 * containerWidth;
    node.locationY = node.locationY / 500 * containerHeight;
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
              points: calculatePoints([[0, -20], [680, -20], [640, 100], [-50, 100]])  // 左上、右上、右下、左下
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
            position: [-75, 75], // 相对于 group 左上角位置的偏移量
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
              points: calculatePoints([[0, -15], [680, -15], [640, 105], [-50, 105]])  // 左上、右上、右下、左下
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
            position: [-75, 78], // 相对于 group 左上角位置的偏移量
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
              points: calculatePoints([[-15, 105], [675, 105], [715, -15], [35, -15]])  // 左下、右下、右上、左上
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
            position: [-10, 80], // 相对于 group 左上角位置的偏移量
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
      text: '多重产业链企业关系图',
      // subtext: '这是一个副标题',
      top: 'top',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'node') {
          // console.log("x:"+params.data.x);
          // console.log("y:"+params.data.y);
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
            return "id: " + trueId + '<br/>' + "locationId：" + id + '<br/>' + "企业名称：" + name + '<br/>' + "市场份额：" + marketShare + '<br/>' + "市场增长率：" + marketIncrease + '<br/>' + "盈利率：" + profitability + '<br/>' + "科研投入比例：" + investRatio + '<br/>' + "产品线宽度：" + productWidth + '<br/>' + "产品线深度：" + productDepth + '<br/>' + "品牌知名度：" + brandAwareness;
          } else if (layer === 2) {
            return "id: " + trueId + '<br/>' + "locationId：" + id + '<br/>' + "企业名称：" + name + '<br/>' + "供应商数量：" + suppliersNum + '<br/>' + "库存周转率：" + turnover + '<br/>' + "准时交付率：" + deliveryRate + '<br/>' + "物流水平：" + tradeLevel;
          } else if (layer === 3) {
            return "id: " + trueId + '<br/>' + "locationId：" + id + '<br/>' + "企业名称：" + name + '<br/>' + "合作意愿强度：" + cooperationWillingness + '<br/>' + "信誉分：" + reputation + '<br/>' + "参与合作数量：" + cooperationNum + '<br/>' + "合作成功率：" + cooperationSuccess + '<br/>' + "合作项目平均收益率：" + averageRoi;
          }
        }

      }
    },
    // legend: [
    //   {
    //     show: false,
    //     formatter: function (name) {
    //       return '团体 ' + name; // 在每个图例项前加上 "Category "
    //     }
    //
    //   }
    // ],
    legend: [],
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
        symbolSize: 20,
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
        layer: node.layer,
        legendAndCategoriesEnabled: true,
      })),
      links: graph.links.map(link => ({
        source: graph.nodes.findIndex(node => node.locationId === link.sourceLocation),
        target: graph.nodes.findIndex(node => node.locationId === link.targetLocation),
        lineStyle: {
          color: getColorBasedOnLayer(link.sourceLocation, graph.nodes),
        },
      })),
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
      // categories: [
      //   {name: "1"},
      //   {name: "2"},
      //   {name: "3"},
      //   {name: "4"},
      //   {name: "5"}
      // ],
      categories: [],
      roam: true,     //开启鼠标缩放和平移漫游
      itemStyle: {
        normal: {
          color: function(params) {
            // 根据节点的 layer 值来设置颜色
            // 这里的示例是根据不同的 layer 设置不同的颜色
            const layerColors = ['#61a0a8', '#63b2ee', '#76da91', 'rgba(196,76,126,0.98)', '#f76d7c'];
            return layerColors[params.data.layer];
          },
        },
        // 指定节点的高亮样式
        emphasis: {
          color: '#c23531',  // 节点的高亮颜色
        }
      },
      label: {
        show: true,     //是否显示节点标签
        //formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
        formatter: function(params) {
          return params.data.trueId;
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
          formatter: function(params) {
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
});


</script>

<style>


.feature-item {
  border: 3px solid #ccc; /* 特征展示部分的边框样式 */
  padding: 10px; /* 特征展示部分的内边距 */
  background-color: #6b6868; /* 特征展示部分的背景色 */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 特征展示部分的阴影效果 */
}

.demo-form-inline {
  margin-bottom: 20px; /* 下拉框和查询按钮之间的外边距 */
}

.table {
  margin-bottom: 20px; /* 表格下方的外边距 */
}

.custom-table .el-table__header-wrapper th,
.custom-table .el-table__body-wrapper td {
  border-width: 2px !important;
  //border-color: #333 !important;
}

/* 首行底色更深 */
.custom-table .el-table__header-wrapper th {
  background-color: rgba(194, 186, 186, 0.47) !important; /* 设置首行底色 */
  //color: white; /* 设置首行文字颜色 */
}

.common-layout {
  display: flex; /* 使用 Flexbox 布局 */
}

.common-layout > div {
  flex: 1; /* 平均分配容器的宽度 */
  margin: 10px; /* 可选的外边距，用于控制 <div> 之间的间距 */
  justify-content: space-between;
}

.container {
//width: 750px; flex: 1; /* 自动平均分配父容器的宽度 */
  border: 1px solid #bfbfbf; /* 添加1像素黑色边框 */
  padding: 20px; /* 可选：添加内边距，使内容区域不会贴紧边框 */
}

.el-table th, .el-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 可以显示省略号 (...) 来指示截断的文本 */
}
.vertical-text-button {
  writing-mode: vertical-lr; /* 从左到右的垂直排列 */
  text-orientation: upright; /* 文字方向为正立 */
  height: 100px; /* 按钮高度，根据需要调整 */
  line-height: 10px; /* 行高，根据需要调整 */
  margin: 10px; /* 可选的外边距，用于控制按钮之间的间距 */
}


</style>