<template>
<!--  <div class="app-container" v-if="!showSecond">-->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-row>
          <el-card class="card" style="width:100%; height: 450px">
            <template #header><span style="font-size: 20px; font-weight: bold;">任务状态监控</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div ref="rectangleRef" class="rectangle">
                <div v-for="(task, index) in state.tasks"
                     :key="task.id"
                     :class="{ 'circle': true, 'flashing': state.circleFlashing[index] }"
                     :style="{
          backgroundColor: state.circleColors[index],
          width: state.circleSizes[index] + 'px',
          height: state.circleSizes[index] + 'px',
          position: 'absolute',
          left: state.circlePositions[index].left + 'px',
          top: state.circlePositions[index].top + 'px'
        }"
                     v-show="state.circleVisible[index]"
                     @mouseover="event => showTooltip(event, index)"
                     @mouseout="event => hideTooltip(event)"
                     @click="state.exceptionalTaskIds.includes(task.id) ? showMessage(task.id) : null"
                >
                  <span>任务{{ task.id }}</span>
                </div>
                <div class="custom-tooltip">
                  粉色代表洗衣机产业链任务<br/>蓝色代表空调产业链任务<br/>绿色代表汽车产业链任务<br/>红色闪烁表示任务有突发情况<br/>点击任务节点查看详情
                </div>
              </div>
            </div>
          </el-card>
          <el-dialog :visible.sync="showModal" title="任务详情">
            <div class="custom-modal-content" v-html="modalContent"></div>
            <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">关闭</el-button>
    </span>
          </el-dialog>
        </el-row>
        <el-row>
          <el-card class="card" style="width:100%; height: 450px" >
            <template #header><span style="font-size: 20px; font-weight: bold;">任务价值统计图</span></template>
            <span style="margin-right: 10px;font-size: 16px">当前产业链:</span>
            <el-select  placeholder="请选择产业链" style="width:150px" @change="handleStageChange" v-model="chainType">
              <el-option
                  v-for="dict in chain"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
            <div class="taskBar" ref="taskBar"></div>

          </el-card>
        </el-row>
      </el-col>
      <el-drawer v-model="showDrawerVar" direction="rtl">
        <h2>{{ start }} 与 {{ end }} 合作历史详情</h2>
        <el-table :data="selectedHistory" style="width: 100%">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="评价企业" prop="companyName" align="center"></el-table-column>
          <el-table-column label="被评企业" prop="evaluatedCompanyName" align="center"></el-table-column>
          <el-table-column label="任务ID" prop="taskName" align="center"></el-table-column>
          <el-table-column label="评分" prop="score" align="center">
            <template v-slot="{ row }">
              <el-rate v-model="row.score" disabled></el-rate>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
      <el-col :span="12">
        <el-row>
          <el-card class="card" style="width:100%; height: 450px">
            <template #header><span style="font-size: 20px; font-weight: bold;">企业群统计表</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <el-row justify="center" class="tab-row">
                <el-col :span="8">
                  <span>选择查询类型：</span>
                  <el-select v-model="queryType" placeholder="选择查询类型">
                    <el-option label="企业群名称" value="企业群名称"></el-option>
                    <el-option label="企业群编号" value="企业群编号"></el-option>
                    <el-option label="参与任务" value="参与任务"></el-option>
                    <el-option label="协同模式" value="协同模式"></el-option>
                  </el-select>
                </el-col>
                <!-- 添加查询输入框 -->
                <el-col :span="8" class="query-input">
                  <div style="display: flex; align-items: center;">
                    <div style="flex-grow: 2; margin-right: 10px;">
                      <span>请输入查询内容：</span>
                      <el-input v-model="queryInput" :placeholder="queryInputPlaceholder"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-row :span="1"></el-row>
                  <el-col :span="1"></el-col>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-col>
              </el-row>
              <div class="table-container">
                <el-row justify="center" class="tab-row">
                  <el-col :span="22">
                    <el-table :key="tableKey" v-show="!isLoading" :data="businessGroupTableData" border max-height="239" v-fit-columns style="width: 100%">
                      <el-table-column  label="序号" align="center" width="60">
                        <template #default="{$index}">
                          {{ computeRowIndex($index) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="coalitionName" label="企业群名称" align="center"
                                       header-cell-class-name="table-header-cell" width="180"/>
                      <el-table-column prop="coalitionId" label="企业群编号" align="center"
                                       header-cell-class-name="table-header-cell">
                      </el-table-column>
                      <el-table-column prop="taskId" label="任务编号" align="center" width="60"
                                       header-cell-class-name="table-header-cell">
                      </el-table-column>
                      <el-table-column prop="companyCount" label="企业个数" align="center" width="60"
                                       header-cell-class-name="table-header-cell">
                      </el-table-column>
                      <el-table-column prop="modeName" label="协同模式" align="center"
                                       header-cell-class-name="table-header-cell"/>
                    </el-table>
                  </el-col>
                </el-row>
                <div class="pagination">
                  <button @click="prevPage" :disabled="currentPage <= 1">上一页</button>
                  <span>第 {{ currentPage }} 页</span>
                  <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
                </div>
              </div>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="card" style="width:100%; height: 450px">
            <template #header><span style="font-size: 20px; font-weight: bold;">企业协同模式统计图</span></template>
            <el-row>
              <el-col :span="14">
                <el-form :model="form" label-width="260px">
                  <div ref="sit2" style="width: 100%; height: 330px; margin-bottom: 20px;"></div>
                </el-form>
              </el-col>

              <el-col :span="10">
                <div class="ranking-list">
                  <h3>企业协同模式排行榜</h3>
                  <table>
                    <thead>
                    <tr>
                      <th>排行</th>
                      <th>协同模式</th>
                      <th>完成率</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(mode, index) in sortedModesData" :key="mode.modeName" :class="getRowClass(index)">
                      <td>{{ index + 1 }}</td>
                      <td>{{ mode.modeName }}</td>
                      <td>{{ mode.completionRate }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="el-table el-table--enable-row-hover el-table--medium">
                  <div ref="Info" style="width:900px; height: 450px"/>
                </div>
              </el-col>
            </el-row>

          </el-card>
        </el-row>
      </el-col>
    </el-row>
<!--  </div>-->
</template>

<script setup>
import { ElMessage, ElMessageBox, ElRate } from 'element-plus'
import request from "@/utils/request.js";
import useLoadingStore from "@/store/modules/loading.js";
import useTaskStore from "@/store/modules/task.js";
import * as echarts from "echarts";
// import _ from "lodash";
import {onMounted, reactive, ref, nextTick, getCurrentInstance} from 'vue';
import {
  runGeneticAlgorithm,
  getActiveTasks,
  sendSolutionToBackend,
  fetchCoalitionDetails,
  modeShow,
  getAllScoreRecords,

} from '@/api/multimode/faultyMachine';
//cl 部分，左下角
//cl 部分，右下角
const taskBar = ref();
let chartInstance = null;
let taskStore=useTaskStore();
const chainType=ref("洗衣机产业链")
const {proxy}=getCurrentInstance()
const { chain } = proxy.useDict('chain');
const getType=()=>{
  if(chainType.value==="洗衣机产业链")
    return 1;
  else
    return chainType.value;
}
const props=defineProps(['chainType'])
watch(()=>props.chainType,(val)=>{
  getTaskStatus()
})
const chains=['洗衣机产业链','空调产业链','汽车产业链']
const handleStageChange=()=>{
  drawTaskBar()
}
const drawTaskBar=async ()=>{
  let type=chainType.value==="洗衣机产业链"?1:chainType.value
  taskStore.tasks = await request({
    url: "/coalition/formation/getChainTask",
    method: 'get',
    params:{
      chainId:type
    }
  });
  let res = taskStore.tasks;
  let category = [];
  let lineData = [];
  let barData = [];

  res.forEach((item)=>{
    category.push(item.name);
    lineData.push(item.duration);
    barData.push(item.val);
  })

  let option = {
    backgroundColor: "#fcfcfc",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
          backgroundColor: "#333",
        },
      },
      formatter:function(params){
        return params[0].axisValue+'<br>'+'持续时长：'+params[0].data+'<br>'+'任务价值：'+params[1].data;
      }
    },
    legend: {
      data: ["持续时长", "任务价值"],
      textStyle: {
        color: "#000000",
      },
    },
    grid:{
      left: 30,
      bottom:20,
      right: 20,
      containLabel: true
    },
    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: "#000000",
        },
      },
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: "#000000",
        },
      },
    },
    series: [
      {
        name: "持续时长",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 15,
        data: lineData,
      },
      {
        name: "任务价值",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          normal: {
            barBorderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#b5eef3" },
              { offset: 1, color: "#cbefe7" },
            ]),
          },
        },
        data: barData,
      },
      {
        name: "line",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(20,200,212,0.5)" },
              { offset: 0.2, color: "rgba(20,200,212,0.2)" },
              { offset: 1, color: "rgba(20,200,212,0)" },
            ]),
          },
        },
        z: -12,
        data: lineData,
      },
      {
        name: "dotted",
        type: "pictorialBar",
        symbol: "rect",
        itemStyle: {
          normal: {
            color: "#0f375f",
          },
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        z: -10,
        data: lineData,
      },
    ],
  };
  chartInstance.setOption(option);
}
// 联盟表格前端显示数据
//上下翻页
const fetchData = async () => {
  isLoading.value = true; // 开始加载数据
  try {
    const response = await fetchCoalitionDetails();
    allData.value = response; // 假设response就是数据数组
    totalItems.value = response.length; // 更新总项目数
    totalPages.value = Math.ceil(totalItems.value / pageSize.value); // 计算总页数
    updatePageData(); // 初始化页面数据
  } catch (error) {
    console.error('获取数据失败:', error);
  }finally {
    isLoading.value = false; // 完成加载
  }
};

