<template>
  <div class="app-container" v-if="!showSecond">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-row>
          <el-card class="card" style="width:100%; height: 450px">
            <template #header><span style="font-size: 20px; font-weight: bold;">任务状态监控</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div class="rectangle">
                <div v-for="(color, index) in circleColors" :key="index"
                     :class="{ circle: true, flashing: circleFlashing[index] }"
                     :style="{ backgroundColor: color ,
        width: circleSizes[index] + 'px',
                    height: circleSizes[index] + 'px',
                    left: fixedCirclePositions[index].left + 'px',
                    top: fixedCirclePositions[index].top + 'px'}"
                     v-show="circleVisible[index]"
                     @mouseover="event => showTooltip(event, index)"
                     @mouseout="event => hideTooltip(event)"
                     @click="showMessage(index+1)">
                  <span>任务{{ index + 1 }}</span>
                </div>
                <div class="custom-tooltip">
                  蓝色代表家电产业链任务<br/>紫色代表汽车产业链任务<br/>红色闪烁表示任务有突发情况<br/>点击任务节点查看详情
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
          <el-card class="card" style="width:100%; height: 450px">
            <template #header><span style="font-size: 20px; font-weight: bold;">多模式协同下企业关系图</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div class="rectangle">
                <div ref="taskLinkageInfo1" style="width:100%; height: 350px"/>
                <div class="custom-tooltip-button">
                  点击连线查看历史合作评价
                </div>
              </div>
            </div>

            <!-- <div class="card-footer" >
    <el-button  @click="handleButtonClick">点击连线查看历史合作评价</el-button>
  </div> -->
          </el-card>
        </el-row>
      </el-col>
      <el-drawer direction="rtl" v-model="showDrawerVar">
        <h2>
          {{ start }}与{{ end }}合作历史详情
        </h2>
        <div>
          <el-table :data="selectedHistory" style="width: 100%">
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="任务名称" prop="taskName" align="center"></el-table-column>
            <el-table-column label="交付日期" prop="deliveryDate" align="center"></el-table-column>
            <el-table-column label="交付体验" prop="deliveryExperience" align="center">
              <template v-slot="{ row }">
                <el-rate v-model="row.deliveryExperience" disabled></el-rate>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <div style="text-align: center; margin-top: 20px;">
          <el-button type="primary" @click="handleSearch">添加合作评价</el-button>
        </div> -->
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
                    <div style="flex-grow: 1; margin-right: 10px;">
                      <span>请输入查询内容：</span>
                      <el-input v-model="queryInput" :placeholder="queryInputPlaceholder"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-row :span="5"></el-row>
                  <el-col :span="1"></el-col>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-col>
              </el-row>
              <div class="table-container">
                <el-row justify="center" class="tab-row">
                  <el-col :span="22">
                    <el-table :data="businessGroupTableData" border max-height="239" v-fit-columns style="width: 100%">
                      <el-table-column type="index" label="序号" align="center"
                                       header-cell-class-name="table-header-cell" width="80"/>
                      <el-table-column prop="businessGroupName" label="企业群名称" align="center"
                                       header-cell-class-name="table-header-cell" width="180"/>
                      <el-table-column prop="businessGroupId" label="企业群编号" align="center"
                                       header-cell-class-name="table-header-cell">
                      </el-table-column>
                      <el-table-column prop="businessGroupTask" label="协同任务编号" align="center"
                                       header-cell-class-name="table-header-cell">
                      </el-table-column>
                      <el-table-column prop="businessGroupBusinessnum" label="企业个数" align="center"
                                       header-cell-class-name="table-header-cell">
                      </el-table-column>
                      <el-table-column prop="businessGroupMode" label="协同模式" align="center"
                                       header-cell-class-name="table-header-cell"/>
                    </el-table>
                  </el-col>
                </el-row>
                <div class="pagination">
                  <button @click="prevPage">上一页</button>
                  <span>   第 {{ currentPage }} 页   </span>
                  <button @click="nextPage"> 下一页</button>
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
                    <tr v-for="(mode, index) in modesSortedData" :key="mode.modeName" :class="getRowClass(index)">
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
  </div>
