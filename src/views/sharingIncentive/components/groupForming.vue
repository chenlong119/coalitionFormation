<template>
    <div>
      <el-select v-model="valueAuctionStatus" class="m-2"  filterable clearable placeholder="Select" size="small">
        <el-option
          v-for="item in optionsAuctionStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="valueChain" class="m-2" clearable placeholder="Select" size="small">
        <el-option
          v-for="item in optionsChain"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
              v-model="ValueDataRelease"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              autocomplete="off"
            ></el-date-picker>
      <el-button type="primary" @click="save">确 定</el-button>
      <el-table :data="dataFiltered" border stripe :header-cell-class-name="headerBg" max-height="300" :fit="true" >
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column label="序号" width="60">
            <template #header="{ column }">
              <div>{{ column.label }}</div>
            </template>
            <template v-slot="{ $index }">
              <div>{{ $index + 1 }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="taskName" label="数据需求" >
          </el-table-column>
          <el-table-column prop="taskReleaser" label="数据请求方" >
          </el-table-column>
          <el-table-column prop="dataRelease" label="发布日期" >
          </el-table-column>
         
          <el-table-column prop="taskState" label="拍卖状态" >
          </el-table-column>        
          
          
          <el-table-column label="所属产业链" prop="chain" >
          </el-table-column>

        </el-table> 
    </div>
  </template>
  <script setup>
  import  * as echarts from 'echarts'
  import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'


  const ValueDataRelease =ref('')
  const valueChain = ref('')
  const valueAuctionStatus = ref('')
  const optionsAuctionStatus = [
    {
      value: '已完成',
      label: '已完成',
    },
    {
      value: '进行中',
      label: '进行中',
    },
    {
      value: '待交付',
      label: '待交付',
    },
  ]
  const optionsChain = [
    {
      value: '家电产业链',
      label: '家电产业链',
    },
    {
      value: '汽车产业链',
      label: '汽车产业链',
    }
  ]
  function formattedFinishedData(){
if(ValueDataRelease.value){
const dataFinishDate = ValueDataRelease.value;

const formattedDate = `${dataFinishDate.getFullYear()}-${(dataFinishDate.getMonth() + 1).toString().padStart(2, '0')}-${dataFinishDate.getDate().toString().padStart(2, '0')}`;

ValueDataRelease.value =formattedDate  }
}

const dataInit=[
        { 
          taskName:'四月电池销量',
          taskReleaser:'小鸭家电',
          profit:10,
          dataRelease:"2023.5.1",
          dataFinish:"2023.6.1",
          taskState:'已完成',
          dataProviders: ['南孚电池', '超威电池'],
          dataProviderValues:['20','15'],
          dataProviderRates:[87,13],
          accepter: '南孚电池',
          chain:'汽车产业链',
          commentScore: 3,
          comment:'符合要求',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'五月A型芯片计划产量',
          taskReleaser:'小鸭家电',
          profit:50,
          dataRelease:"2023.4.12",
          dataFinish:"2022.4.13",
          taskState:'已完成',
          dataProviders: ['中兴公司', '台积电'],
          dataProviderValues:['85','15'],
          dataProviderRates:[68,32],
          accepter: '台积电' ,
          chain:'家电产业链',
          commentScore: 1,
          comment:'数据量偏小，不推荐',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'618家电类销售综合数据',
          taskReleaser:'小鸭家电',
          profit:100,
          dataRelease:"2023.2.1",
          dataFinish:"2022.2.12",
          taskState:'已完成',
          dataProviders: ['淘宝', '京东','拼多多'],
          dataProviderValues:['20','15','42'],
          dataProviderRates:[21,25,54],
          accepter: '京东' ,
          chain:'家电产业链',
          commentScore: 3,
          comment:'/',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'21年人力平均工资',
          taskReleaser:'小鸭家电',
          profit:30,
          dataRelease:"2022.9.16",
          dataFinish:"2023.9.16",
          taskState:'未完成',
          dataProviders: [],
          dataProviderValues:[],
          dataProviderRates:[],
          accepter: '无' ,
          chain:'家电产业链',
          commentScore: 2,
          comment:'/',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'双十一电视销售数据',
          taskReleaser:'闲鱼',
          profit:100,
          dataRelease:"2022.5.1",
          dataFinish:"2022.6.1",
          taskState:'已完成',
          dataProviders: ['小鸭家电', '苏宁家电',' 国美家电'],
          dataProviderValues:['20','15','23'],
          dataProviderRates:[56,13,31],
          accepter: '小鸭家电' ,
          chain:'家电产业链',
          commentScore: 3,
          comment:'/',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
          { 
          taskName:'六月橡胶销量',
          taskReleaser:'小鸭家电',
          profit:10,
          dataRelease:"2023.5.1",
          dataFinish:"2023.6.1",
          taskState:'待交付',
          dataProviders: ['三维股份', '震安科技'],
          dataProviderValues:['19','21'],
          dataProviderRates:[46,54],
          accepter: '南孚电池',
          chain:'家电产业链',
          commentScore: 4,
          comment:'符合要求',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
          ]
  let dataFiltered = dataInit;
  function save() {
    dataFiltered = dataInit;
    console.log("before",dataFiltered)
    formattedFinishedData();
  // 根据 valueAuctionStatus 进行筛选
  if (valueAuctionStatus.value) {
    console.log("i ama in valueAuctionStatus")
    dataFiltered = dataFiltered.filter(item => item.taskState  === valueAuctionStatus.value);
    // console.log("valueAuctionStatus",valueAuctionStatus.value)
    // console.log(dataFiltered[1].taskState)
    // console.log("after valueAuctionStatus",dataFiltered)
  }

  // 根据 valueChain 进行筛选
  if (valueChain.value) {
    console.log("i ama in valueChain")
    dataFiltered = dataFiltered.filter(item => item.chain === valueChain.value);
  }

  // 根据 valueDataRelease 进行筛选
  if (ValueDataRelease.value) {
    console.log("i ama in ValueDataRelease")
    dataFiltered = dataFiltered.filter(item => item.dataRelease === ValueDataRelease.value);
  }

  console.log("after",dataFiltered)
}



      
    onMounted(() => {
        });
  </script>
  
  <style scoped>
  /* .second{
    padding-top: 20px;
  } */
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .headerBg{
    background: #eee!important;
  }
  #echarts-line{
    height: 60vh;
    width: 100%;
  }
  #echarts-category{
    height: 40vh;
    width: 100%;
  }
  #echarts-access{
    height: 50vh;
    width: 100%;
  }
  #echarts-scatter{
    height: 50vh;
    width: 100%;
  }
  #echarts-pressure{
    height: 35vh;
    width: 100%;
  }
  </style>