// 更新当前页面的数据
const updatePageData = () => {
  const dataToDisplay = filteredData.value.length > 0 ? filteredData.value : allData.value;
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  businessGroupTableData.value = dataToDisplay.slice(start, end);

  // 如果filteredData有内容，则已经在handleSearch中更新了totalPages
  // 如果没有，则需要根据allData更新totalPages
  if (filteredData.value.length === 0) {
    updateTotalPages(allData.value);
  }
  tableKey.value++; // 每次数据更新时递增key
};

// 翻到上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updatePageData();
  }
};
// 计算行的全局索引
const computeRowIndex = ($index) => {
  return $index + 1 + (currentPage.value - 1) * pageSize.value;
};
// 翻到下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updatePageData();
  }
};
const updateTotalPages = (data) => {
  totalPages.value = Math.ceil(data.length / pageSize.value);
};
async function fetchCoalitionDetailsAndUpdateTable() {
  try {
    const response = await fetchCoalitionDetails(); // 调用API函数
    businessGroupTableData.value = response; // 更新表格数据
  } catch (error) {
    console.error('获取联盟详情失败:', error);
  }
}
// mode板块
const modesData = ref([]); // 使用ref来保持响应性

const fetchModesData = async () => {
  try {
    const response = await modeShow();
    console.log("Data from modeShow:", response);
    modesData.value = response.map(mode => ({
      ...mode,
      completionRate: (mode.completionRate * 100).toFixed(2) + '%', // 假设完成率是0到1之间的数，转换为百分比
      failureRate:(100- (mode.completionRate * 100).toFixed(2) ).toFixed(2)+ '%',
    }));
    // 确保DOM已更新，再绘制echarts图表
    nextTick(() => {
      if (sit2.value) { // 确保sit2已经被ref关联
        createPieChart(sit2.value, modesData.value);
      }
    });
  } catch (error) {
    console.error("Failed to fetch modes data:", error);
  }
};
// 定义一个计算属性来排序modesData
const sortedModesData = computed(() => {
  // 假设每个模式对象中的完成率已经是百分比形式的字符串了，需要转换为数字进行比较
  return modesData.value.slice().sort((a, b) => {
    // 转换完成率字符串为数字，去掉百分号并转换为浮点数进行比较
    let rateA = parseFloat(a.completionRate.replace('%', ''));
    let rateB = parseFloat(b.completionRate.replace('%', ''));
    return rateB - rateA; // 降序排序
  });
});