</template>
<!--<script>-->
<!--function showDivnameInfo(row) {-->
<!--  console.log('showDivnameInfo called'); // 用于调试-->
<!--  this.divnameInfo = row.divnameInfo;-->
<!--  this.showInfo = true;-->
<!--  console.log(row.divnameInfo);-->
<!--}-->

<!--export default {-->
<!--  name: "YourComponent",-->
<!--  data() {-->
<!--    return {-->
<!--      //filteredData: [],-->
<!--      showSecond: false,-->
<!--      circleColors: ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E0E3", "#C8E6C9", "#F0F4C3", "#B3E0E3", "#C8E6C9", "#F0F4C3", "#F0F4C3"],-->
<!--      selectedLinkId: null,-->
<!--      showInfo: false, // 添加这行-->
<!--      divnameInfo: '', // 添加这行-->
<!--    };-->
<!--  },-->
<!--}-->
<!--</script>-->
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from "echarts";
// import _ from "lodash";
import {onMounted, reactive, ref} from 'vue';
import {
  getAllDataList,
  getBusinessGroupById,
  getBusinessGroupByMode,
  getBusinessGroupByName,
  getBusinessGroupByTask,
  getBusinessGroupModeCount
} from '@/api/multimode/businessGroupApi';
import {
  fetchAllModesSorted,
  fetchBusinessDirections,
  fetchBusinessHistory,
  fetchBusinessLocations,
  getBusinessNameById,
  getBusinessNamesByIds,
  getCompletionRate,
  getFailureRate,
  getFaultyMachines,
  getFaultyMachinesInfo,
  getMachinesForJob,
  getTaskByTaskId,
  getTasksCrossInfo,
  runGeneticAlgorithm,
  updateBusinessDirection
} from '@/api/multimode/faultyMachine';

const modesSortedData = ref([]);
const getModesSortedData = async () => {
  try {
    const response = await fetchAllModesSorted();
    modesSortedData.value = response;
  } catch (error) {
    console.error('Error fetching modes sorted data:', error);
  }
};
const getRowClass = (index) => {
  if (index < 3) { // 对前三名使用特殊样式
    return 'top-three';
  }
  return '';
};
const allData = ref([]); // 用于存储所有数据
const businessGroupTableData = ref([]);// 当前页显示的数据
const currentPage = ref(1);
const sit2 = ref(null);
const businessLocations = ref([]);
const businessDirections = ref([]);
const taskLinkageInfo1 = ref(null);
const showDrawerVar = ref(false);
const selectedHistory = ref([]);
const queryType = ref(''); // 保存查询类型
const queryInput = ref(''); // 保存查询输入
const selectedLinkId = ref(null);
const pageSize = ref(5);
; // 每页显示的行
const totalItems = ref(0);
const initCircleColors = () => {
  return new Array(20).fill('#A9C9FF').map((_, index) => {
    if (index < 6) return '#EAD9E0'; // 紫色
    if (index < 13) return '#CDE0FF'; // 蓝色
    return index % 2 === 0 ? '#CDE0FF' : '#EAD9E0'; // 交替颜色
  });
};
const circleVisible = ref(new Array(20).fill(true));
// 圆圈颜色
const circleColors = ref(initCircleColors());
//const circleColors = ref(Array(20).fill('#ccffcc'));
const circleFlashing = ref(new Array(20).fill(false));
const isRunning = ref(false); //启动遗传算法
const businessNames = ref({}); // 存储企业名称的映射
const taskNames = ref({}); // 存储任务名称的映射
let faultyMachineToJobMap = ref({});
// 添加一个新的状态来跟踪哪些任务已经解决
const resolvedTasks = ref(new Set());
let taskToMachineMap = ref({});
const nodePositions = ref([]);
const circleSizes = ref(new Array(20).fill(80)); // 示例大小
//const fixedCirclePositions = ref(generateCirclePositions(20, 800, 300, 130)); // 假设框的最大宽度是1000px
//const tooltipRect = { left: 610, top: 270, right: 900, bottom: 400 };
//const circleSizes = ref( [50, 70, 60, 80, 100, 110, 75, 85, 65, 65, 80, 65, 90]);
const fixedCirclePositions = ref([
  {left: 285, top: 263},
  {left: 378, top: 214},
  {left: 6, top: 165},
  {left: 609, top: 23},
  {left: 157, top: 76},
  {left: 622, top: 109},
  {left: 720, top: 166},
  {left: 449, top: 55},
  {left: 311, top: 61},
  {left: 747, top: 87},
  {left: 14, top: 266},
  {left: 490, top: 144},
  {left: 106, top: 226},
  {left: 251, top: 155},
  {left: 17, top: 2},
  {left: 88, top: 135},
  {left: 111, top: 8},
  {left: 505, top: 244},
  {left: 399, top: 132},
  {left: 531, top: 3}
]);
const toggleCirclesVisibility = () => {
  const circlesToToggle = Math.floor(Math.random() * 2) + 1; // 生成1或2
  for (let i = 0; i < circlesToToggle; i++) {
    const indexToToggle = Math.floor(Math.random() * 10) + 10; // 在11-20之间选择索引
    circleVisible.value[indexToToggle] = !circleVisible.value[indexToToggle]; // 切换可见性
  }
};
let intervalId;
// function generateCirclePositions(numberOfCircles, maxWidth, maxHeight, maxCircleDiameter) {
//   const positions = [];
//   for (let i = 0; i < numberOfCircles; i++) {
//     let overlap, x, y;
//     do {
//       overlap = false;
//       x = Math.random() * (maxWidth - maxCircleDiameter);
//       y = Math.random() * (maxHeight - maxCircleDiameter);

