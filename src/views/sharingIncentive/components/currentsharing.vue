<template>
  <body>
    <meta charSet="utf-8"/>

    <div id="titleDiv" class="titleDiv">
      当前系统数据共享拍卖
    </div>
    <div>
      <el-main tyle="width: 100%;">
          <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" :fit="true">
            <el-table-column type="selection" > <!--多选框-->
            </el-table-column>
            <el-table-column prop="taskName" label="数据需求" >
            </el-table-column>
            <el-table-column prop="taskReleaser" label="数据请求方" >
            </el-table-column>
            <el-table-column prop="fileSize" label="数据规模" >
            </el-table-column>
            <el-table-column prop="profit" label="起拍积分" >
            </el-table-column>
            <el-table-column prop="data" label="日期" >
            </el-table-column>、
            <el-table-column prop="remaintime" label="剩余时间(天)" >
            </el-table-column>
            <el-table-column prop="chain" label="所属产业链" >
            </el-table-column>
            <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="出价" placement="top" v-if="scope.row.userId !== 1">
                    <el-button link type="primary" icon="Edit" @click="openFileUploadDialog(scope.row)" ></el-button>
                    </el-tooltip>
                    <el-tooltip content="不再显示" placement="top" v-if="scope.row.userId !== 1">
                    <el-button link type="primary" icon="Delete" @click="negativeRecommendation(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
      </el-main>
    </div>
    <!-- 上传文件弹窗 -->
    <el-dialog title="出价" v-model="uploadDialogVisible" @close="closeFileUploadDialog" :width="dialogWidthSmall">
      <el-form label-width="110px" size="small">
        <el-form-item label="数据条数">
            <el-input v-model="numOfData" placeholder="请输入数据条数" clearable />
          </el-form-item>
          <el-form-item label="出价">
            <el-input   autocomplete="off"         
            v-model="bidPrice" placeholder="出价不低于15" clearable ></el-input>
          </el-form-item>
        </el-form>
      <div class="center-container">
        <!-- <el-upload
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
      >
        <el-button type="primary" size="medium" round icon="upload">上传数据</el-button>
      </el-upload> -->
        <el-button type="primary" size="medium" round @click="bid">确认出价</el-button>
      </div>
    </el-dialog>

    <el-row class="second" type="flex" justify="space_around">
        <el-col :span="12">
          <el-card shadow="hover">
            <div id="echarts-line" ref="echarts_access"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div id="echarts-category" ref="echarts_scatter"></div>
          </el-card>
        </el-col>
      </el-row>
      <div>
        <div class="center-container">
          <el-button type="info" icon="el-icon-search"  class="el-button" @click="showRecommendation">查看今日推荐</el-button>
        </div>
        <!-- 今日推荐弹窗 -->
        <el-dialog v-model="isRecommendationVisible" title="今日推荐" @close="hideRcommendation" 
        :width="dialogWidth" 
        :height="dialogHeight" >
          <el-table :data="gridData" border stripe :header-cell-class-name="headerBg" :fit="true">
              <el-table-column type="selection" > <!--多选框-->
              </el-table-column>
              <el-table-column prop="taskName" label="数据需求" >
              </el-table-column>
              <el-table-column prop="taskReleaser" label="数据请求方" >
              </el-table-column>
              <el-table-column prop="detail" label="详情" >
              </el-table-column>
              <el-table-column prop="profit" label="预期增益" >
              </el-table-column>
              <el-table-column prop="difficulty" label="难度" >
              </el-table-column>
              <el-table-column prop="probability" label="拍中概率(%)" >
              </el-table-column>
              <el-table-column prop="recomendation" label="推荐指数（%）" >
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                  <el-tooltip content="出价" placement="top" v-if="scope.row.userId !== 1">
                  <el-button link type="primary" icon="Edit" @click="openFileUploadDialog(scope.row)" ></el-button>
                  </el-tooltip>
                  <el-tooltip content="推荐有误" placement="top" v-if="scope.row.userId !== 1">
                  <el-button link type="primary" icon="Delete" @click="negativeRecommendation(scope.row)" ></el-button>
                  </el-tooltip>
              </template>
              </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    <!-- <el-row type="flex" justify="space-around">
      <el-col :span="24">
        <el-card shadow="hover">
          <div id="echarts-line"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around">
      <el-col :span="24">
        <el-card shadow="hover">
          <div id="echarts-category"></div>
        </el-card>
      </el-col>
    </el-row> -->


  </body>