const getRowClass = (index) => {
  if (index < 3) { // 对前三名使用特殊样式
    return 'top-three';
  }
  return '';
};
const allData = ref([]); // 用于存储所有数据
const tableKey = ref(0);
const businessGroupTableData = ref([]);// 当前页显示的数据
const currentPage = ref(1);
const pageSize = ref(3);
const totalPages = ref(0);
const totalItems = ref(0);
const isLoading = ref(true);
const filteredData = ref([]); // 用于存储过滤后的查询结果
const sit2 = ref(null);//饼状图
//历史合作部分数据展示
const scoreRecords = ref([]);
const showDrawerVar = ref(false);
const selectedHistory = ref([]);
const start = ref('');
const end = ref('');


const businessLocations = ref([]);
const businessDirections = ref([]);
const taskLinkageInfo1 = ref(null);
const queryType = ref(''); // 保存查询类型
const queryInput = ref(''); // 保存查询输入
const loginbusinessId = ref('');

const isRunning = ref(false); //启动遗传算法
const resolvedTasks = ref(new Set());

const multiChart = ref(null);
const lb = 0;
const lt =45;
const width = 650;
const height = 90;
const layers1 = 35;
const rb = lb + width;
const rt = lt + width;
const layere1 = layers1 + height;
const gap = 30;
const layers2 = layere1 + gap;
const layere2 = layers2 + height;
const layers3 = layere2 + gap;
const layere3 = layers3 + height;