//       for (let circle of positions) {
//         const distance = Math.sqrt(Math.pow(circle.left - x, 2) + Math.pow(circle.top - y, 2));
//         if (distance < maxCircleDiameter) {
//           overlap = true;
//           break;
//         }
//       }
//     } while (overlap);
//     positions.push({ left: x, top: y });
//   }
//   return positions;
// }
const businessName = ref('');
const fetchBusinessName = async (businessId) => {
  try {
    const response = await getBusinessByName(businessId);
    businessName.value = response.data.businessName; // 假设返回的对象中包含businessName属性
  } catch (error) {
    console.error('Error fetching business name:', error);
  }
};
const showTooltip = async (event, index) => {
  const taskId = index + 1;
  const taskName = await getTaskByTaskId(taskId);
  console.log(`Tooltip for task at index ${index}, flashing status: ${circleFlashing[index]}`);
  let statusMessage = '\n状态：正常';
  if (circleFlashing.value[index]) {
    statusMessage = '状态：异常\n\n点击查看异常';
  }
  const circleColor = circleColors.value[index];
  let industryChainInfo = '';
  if (circleColor === '#EAD9E0') { // 紫色
    industryChainInfo = '所属汽车产业链\n';
  } else if (circleColor === '#CDE0FF') { // 蓝色
    industryChainInfo = '所属家电产业链\n';
  }

  // 将产业链信息添加到状态信息之前
  event.target.title = `任务${taskId}: ${taskName}\n${industryChainInfo}${statusMessage}`;
}
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