</template>

<script setup>
let taskData = ref([]);
let taskDataFinished = ref([]);
let taskDataIng = ref([]);
let taskDataWaiting = ref([]);
import request from "@/utils/request";
import  * as echarts from 'echarts'
import { ref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus'
const tableData = ref([]);
const gridData = ref([]);
const uploadDialogVisible = ref(false);
const bidPrice = ref("");
const numOfData = ref("");

// function getAllTaskData(){
// const getLinks = async () => {
// const res = await request.get("/tasks/all");
// console.log(res);
// taskData.value = res;
// }; 
// }

const getAllTaskData=async()=>{
  const res = await request.get("/tasks/all");
// console.log(res);
taskData.value = res;
}

const getFinishedTaskData = async () => {
  const res = await request.get("/tasks/已完成");
  taskDataFinished.value = res;
}; 


const getIngTaskData = async () => {
const res = await request.get("/tasks/进行中");
taskDataIng.value = res;
}; 


const getWaitingTaskData = async () => {
const res = await request.get("/tasks/待交付");
taskDataWaiting.value = res;
}; 

function getTaskData(){
  getAllTaskData();
  getFinishedTaskData();
  getIngTaskData();
  getWaitingTaskData();
}
// function handleFocus() {
//       // 当文本框获得焦点时，清空提示文本
//       bidPrice.value = "";
//     };
// function handleBlur() {
//       // 当文本框失去焦点时，如果输入为空，则恢复提示文本
//       if (bidPrice.value !="出价不低于15") {
//         bidPrice.value = "出价不低于15";
//       }};

  const isPopupVisible = ref(false);
  const isRecommendationVisible = ref(false);

  const dialogWidthSmall = ref('20%');
  const dialogWidth = ref('90%'); // Set the width as a string (e.g., '500px', '50%')
  const dialogHeight = ref('500vh');
  const openFileUploadDialog = () => {
    uploadDialogVisible.value = true;
  };

  const closeFileUploadDialog = () => {
    uploadDialogVisible.value = false;
  };
  const showRecommendation = () => {
    isRecommendationVisible.value = true;
    console.log(taskData.value)
    console.log(taskDataFinished.value)
    console.log(taskDataIng.value)
    console.log(taskDataWaiting.value)
  };

  const hideRcommendation = () => {
    isRecommendationVisible.value = false;
  };
onMounted(async() => {

  getTaskData();
  createEchartsline1();
  createEchartscategory1();
  load();

  // await getLinks();
});
function negativeRecommendation(row){
  ElMessage.success('已收到，谢谢您的反馈！');
}
  function bid() {
    ElMessage.success('出价成功！详情请到历史拍卖中查看。');

  };
  function load(){
    const dataInit=[
        { 
          taskName:'四月电池销量',
          taskReleaser:'小鸭集团',
          fileSize:10,
          profit:10,
          data:"2022.5.1",
          remaintime:"12",
          chain:'家电产业链'
          },
        { 
          taskName:'五月A型芯片计划产量',
          taskReleaser:'小鸭集团',
          fileSize:10,
          profit:50,
          data:"2022.4.1",
          remaintime:"12",
          chain:'家电产业链'
          },
        { 
          taskName:'618家电类销售综合数据',
          taskReleaser:'小鸭集团',
          fileSize:50,
          profit:100,
          data:"2022.7.1",
          remaintime:"12",
          chain:'家电产业链'
          },
        { 
          taskName:'21年人力平均工资',
          taskReleaser:'小鸭集团',
          fileSize:20,
          profit:30,
          data:"2022.5.15",
          remaintime:"12",
          chain:'家电产业链'
          }
          ]
    const dataInit1=[
    { 
      taskName:'四月电池销量',
      taskReleaser:'小鸭集团',
      detail:"一份23年四月份一份某电池供应商的销量数据",
      profit:10,
      difficulty:'简单',
      probability:"95%",
      recomendation:'100%'
      },
    { 
      taskName:'五月A型芯片计划产量',
      taskReleaser:'比亚迪',
      detail:"一份23年五月份一份某公司A型芯片计划产量",
      profit:20,
      difficulty:"一般",
      probability:"80%",
      recomendation:"80%"
      },
    { 
      taskName:'21年人力平均工资',
      taskReleaser:'富士康劳务',
      detail:"一份21年的整年的公司整体综合劳务开支",
      profit:60,
      difficulty:"一般",
      probability:"70%",
      recomendation:"76.3%"
      },
    { 
      taskName:'618家电类销售综合数据',
      taskReleaser:'小鸭集团',
      detail:"一份23年618京东的家电类综合销售数据（可以提供某种类或者多种类，按照数据质量给出收益）",
      profit:"10~100",
      difficulty:"困难",
      probability:"50%",
      recomendation:"64.2%"
      },
  ]
    
    tableData.value=dataInit
    gridData.value=dataInit1
  };
  function createEchartsPressure1(){
    var chartDom = document.getElementById('echarts-pressure');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: '产业链总文件上传数量变化折线图',
        left:0,
        top:4
      },
      xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }
      ]
    };

    option && myChart.setOption(option);
  };
  function createEchartsscater1(){
    var chartDom = document.getElementById('echarts-scatter');
    var myChart = echarts.init(chartDom);
    var option;

            // Schema:
    // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
    const data20 = [
      [55, 9, 56, 0.46, 18, 6, 1],
      [25, 11, 21, 0.65, 34, 9, 2],
      [56, 7, 63, 0.3, 14, 5, 3],
      [33, 7, 29, 0.33, 16, 6, 4],
      [42, 24, 44, 0.76, 40, 16, 5],
      [82, 58, 90, 1.77, 68, 33, 6],
      [74, 49, 77, 1.46, 48, 27, 7],
      [78, 55, 80, 1.29, 59, 29, 8],
      [267, 216, 280, 4.8, 108, 64, 9],
      [185, 127, 216, 2.52, 61, 27, 10],
      [39, 19, 38, 0.57, 31, 15, 11],
      [41, 11, 40, 0.43, 21, 7, 12],
      [64, 38, 74, 1.04, 46, 22, 13],
      [108, 79, 120, 1.7, 75, 41, 14],
      [108, 63, 116, 1.48, 44, 26, 15],
      [33, 6, 29, 0.34, 13, 5, 16],
      [94, 66, 110, 1.54, 62, 31, 17],
      [186, 142, 192, 3.88, 93, 79, 18],
      [57, 31, 54, 0.96, 32, 14, 19],
      [22, 8, 17, 0.48, 23, 10, 20],
      [39, 15, 36, 0.61, 29, 13, 21],
      [94, 69, 114, 2.08, 73, 39, 22],
      [99, 73, 110, 2.43, 76, 48, 23],
      [31, 12, 30, 0.5, 32, 16, 24],
      [42, 27, 43, 1, 53, 22, 25],
      [154, 117, 157, 3.05, 92, 58, 26],
      [234, 185, 230, 4.09, 123, 69, 27],
      [160, 120, 186, 2.77, 91, 50, 28],
      [134, 96, 165, 2.76, 83, 41, 29],
      [52, 24, 60, 1.03, 50, 21, 30],
      [46, 5, 49, 0.28, 10, 6, 31]
    ];
    const data21 = [
      [26, 37, 27, 1.163, 27, 13, 1],
      [85, 62, 71, 1.195, 60, 8, 2],
      [78, 38, 74, 1.363, 37, 7, 3],
      [21, 21, 36, 0.634, 40, 9, 4],
      [41, 42, 46, 0.915, 81, 13, 5],
      [56, 52, 69, 1.067, 92, 16, 6],
      [64, 30, 28, 0.924, 51, 2, 7],
      [55, 48, 74, 1.236, 75, 26, 8],
      [76, 85, 113, 1.237, 114, 27, 9],
      [91, 81, 104, 1.041, 56, 40, 10],
      [84, 39, 60, 0.964, 25, 11, 11],
      [64, 51, 101, 0.862, 58, 23, 12],
      [70, 69, 120, 1.198, 65, 36, 13],
      [77, 105, 178, 2.549, 64, 16, 14],
      [109, 68, 87, 0.996, 74, 29, 15],
      [73, 68, 97, 0.905, 51, 34, 16],
      [54, 27, 47, 0.592, 53, 12, 17],
      [51, 61, 97, 0.811, 65, 19, 18],
      [91, 71, 121, 1.374, 43, 18, 19],
      [73, 102, 182, 2.787, 44, 19, 20],
      [73, 50, 76, 0.717, 31, 20, 21],
      [84, 94, 140, 2.238, 68, 18, 22],
      [93, 77, 104, 1.165, 53, 7, 23],
      [99, 130, 227, 3.97, 55, 15, 24],
      [146, 84, 139, 1.094, 40, 17, 25],
      [113, 108, 137, 1.481, 48, 15, 26],
      [81, 48, 62, 1.619, 26, 3, 27],
      [56, 48, 68, 1.336, 37, 9, 28],
      [82, 92, 174, 3.29, 0, 13, 29],
      [106, 116, 188, 3.628, 101, 16, 30],
      [118, 50, 0, 1.383, 76, 11, 31]
    ];
    const data22 = [
      [91, 45, 125, 0.82, 34, 23, 1],
      [65, 27, 78, 0.86, 45, 29, 2],
      [83, 60, 84, 1.09, 73, 27, 3],
      [109, 81, 121, 1.28, 68, 51, 4],
      [106, 77, 114, 1.07, 55, 51, 5],
      [109, 81, 121, 1.28, 68, 51, 6],
      [106, 77, 114, 1.07, 55, 51, 7],
      [89, 65, 78, 0.86, 51, 26, 8],
      [53, 33, 47, 0.64, 50, 17, 9],
      [80, 55, 80, 1.01, 75, 24, 10],
      [117, 81, 124, 1.03, 45, 24, 11],
      [99, 71, 142, 1.1, 62, 42, 12],
      [95, 69, 130, 1.28, 74, 50, 13],
      [116, 87, 131, 1.47, 84, 40, 14],
      [108, 80, 121, 1.3, 85, 37, 15],
      [134, 83, 167, 1.16, 57, 43, 16],
      [79, 43, 107, 1.05, 59, 37, 17],
      [71, 46, 89, 0.86, 64, 25, 18],
      [97, 71, 113, 1.17, 88, 31, 19],
      [84, 57, 91, 0.85, 55, 31, 20],
      [87, 63, 101, 0.9, 56, 41, 21],
      [104, 77, 119, 1.09, 73, 48, 22],
      [87, 62, 100, 1, 72, 28, 23],
      [168, 128, 172, 1.49, 97, 56, 24],
      [65, 45, 51, 0.74, 39, 17, 25],
      [39, 24, 38, 0.61, 47, 17, 26],
      [39, 24, 39, 0.59, 50, 19, 27],
      [93, 68, 96, 1.05, 79, 29, 28],
      [188, 143, 197, 1.66, 99, 51, 29],
      [174, 131, 174, 1.55, 108, 50, 30],
      [187, 143, 201, 1.39, 89, 53, 31]
    ];
    const lineStyle = {
      width: 1,
      opacity: 0.5
    };
    option = {
      backgroundColor: '#161627',
      title: {
        text: '产业链近年上传文件情况',
        left: 'left',
        textStyle: {
          color: '#eee'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        bottom: 25,
        data: ['2020', '2021', '2022'],
        itemGap: 20,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        selectedMode: 'single'
      },
      radar: {
        indicator: [
          { name: '小鸭集团', max: 300 },
          { name: '比亚迪', max: 250 },
          { name: '南孚电池', max: 300 },
          { name: '富士康劳务', max: 5 },
          { name: '京东', max: 200 },
          { name: '台积电', max: 100 }
        ],
        shape: 'circle',
        splitNumber: 5,
        axisName: {
          color: 'rgb(238, 197, 102)'
        },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(238, 197, 102, 0.1)',
              'rgba(238, 197, 102, 0.2)',
              'rgba(238, 197, 102, 0.4)',
              'rgba(238, 197, 102, 0.6)',
              'rgba(238, 197, 102, 0.8)',
              'rgba(238, 197, 102, 1)'
            ].reverse()
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(238, 197, 102, 0.5)'
          }
        }
      },
      series: [
        {
          name: '2020',
          type: 'radar',
          lineStyle: lineStyle,
          data: data20,
          symbol: 'none',
          itemStyle: {
            color: '#F9713C'
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: '2021',
          type: 'radar',
          lineStyle: lineStyle,
          data: data22,
          symbol: 'none',
          itemStyle: {
            color: '#B3E4A1'
          },
          areaStyle: {
            opacity: 0.05
          }
        },
        {
          name: '2022',
          type: 'radar',
          lineStyle: lineStyle,
          data: data21,
          symbol: 'none',
          itemStyle: {
            color: 'rgb(238, 197, 102)'
          },
          areaStyle: {
            opacity: 0.05
          }
        }
      ]
    };
    option && myChart.setOption(option);
  };
  function createEchartsAccess1(){
    var chartDom = document.getElementById('echarts-access');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: '产业链当前上传文件省份分布',
        left:20,
        top:4
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        // top: '5%',
        // left: 'center'
        orient: 'horizontal',
        bottom: '0'
      },
      series: [
        {
          name: '文件数',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 8, name: '江苏' },
            { value: 8, name: '安徽' },
            { value: 5, name: '浙江' },
            { value: 8, name: '河南' },
            { value: 8, name: '山东' },
            { value: 5, name: '河北' },
          ]
        }
      ]
    };
    option && myChart.setOption(option);
  };
  function createEchartscategory1(){
    var chartDom = document.getElementById('echarts-category');
    var myChart = echarts.init(chartDom);
    var option;
    const currentDate = new Date();
    const dateArray = [];
for (let i = 6; i >= 0; i--) {
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - i);
  const formattedDate = `${pastDate.getMonth() + 1}-${pastDate.getDate()}`;
  dateArray.push(formattedDate);
}

    option = {
      title: {
        text: '近一周产业链数据共享变化图'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['原材料供应企业', '零部件供应企业', '加工企业', '经销企业', '售后企业'],
        top: 28,    // 设置图例距离顶部的距离
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dateArray
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '原材料供应企业',
          type: 'line',
          stack: 'Total',
          data: [12, 132, 101, 134, 90, 30, 210]
        },
        {
          name: '零部件供应企业',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 11, 234, 290, 330, 310]
        },
        {
          name: '加工企业',
          type: 'line',
          stack: 'Total',
          data: [150, 22, 201, 154, 190, 330, 10]
        },
        {
          name: '经销企业',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 30, 330, 320]
        },
        {
          name: '售后企业',
          type: 'line',
          stack: 'Total',
          data: [820, 932, 901,   34, 190, 1330, 1320]
        }
      ]
    };

    option && myChart.setOption(option);
  };
  function createEchartsline1(){
    var chartDom = document.getElementById('echarts-line');
    var myChart = echarts.init(chartDom);
    var option;
    const currentDate = new Date();

// 生成过去7天的日期数组
const dateArray = [];
for (let i = 6; i >= 0; i--) {
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - i);
  const formattedDate = `${pastDate.getMonth() + 1}-${pastDate.getDate()}`;
  dateArray.push(formattedDate);
}

    option = {
      title: {
        text: '近一周产业链数据提供变化图'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['原材料供应企业', '零部件供应企业', '加工企业', '经销企业', '售后企业'],
        top: 28,    // 设置图例距离顶部的距离
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dateArray
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '原材料供应企业',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '零部件供应企业',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '加工企业',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '经销企业',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '售后企业',
          type: 'line',
          stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };

    option && myChart.setOption(option);


  };

</script>

<style>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh; /* 如果需要垂直居中，设置父容器高度为视口高度 */
}
.el-button {
  /* 添加你的自定义样式，使其更精美 */
  background-color: #1890ff; /* 设置背景色 */
  color: #fff; /* 设置文字颜色 */
  border: none; /* 移除边框 */
  border-radius: 4px; /* 添加边框圆角 */
  /* ... 其他样式 */
}


html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#timeSlider {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 20px;
}

.titleDiv {
    font-size: 30px; 

  font-weight: 600;
  text-align: center;
}

#loadexcel {
  position: absolute;
  top:100px;
  left: 100px;
}
#echarts-line{
  height: 40vh;
  width: 100%;
}
#echarts-category{
  height: 40vh;
  width: 100%;
}
#echarts-access{
  height: 35vh;
  width: 100%;
}
#echarts-scatter{
  height: 35vh;
  width: 100%;
}
#echarts-pressure{
  height: 35vh;
  width: 100%;
}
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px; /* 调整按钮之间的间距 */
}
</style>