//查看合作历史
const showDrawer = (drawerContent) => {
  start.value = drawerContent.source;
  end.value = drawerContent.target;
  selectedHistory.value = drawerContent.history;
  showDrawerVar.value = true; // 控制抽屉显示
  nextTick(() => {
    console.log("Drawer should now be visible.");
  });
}
function handleLineClick(sourceId, targetId) {
  console.log('Clicked link from:', sourceId, 'to:', targetId);
  // 从scoreRecords中筛选相关数据
  const relevantScores = scoreRecords.value.filter(record =>
      (record.companyId.toString() === sourceId && record.evaluatedCompanyId.toString() === targetId) ||
      (record.companyId.toString() === targetId && record.evaluatedCompanyId.toString() === sourceId)

  );
  showDrawer({
    source: `企业 ${sourceId}`,
    target: `企业 ${targetId}`,
    history: relevantScores.map(h => ({
      id: h.id,
      companyId: h.companyId,
      evaluatedCompanyId: h.evaluatedCompanyId,
      taskId: h.taskId,
      companyName: h.companyName,
      evaluatedCompanyName: h.evaluatedCompanyName,
      taskName: h.taskName,
      score: h.score  // Assuming 'score' is what you mean by 'deliveryExperience'
    }))
  });
}


let name_title = "点击连线查看企业合作历史"
let nameColor = " rgb(55, 75, 113)"
let name_fontFamily = '等线'
let name_fontSize = 18
let baseOption = {
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  title: {
    text: name_title,
    x: 'right',
    textStyle: {
      //color: nameColor,
      fontFamily: name_fontFamily,
      fontSize: name_fontSize
    }
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
let multiChartInstance = null;
const allocateSpace = (nodes) => {
  let choose = [];
  nodes.forEach(node => {
    while (true) {
      const randomPos = Math.floor(Math.random() * 60) + 1;
      if (choose.indexOf(randomPos) === -1) {
        choose.push(randomPos);
        //每一份大小40*50，起点为（50,30),一共45份，分布为3行，每行15份
        node.x = 25 + ((randomPos - 1) % 20) * 25 + 12.5;
        node.y = 10 + Math.floor((randomPos - 1) / 20) * 20 + 5;
        break;
      }
    }
  })
}

const drawRelationShip = async () => {
  const nodes = await request({
    url: '/graph/getnodes',
    method: 'get'
  });
  const links = await request({
    url: '/graph/getedges',
    method: 'get'
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
    node.symbolSize = node.value * 15;
    node.category = node.layer_id - 1;
  })
  const node_l1 = nodes.filter(node => node.layer_id === 1);
  const node_l2 = nodes.filter(node => node.layer_id === 2);
  const node_l3 = nodes.filter(node => node.layer_id === 3);
  allocateSpace(node_l1);
  allocateSpace(node_l2);
  allocateSpace(node_l3);
  //根据层对节点的y值进行校正
  node_l2.forEach(node => {
    node.y += 90;
  });
  node_l3.forEach(node => {
    node.y += 180;
  });
  let node_all = node_l1.concat(node_l2).concat(node_l3);

  // const node_after = node_l1.concat(node_l2).concat(node_l3);
  const relationOption = {
    tooltip: {
      formatter: function (params) {
        //return params.data.name + "的信誉：" + params.data.value;
        return '点击查看历史合作评价';
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
            name: '汽车产业链'
          },
          {
            name: '家电产业链'
          },
          {
            name: '电子产业链'
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
      },
    ]
  }
  multiChartInstance.on('click', function (params) {
    if (params.dataType === 'edge') {  // 确保点击的是连线
      const sourceId = params.data.source.split(' ')[0];  // 提取ID
      const targetId = params.data.target.split(' ')[0];
      handleLineClick(sourceId, targetId);
    }
  });
  multiChartInstance.setOption(relationOption);
}
const loadingStore = useLoadingStore()
watch(() => loadingStore.isloading, (newval) => {
  if (newval) {
    drawRelationShip();
    loadingStore.isloading = false;
  }
})


//获取板块的长和宽
const rectangleRef = ref(null);
//与左上板块的提示框分开
const tooltipBox = {
  left: 400,
  top: 250,
  width: 200, // 假设提示框宽度为200px
  height: 100, // 假设提示框高度为100px
};
const state = reactive({
  tasks: [],
  exceptionalTaskIds: [],
  exceptionalTaskDetails: {}, // 存储异常任务的详细信息
  circleColors: [],
  circleSizes: [],
  circleFlashing: [],
  circleVisible: [],
  circlePositions: [],
});

function getColorByChainId(chainId) {
  const colorMap = {
    1: '#efd0dd',
    2: '#93b3e7',
    3: '#dbf3da',
    // 更多chainId对应的颜色
  };
  return colorMap[chainId] || '#34495e'; // 默认颜色
}

function prepareCircles(tasks, containerWidth, containerHeight) {
  const baseSize = 50; // 基础尺寸
  state.tasks = tasks;
  state.circleColors = tasks.map(task =>
      state.exceptionalTaskIds.includes(task.id) ? '#FF0000' : getColorByChainId(task.chainId) // 如果任务异常，设置为红色
  );
  state.circleSizes = tasks.map(() => baseSize);
  state.circleFlashing = tasks.map(task =>
      state.exceptionalTaskIds.includes(task.id) // 如果任务ID在异常任务ID列表中，设置flashing为true
  );
  state.circleVisible = tasks.map(() => true);

  // 计算圆圈的随机位置
  const maxAttempts = 100; // 避免无限循环

  tasks.forEach((task, index) => {
    let foundPosition = false;
    let attempts = 0;
    while (!foundPosition && attempts < maxAttempts) {
      attempts++;
      const potentialPosition = {
        left: Math.random() * (containerWidth - state.circleSizes[index]),
        top: Math.random() * (containerHeight - state.circleSizes[index]),
        diameter: state.circleSizes[index]
      };

      let overlapping = state.circlePositions.some(existingCircle =>
          isOverlapping(potentialPosition, { ...existingCircle, diameter: state.circleSizes[state.circlePositions.indexOf(existingCircle)] })
      );

      // 检查与提示框的重叠
      if (!overlapping && overlapsTooltip(potentialPosition, tooltipBox)) {
        overlapping = true;
      }

      if (!overlapping) {
        foundPosition = true;
        state.circlePositions.push({ left: potentialPosition.left, top: potentialPosition.top });
      }
    }

    if (!foundPosition) {
      console.error('Could not find a non-overlapping position for circle', index);
    }
  });
}
function isOverlapping(circle1, circle2) {
  const distance = Math.sqrt(Math.pow(circle1.left + circle1.diameter / 2 - (circle2.left + circle2.diameter / 2), 2) +
      Math.pow(circle1.top + circle1.diameter / 2 - (circle2.top + circle2.diameter / 2), 2));
  return distance < ((circle1.diameter / 2) + (circle2.diameter / 2));
}
function overlapsTooltip(circle, tooltipBox) {
  const circleCenterX = circle.left + circle.diameter / 2;
  const circleCenterY = circle.top + circle.diameter / 2;

  const tooltipCenterX = tooltipBox.left + tooltipBox.width / 2;
  const tooltipCenterY = tooltipBox.top + tooltipBox.height / 2;

  const distanceX = Math.abs(circleCenterX - tooltipCenterX);
  const distanceY = Math.abs(circleCenterY - tooltipCenterY);

  if (distanceX > (tooltipBox.width / 2 + circle.diameter / 2)) return false;
  if (distanceY > (tooltipBox.height / 2 + circle.diameter / 2)) return false;

  return true;
}
//运行GA算法返回异常结果
const fetchRunDataAndUpdateExceptionalTaskIds = async () => {
  try {
    const response = await runGeneticAlgorithm();
    // 假设response是一个数组，每个元素包含异常任务的信息
    if (response && Array.isArray(response)) {
      // 清空之前的异常任务ID列表
      state.exceptionalTaskIds = [];
      state.exceptionalTaskDetails = {}; // 清空之前的详细信息
      response.forEach(taskInfo => {
        if (taskInfo.taskId) {
          state.exceptionalTaskIds.push(taskInfo.taskId);
          // 存储异常任务的详细信息
          state.exceptionalTaskDetails[taskInfo.taskId] = {
            crossInfo: taskInfo.crossInfo,
            taskName: taskInfo.taskName,
            recommendedCompanies: taskInfo.machineCompanyNames,
            recommendedid: taskInfo.machineCompanyId,
            mode: taskInfo.mode,
            originalCompanyNames: taskInfo.originalCompanyNames
          };
        }
      });
    }
  } catch (error) {
    console.error("Fetching run genetic algorithm data failed:", error);
  }
};
const dynamicBar=ref(null);
let barChart=null;
//const taskStore=userTaskStore();
const data = [];
const draw=async ()=>{
  taskStore.tasks = await request({
    url: "/coalition/formation/getall"
  });
  let taskList=taskStore.tasks.filter(item=>item.taskStatus===1);
  let categories=taskList.map(item=>item.name);
  if(categories.length==0)
  {
    for(let i=1;i<=6;i++)
    {
      categories.push("任务"+i);
    }
  }
  for(let i=0;i<categories.length;i++)
  {
    data.push(Math.round(Math.random() * 30))
  }
  let option = {
    grid:{
      containLabel: true,
      top:0,
      left:0
    },
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: categories,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 5
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: data,
        label: {
          show: true,
          position: 'right',
          formatter:function(params){
            return params.value+"%";
          },
          valueAnimation: true
        }
      }
    ],
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
  };
  barChart.setOption(option);
}