const showRecommendedSolution = async (taskId, faultyMachine) => {
  try {
    // 获取推荐企业信息
    const machinesResponse = await getMachinesForJob(taskId);
    const machinesForJob = machinesResponse; // 假设响应体中包含推荐企业列表

    // 获取企业名称
    const businessNamesResponse = await getBusinessNamesByIds(machinesForJob);
    const businessNames = businessNamesResponse; // 假设响应体中包含企业ID到名称的映射

    // 获取协同模式信息
    const tasksCrossInfo = await getTasksCrossInfo();
    console.log("response", tasksCrossInfo);
    const crossInfo = tasksCrossInfo[taskId] || '跨企业跨链跨群';

    // let recommendedCompanies = '';
    // if (machinesForJob && machinesForJob.length > 0) {
    //   recommendedCompanies = machinesForJob.map(machineId => {
    //     return businessNames[machineId] ? `${businessNames[machineId]}` : `${machineId}`;
    //   }).join(", ");
    // }
    let uniqueRecommendedCompanies = new Set();

    if (machinesForJob && machinesForJob.length > 0) {
      machinesForJob.forEach((machineId, faultyMachine) => {
        if (businessNames[machineId]) {
          uniqueRecommendedCompanies.add(businessNames[machineId]);
        } else {
          uniqueRecommendedCompanies.add(`${machineId}`);
        }
      });
    }

    const recommendedCompanies = [...uniqueRecommendedCompanies].join(", ");


    const solutionMessage = `
      推   荐   企  业  ：${recommendedCompanies}\n
      替 换 后 效 果   ：任务可以正常完成、协同效率提升\n
      替换后协同模式 ：${crossInfo}\n
      是否确定使用此方案？\n
    `;

    // 使用confirm函数让用户确认是否使用该方案
    const userConfirmation = confirm(solutionMessage);

    if (userConfirmation) {
      // 用户点击了“确定”，执行后续操作
      console.log("用户确认使用该方案。");
      // 更新圆圈的颜色和闪烁状态
      const initialColors = initCircleColors();
      const initialColor = initialColors[taskId - 1];
      circleColors.value[taskId - 1] = initialColor; // 假设绿色为 '#ccffcc'
      circleFlashing.value[taskId - 1] = false;
      resolvedTasks.value.add(taskId);
      // 准备要发送的数据
    const updateData = {
      sourceId: faultyMachine,
      goalId: machinesForJob[0], // 假设machinesForJob是一个包含机器ID的数组
      taskId: taskId,
      mode: crossInfo
    };
    console.log("更新数据:", updateData);

    await updateBusinessDirection(updateData);
    await refreshChartData();
    console.log("数据更新成功");

    // 调用API函数更新数据
    try {
      await updateBusinessDirection(updateData);
      console.log("数据更新成功");
    } catch (error) {
      console.error("更新数据时出错:", error);
    }
      // 在这里添加执行方案的代码
    } else {
      // 用户点击了“取消”
      console.log("用户取消使用该方案。");
    }
  } catch (error) {
    console.error('Error fetching machines for job:', error);
    alert("无法获取推荐企业信息，请稍后重试。");
  }
};
const showMessage = async (taskId) => {
  let faultyMachine;
  console.log("showMessage called with taskId:", taskId);
  console.log("Checking if taskToMachineMap contains taskId:", taskId);
  console.log("taskToMachineMap.value:", taskToMachineMap.value);
  if (taskToMachineMap.value.hasOwnProperty(taskId)) {
    faultyMachine = taskToMachineMap.value[taskId];
    console.log("传输1",faultyMachine)
    console.log("TaskId found in taskToMachineMap, proceeding with showMessage logic.");
    try {
      console.log("111check");
      const response = await getTaskByTaskId(taskId);
      console.log("check", response);
      const taskName = response;
      console.log(`异  常  任  务：任务${taskId}--${taskName}...\n`);

      const faultyMachine = taskToMachineMap.value[taskId];

      let message = `任务${taskId}--${taskName}\n\n`;
      if (faultyMachine) {
        const businessName = await getBusinessNameById(faultyMachine);
        message += `任务异常原因：参与任务的企业${faultyMachine}---${businessName}出现突发情况。\n\n企业异常原因：大量机器出现故障。\n\n潜  在  危  机 ：任务延迟交付。`;
      } else {
        message += "当前任务没有发现异常。";
      }

      const userResponse = confirm(message + "\n\n请问是否要立刻处理？");

      if (userResponse) {
        // 用户点击了“确定”
        showRecommendedSolution(taskId, faultyMachine);
      } else {
        // 用户点击了“取消”
        console.log("操作已取消。");
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
    const showSecond = ref(false);
  }
  return faultyMachine;
};
const runAlgorithm = async () => {
  try {
    isRunning.value = true;
    const response = await runGeneticAlgorithm();
    console.log(response); // 或者处理返回的数据
  } catch (error) {
    console.error('Error running genetic algorithm:', error);
  } finally {
    isRunning.value = false;
  }
};
const fetchFaultyMachinesData = async () => {
  try {
    const machinesInfoResponse = await getFaultyMachinesInfo();
    const machinesResponse = await getFaultyMachines();
    // const jobNumbers = machinesInfoResponse.split('\n').filter(line => line).map(Number);
    // const machineNumbers = machinesResponse.split('\n').filter(line => line).map(Number);
//     const jobNumbers = Array.isArray(machinesInfoResponse) ? machinesInfoResponse : [machinesInfoResponse];
// const machineNumbers = typeof machinesResponse === 'string' ? machinesResponse.split('\n').filter(line => line).map(Number) : [machinesResponse];
    const jobNumbers = machinesInfoResponse.map(line => parseInt(line.trim()));
    const machineNumbers = machinesResponse.map(line => parseInt(line.trim()));
    console.log(jobNumbers);
    console.log('machinesInfoResponse:', machinesInfoResponse);

    updateCircles(jobNumbers);

    jobNumbers.forEach((job, index) => {
      taskToMachineMap.value[job] = machineNumbers[index];
    });
  } catch (error) {
    console.error('Error fetching faulty machines data:', error);
  }
};
//onMounted(fetchFaultyMachinesData);
const updateCircles = (faultyMachineNumbers) => {
  if (!faultyMachineNumbers || faultyMachineNumbers.length === 0) {
    console.log('No faulty machines info available');
    return;
  }
  //   const faultyMachineNumbers = (typeof fetchFaultyMachinesData === 'string')
  // ? fetchFaultyMachinesData.split('\n').filter(line => line).map(line => parseInt(line.trim())).filter(num => num >= 1 && num <= 10)
  // : [fetchFaultyMachinesData];
  circleColors.value.forEach((color, index) => {
    const taskId = index + 1;
    if (resolvedTasks.value.has(taskId)) {
      // 如果有故障，设置为红色并闪烁
      circleColors.value[index] = color;
      circleFlashing.value[index] = false;
    } else {
      if (faultyMachineNumbers.includes(taskId)) {
        // 否则，保持原有颜色
        circleColors.value[index] = 'red';
        circleFlashing.value[index] = true;
      } else {
        circleColors.value[index] = color;
        circleFlashing.value[index] = false;

      }
    }
  });

  circleFlashing.value = circleFlashing.value.map((_, index) => {
    const taskId = index + 1;
    // 仅对未解决的故障任务闪烁
    return faultyMachineNumbers.includes(taskId) && !resolvedTasks.value.has(taskId);
  });
};
updateCircles([]);
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
let start = "";
let end = "";
//let tableData = [];
var taskLinkageInfoIntance1;
//let showDrawerVar = ref(false);
// 添加一个函数用于显示抽屉
function showDrawer(data) {
  start = data.source; // 更新 start
  end = data.target;   // 更新 end
  selectedHistory.value = data.history; // 更新表格数据
  showDrawerVar.value = true; // 显示抽屉
}

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
onMounted(async () => {
  intervalId = setInterval(toggleCirclesVisibility, 20000);
  getModesSortedData();
  try {
    isRunning.value = true;
    const response = await runGeneticAlgorithm();
    console.log(response); // 或者处理返回的数据
  } catch (error) {
    console.error('Error running genetic algorithm:', error);
  } finally {
    isRunning.value = false;
  }
  fetchFaultyMachinesData();
  getAllDataList().then(res => {
    businessGroupTableData.value = res;
    console.log(businessGroupTableData.value);
    setInterval(fetchFaultyMachinesData, 5000); // 每5秒钟轮询一次
  })
  const modeCountData = await getBusinessGroupModeCount();
  const modeRates = await Promise.all(modeCountData.map(async (item) => {
    const completionRate = await getCompletionRate(item.business_group_mode);
    const failureRate = await getFailureRate(item.business_group_mode);
    return {
      ...item,
      completionRate,
      failureRate
    };
  }));
  createPieChart(sit2.value, modeRates);
  // taskLinkageInfoIntance1 = echarts.init(taskLinkageInfo1.value);
  // taskLinkageInfoIntance1.setOption(option3);
  // taskLinkageInfoIntance1.on('click', (params) => {
  //   const clickedElement = params.data;

  //   if (clickedElement.source && clickedElement.target) {
  //     showDrawer(clickedElement);
  //   }
  // })
  const responseLocations = await fetchBusinessLocations();
  console.log(responseLocations); // 检查这里的响应
  businessLocations.value = responseLocations;
  const directions = await fetchBusinessDirections();
  // 获取每个方向的历史数据
  await Promise.all(directions.map(async direction => {
    if (direction.historyId) {
      const historyData = await fetchBusinessHistory(direction.historyId);
      direction.history = historyData; // 临时添加 history 属性
    }
  }));
  businessDirections.value = directions;
  initializeChart();
});
const handleSearch = async () => {
  if (queryInput.value === '') {
    ElMessage({
      type: 'warning',
      message: '请输入搜索内容',
    })
    return;
  }
  try {
    let response;

    if (queryType.value === '企业群名称') {
      response = await getBusinessGroupByName(queryInput.value);
      console.log(response);
    } else if (queryType.value === '企业群编号') {
      response = await getBusinessGroupById(queryInput.value);
      console.log(response);
    } else if (queryType.value === '参与任务') {
      response = await getBusinessGroupByTask(queryInput.value);
    } else if (queryType.value === '协同模式') {
      response = await getBusinessGroupByMode(queryInput.value);
    }

    businessGroupTableData.value = response;
    // 重置当前页数为第一页
    currentPage.value = 1;
  } catch (error) {
    console.error(`Error fetching business group: ${error.message}`);
  }
};
// 获取所有数据
const fetchAllData = async () => {
  try {
    const response = await getAllDataList();
    allData.value = response.data || response; // 根据实际返回值调整
    totalItems.value = allData.value.length;
    updatePageData(); // 更新当前页的数据
  } catch (error) {
    console.error(`Error fetching all data: ${error.message}`);
  }
};

// 根据当前页码更新页面数据
const updatePageData = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  businessGroupTableData.value = allData.value.slice(start, end);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updatePageData();
  }
};