let timer=null;
//const loadingStore=useLoadingStore();
watch(()=>loadingStore.coalitionloading,()=>{
  clearInterval(timer);
  draw();
  timer=setInterval(()=>{
    run()
  },3000);
})
function run() {
  for (let i = 0; i < data.length; ++i) {
    if (Math.random() > 0.6) {
      data[i] += Math.round(Math.random() * 15);
      if(data[i]>=100)
      {
        data[i]=Math.round(Math.random()*30);
      }
    } else {
      data[i] += Math.round(Math.random() * 30);
      if(data[i]>=100)
      {
        data[i]=Math.round(Math.random()*30);
      }
    }
  }
  barChart.setOption({
    series: [
      {
        type: 'bar',
        data
      }
    ]
  });
}
onMounted(async () => {
  chartInstance= echarts.init(taskBar.value);
  drawTaskBar()
  try {
    const response = await getAllScoreRecords();
    console.log('Received data:', response); // 打印到控制台
    scoreRecords.value = response; // 将数据保存到scoreRecords变量中
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  await fetchRunDataAndUpdateExceptionalTaskIds();

//mode 板块挂载
  fetchModesData();
  fetchData();
  // 联盟表格前端显示数据
  fetchCoalitionDetailsAndUpdateTable();
  //调用GA函数
  fetchRunDataAndUpdateExceptionalTaskIds();
  //获取长宽
  getActiveTasks().then(response => {
    const rectangle = rectangleRef.value;
    if (rectangle) {
      const containerWidth = rectangle.offsetWidth;
      const containerHeight = rectangle.offsetHeight;
      prepareCircles(response, containerWidth, containerHeight);
    }
  }).catch(error => {
    console.error('获取任务数据失败', error);
  });
  // intervalId = setInterval(toggleCirclesVisibility, 20000);
  try {
    isRunning.value = true;
    const response = await runGeneticAlgorithm();
    console.log(response); // 或者处理返回的数据
    const response1 = await getActiveTasks();
    console.log('获取:',response1); // 或者处理返回的数据
  } catch (error) {
    console.error('Error running genetic algorithm:', error);
  } finally {
    isRunning.value = false;
  }

});
const queryInputPlaceholder = computed(() => {
  // 根据用户选择的查询类型返回相应的占位符
  if (queryType.value === '企业群名称') {
    return '请输入企业群名称';
  } else if (queryType.value === '企业群编号') {
    return '请输入企业群编号';
  } else if (queryType.value === '参与任务') {
    return '请输入任务+编号，例如“任务1”';
  } else if (queryType.value === '协同模式') {
    return '跨企业跨链跨群选一到三项,如"跨链跨群”'; // 这里假设协同模式是一个下拉选择菜单
  } else {
    return '请输入查询信息';
  }
});

const showTooltip = async (event, index) => {
  //console.log("loginbusinessId",loginbusinessId.value);
  const task = state.tasks[index];
  let statusMessage = '状态：正常';
  if (state.exceptionalTaskIds.includes(task.id)) {
    statusMessage = '状态：异常\n\n点击查看异常';
  }

  let industryChainInfo = '';
  // 假设chainId已经是任务数据的一部分
  switch (task.chainId) {
    case 1:
      industryChainInfo = '所属洗衣机产业链\n';
      break;
    case 2:
      industryChainInfo = '所属空调产业链\n';
      break;
    case 3:
      industryChainInfo = '所属汽车产业链\n';
      break;
      // 根据需要添加更多情况
  }

  event.target.title = `任务${task.id}: ${task.name}\n${industryChainInfo}${statusMessage}`;
};
const hideTooltip = (event) => {
  if (event && event.target) {
    event.target.title = '';
  }
}
const showModal = ref(false);
const modalContent = ref('');
const closeModal = () => {
  showModal.value = false;
};

const showRecommendedSolution = async (taskId) => {
  const taskInfo = state.exceptionalTaskDetails[taskId];
  const task = state.tasks.find(t => t.id === taskId);
  if (!taskInfo) {
    console.error("未找到任务信息。");
    return;
  }

  const recommendedCompanies = Array.isArray(taskInfo.recommendedCompanies)
      ? taskInfo.recommendedCompanies.join(", ")
      : "未知企业";
  const solutionMessage = `
        推荐企业：${recommendedCompanies}\n
        替换后效果：任务可以正常完成、协同效率提升\n
        替换后协同模式：${taskInfo.crossInfo}\n
        是否确定使用此方案？
    `;

  const userConfirmation = confirm(solutionMessage);

  if (userConfirmation) {
    console.log("用户确认使用该方案。");
    console.log("任务信息task",task);
    console.log("任务信息",task.chainId);

    const originalColor = getColorByChainId(task.chainId);
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      state.circleColors[taskIndex] = originalColor; // 重置为原始颜色
      state.circleFlashing[taskIndex] = false; // 停止闪烁
    }

    // 移除taskId从异常任务ID列表
    const exceptionalIndex = state.exceptionalTaskIds.indexOf(taskId);
    if (exceptionalIndex > -1) {
      state.exceptionalTaskIds.splice(exceptionalIndex, 1);
    }

    // 第二步：发送解决方案到后端
    const solutionData = {
      taskId: taskId,
      companyName: Array.isArray(recommendedCompanies) ? recommendedCompanies : [recommendedCompanies],
      companyId: Array.isArray(taskInfo.recommendedid) ? taskInfo.recommendedid : [taskInfo.recommendedid],

      crossInfo: taskInfo.crossInfo,
      mode: taskInfo.mode
    };
    console.log("后端。", solutionData);

    sendSolutionToBackend(solutionData)
        .then(response => {
          console.log("解决方案信息已成功发送到后端。", response);
          fetchModesData();
          // 在这里处理后端的响应
        })
        .catch(error => {
          console.error("发送解决方案信息到后端时出错：", error);
        });
  } else {
    console.log("用户取消使用该方案。");
  }
};
const showMessage = async (taskId) => {
  const taskInfo = state.exceptionalTaskDetails[taskId];
  if (!taskInfo) {
    console.log("当前任务没有发现异常。");
    return;
  }

  let message = `任务${taskId}: ${taskInfo.taskName}\n\n`;

  // 构建涉及的企业信息
  message += `任务异常原因：参与任务的企业出现异常情况。\n\n企业异常原因：大量机器出现故障。\n\n潜在危机：任务延迟交付。`;

  const userResponse = confirm(message + "\n\n请问是否要立刻处理？");

  if (userResponse) {
    // 用户点击了“确定”，可以在这里处理故障任务，例如显示推荐的解决方案
    console.log("用户确认处理故障任务。");
    showRecommendedSolution(taskId);
    // 可以在这里调用 showRecommendedSolution 或其他函数来处理故障任务
  } else {
    console.log("用户取消处理故障任务。");
  }
};