const nextPage = () => {
  const totalPages = Math.ceil(totalItems.value / pageSize.value);
  if (currentPage.value < totalPages) {
    currentPage.value++;
    updatePageData();
  }
};

// 初始化时获取所有数据
onMounted(fetchAllData);
// onMounted(() => {
//   setInterval(updateRandomCircles, 10000); // 每10秒执行一次
// });
// 新方法，用于获取每种协同模式的数量
// function createPieChart(chartContainer, data) {
//   const chartInstance = echarts.init(chartContainer);
//   const taskCompletionRates = [90, 92, 94, 89, 99, 95, 98];
//   // 修改点击事件监听，调用 hideDrawer 函数
//   const chartOptions = {
//     tooltip: {
//       trigger: 'item',
//       formatter: function (params) {
//         const index = params.dataIndex;
//         const defaultContent = params.marker + params.name + ' : ' + params.value + '<br/>';
//         const additionalContent = '任务完成率: ' + taskCompletionRates[index] + '%<br/>';
//         return defaultContent + additionalContent;
//       },
//     },
//     series: [
//       {
//         type: 'pie',
//         data: data.map(item => ({ value: item.count, name: item.business_group_mode })),
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: 'rgba(0, 0, 0, 0.5)',
//           },
//         },
//       },
//     ],
//   };