const form = reactive({
  name: '',
  region: '1',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  parameter1: '200',
  parameter2: '50',
  parameter3: '40',
  parameter4: '120'
})

const handleSearch = () => {
  // 重置到第一页
  currentPage.value = 1;

  // 根据查询类型和输入值过滤数据
  filteredData.value = allData.value.filter(item => {
    switch (queryType.value) {
      case '企业群名称':
        return item.coalitionName.includes(queryInput.value);
      case '企业群编号':
        // 假设企业群编号是数字，所以进行字符串化比较
        return item.coalitionId.toString().includes(queryInput.value);
      case '参与任务':
        // 假设任务ID是数字，且用户输入的是完整的数字，无需去除"任务"文本
        return item.taskId.toString().includes(queryInput.value);
      case '协同模式':
        // 假设协同模式的比较是基于完整匹配或子字符串匹配
        return item.modeName.includes(queryInput.value);
      default:
        return true; // 如果没有选择查询类型，或输入不匹配任何已知类型，则不过滤数据
    }
  });
  // 更新总页数为过滤后数据的总页数
  updateTotalPages(filteredData.value);
  // 基于过滤后的数据更新当前页面显示的数据
  updatePageData();
};

function createPieChart(chartContainer, data) {
  const chartInstance = echarts.init(chartContainer);
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        //console.log("ECharts tooltip params:", params); // 输出params以检查
        const modeData = data.find(item => item.modeName === params.name);
        const completionRate = modeData.completionRate;
        const failureRate = modeData.failureRate;
        const defaultContent = `${params.marker}${params.name} : ${params.value}<br/>`;
        const additionalContent = `任务完成率: ${completionRate}<br/>故障发生率: ${failureRate}`;
        return defaultContent + additionalContent;
      },
    },
    series: [
      {
        type: 'pie',
        label: {
          normal: {
            show: true,
            formatter: function (params) {
              let name = params.data.name;
              if(name.length<=3)
              {
                return name;
              }
              else
              {
                return name.slice(0,3)+"\n"+name.slice(3,name.length);
              }
            }
          }
        },
        labelLine:{
          normal:{
            show:true,
            length:10,//第一段长度
            length2:0//第二段长度 设置0不显示第二段
          }
        },
        data: data.map(item => ({value: item.competitionNum, name: item.modeName})),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  chartInstance.setOption(chartOptions);
}
</script>

<style scoped>
.dynamicBar{
  width: 100%;
  height: 430px;
}
.taskBar{
  width: 100%;
  height: 350px;
}
.star-rating {
  display: inline-block;
}

.star {
  font-size: 24px;
  color: gold;
  /* 或者你想要的星星颜色 */
}

.rectangle {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* 水平间隔自适应 */
  align-content: start; /* 垂直开始排列，允许多行 */
  gap: 10px; /* 圆圈之间的间隙 */
  padding: 10px; /* 防止圆圈紧贴容器边缘 */
  /* 确保设置了高度和宽度 */
  height: 350px; /* 或具体值，例如500px */
  width: 100%; /* 或具体值，例如500px */
}

.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-align: center;
  /* 可以移除固定的宽高设置，让它基于内容自动调整大小，或根据圆圈数量动态计算 */
}
.app-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
}

.card {
  width: 100%;
  border: 1px solid #ccc; /* 添加边框样式 */
  border-radius: 3px; /* 可选：添加边框圆角 */
  overflow: hidden; /* 防止边框溢出内容 */
  margin-bottom: 5px;
  position: relative;
}

.el-row:not(:last-child) {
  margin-bottom: 10px;
}

.flashing span {
  animation: none;
  /* 移除文字的闪烁动画 */
}

.flashing {
  animation: blinking 1s infinite alternate;
}

.flashing span {
  animation: none;
  /* 移除文字的闪烁动画 */
}

@keyframes blinking {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.custom-tooltip {
  font-size: 14px; /* 调整字体大小 */
  position: absolute;
  left: 400px;
  top: 240px;
  background-color: #fff;
  padding: 8px; /* 内边距 */
  border: 2px solid #ccc;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
  text-align: center;
  /* 将文字居中 */
  /* font-weight: bold;*/
  /* 将文字设为粗体 */
  border-radius: 5px;
  /* 添加圆角 */
}

.card-footer {
  position: absolute; /* 绝对定位 */
  top: 10px; /* 顶部间距 */
  right: 10px; /* 右侧间距 */
}

/* 添加样式来调整查询框和文字的显示以及间隙 */
.query-type,
.query-input,
.query-button {
  margin-right: 10px;
  /* 调整查询框之间的间隙 */
}

/* 隐藏查询类型和查询内容的文字 */
.el-select__placeholder,
.el-input__placeholder {
  display: none;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 0px;
  margin-bottom: 1px;
}


.table-container {
  height: 300px;
  /* 设置一个固定的高度，可以根据需要调整 */
  /* overflow-y: auto; */
  /* 添加垂直滚动条，当表格数据超过容器高度时会显示滚动条 */
  justify-content: space-between; /* 分散对齐，使分页控件远离表格 */
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.divname {
  cursor: pointer;
}

.el-table {
  position: relative; /* 为子元素的绝对定位创建上下文 */
}

.custom-tooltip-button {
  position: absolute; /* 绝对定位 */
  top: 0px; /* 距离顶部的距离 */
  left: 630px; /* 距离左边的距离 */
  background-color: #fff; /* 背景颜色 */
  padding: 8px; /* 内边距 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  text-align: center;
  /* 将文字居中 */
  font-weight: bold;
}


.tooltip {
  width: 150px;
  background-color: #fff;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-content {
  visibility: hidden;
}

.tooltip:hover .tooltip-content {
  visibility: visible;
}

.tooltip .el-tooltip__popper {
  background-color: #fff;
  /* 将背景颜色改为白色 */
  color: #000;
  /* 修改文字颜色为黑色（可选） */
}

.table-header-cell {
  background-color: #16524f; /* 浅蓝色背景 */
  color: #333; /* 文字颜色 */
}

span {
  margin: 10px; /* 或者你想要的任何值 */
}


.ranking-list {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-top: -10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ranking-list h3 {
  margin-bottom: 5px;
  text-align: center;
  line-height: 1; /* 减少行间距 */
  font-size: 22px; /* 减小字号 */
  font-weight: bold;
  font-family: 'Arial', sans-serif;
}

.ranking-list ul {
  list-style: none;
  padding: 0;
}

.ranking-list li {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.rank {
  font-weight: bold;
  margin-right: 10px;
}

.name {
  flex: 1;
}

.value {
  font-weight: bold;
}

.ranking-list table {
  width: 100%;
  text-align: center; /* 居中对齐表格内容 */
}

.ranking-list th, .ranking-list td {
  padding: 5px;
}

/* 前三名的背景色 */
.top-three {
  background-color: #ffdfba; /* 淡橙色，可根据喜好更改 */
}

/* 单独为前三名设置不同的背景色 */
.top-three:nth-child(1) { /* 第一名 */
  background-color: #f5ed86; /* 金色 */
}

.top-three:nth-child(2) { /* 第二名 */
  background-color: #d1ceceda; /* 银色 */
}

.top-three:nth-child(3) { /* 第三名 */
  background-color: #e7c584; /* 铜色 */
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.custom-modal-content {
  line-height: 1.5;
  text-align: justify;
}

.custom-modal-content strong {
  font-weight: bold;
}

</style>