//   chartInstance.setOption(chartOptions);
// }
function createPieChart(chartContainer, data) {
  const chartInstance = echarts.init(chartContainer);
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const modeData = data.find(item => item.business_group_mode === params.name);
        const completionRate = modeData?.completionRate ?? 'N/A';
        const failureRate = modeData?.failureRate ?? 'N/A';
        const defaultContent = `${params.marker}${params.name} : ${params.value}<br/>`;
        const additionalContent = `任务完成率: ${completionRate}<br/>故障发生率: ${failureRate}`;
        return defaultContent + additionalContent;
      },
    },
    series: [
      {
        type: 'pie',
        data: data.map(item => ({value: item.count, name: item.business_group_mode})),
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

const colors = ['#e6ccff', '#ccffcc', '#ffffcc', '#ccf5ff'];
const colorMap = new Map();
const linkscolors = ['red', 'green', 'blue', 'gray', 'black', 'purple', 'orange'];
const linkscolorMap = new Map();
const getColorByGroupId = (groupId) => {
  if (!colorMap.has(groupId)) {
    // 分配一个新颜色
    const color = colors[colorMap.size % colors.length];
    colorMap.set(groupId, color);
  }
  return colorMap.get(groupId);
};
const getColorByModeId = (modeId) => {
  if (!linkscolorMap.has(modeId)) {
    // 分配一个新颜色
    const color = linkscolors[linkscolorMap.size % linkscolors.length];
    linkscolorMap.set(modeId, color);
  }
  return linkscolorMap.get(modeId);
};
const refreshChartData = async () => {
  businessDirections.value = await fetchBusinessDirections();
  businessLocations.value = await fetchBusinessLocations();
  initializeChart(); // 重新初始化图表
};
const initializeChart = () => {
  // 创建或更新图表实例
  const chartInstance = echarts.init(taskLinkageInfo1.value);
  // 根据 businessLocations 和 businessDirections 更新图表配置
  const links = businessDirections.value.map(direction => {
    const sourceNode = `企业 ${direction.sourceId}`;
    const targetNode = `企业 ${direction.goalId}`;
    return {
      id: direction.locationId,
      source: sourceNode,
      target: targetNode,
      history: (direction.history || []).map(h => ({
        id: h.id, // 或者保持不变，取决于您的需求
        taskName: h.taskName,
        deliveryDate: h.deliveryDate,
        deliveryExperience: h.deliveryExperience

      })),

      lineStyle: {
        curveness: 0.2,
        color: getColorByModeId(direction.modeId)
      },
      tooltip: {
        formatter: `连线信息：企业${direction.sourceId} -> 企业${direction.goalId}<br>当前合作任务：${direction.taskId}<br>协同模式：${direction.mode}<br>点击连线查看历史合作记录`
      }
    };
  });
  console.log(links);

  const option = {
    tooltip: {},
    animationDurationUpdate: 50,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: 'none',
      symbolSize: 45,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [1, 5],
      edgeLabel: {
        fontSize: 10
      },
      data: businessLocations.value.map(location => ({
        name: `企业 ${location.businessId}`,
        x: location.x,
        y: location.y,
        itemStyle: {color: getColorByGroupId(location.businessGroupId)},
        tooltip: {
          formatter: `节点信息：<br/>${location.businessId}---${location.businessName}<br/>所属企业群编号：${location.businessGroupId}<br/>企业群：${location.businessGroupName}`
        }
      })),
      links: links,
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }

    }]

  };
  console.log("Business Locations:", businessLocations.value);
  console.log("Links:", links);
  chartInstance.on('click', (params) => {
    if (params.dataType === 'edge') {
      // 找到点击的连线对应的历史数据
      const clickedLink = businessDirections.value.find(d => `企业 ${d.sourceId}` === params.data.source && `企业 ${d.goalId}` === params.data.target);
      console.log("Clicked Link", clickedLink);

      // 确保找到了连线，并且该连线有历史数据
      if (clickedLink && clickedLink.history) {
        showDrawer({
          source: `企业 ${clickedLink.sourceId}`,
          target: `企业 ${clickedLink.goalId}`,
          history: clickedLink.history.map(h => ({
            id: h.id,
            taskName: h.taskName,
            deliveryDate: h.deliveryDate,
            deliveryExperience: h.deliveryExperience
          }))
        });
      }
    }
  });

  chartInstance.setOption(option);
};

</script>

<style scoped>
.star-rating {
  display: inline-block;
}

.star {
  font-size: 24px;
  color: gold;
  /* 或者你想要的星星颜色 */
}

.rectangle {
  width: 850px;
  height: 350px;
  /* 调整灰色长方形的高度 */
  background-color: hwb(0 100% 0%);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  padding: 10px;
  position: relative;
}

.circle {
  background-color: #FFCDD2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 18px;
  margin: 5px;
  position: absolute;
}

.app-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
}

.card {
  width: 100%;
  border: 10px solid #ccc; /* 添加边框样式 */
  border-radius: 8px; /* 可选：添加边框圆角 */
  overflow: hidden; /* 防止边框溢出内容 */
  margin-bottom: 10px;
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
  left: 610px;
  top: 255px;
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
  margin-top: 15px;
  text-align: center;
}

.table-container {
  height: 278px;
  /* 设置一个固定的高度，可以根据需要调整 */
  overflow-y: auto;
  /* 添加垂直滚动条，当表格数据超过容器高度时会显示滚动条 */
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

