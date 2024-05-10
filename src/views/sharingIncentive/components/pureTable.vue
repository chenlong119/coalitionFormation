<template>
  <div>
    <!-- <el-dropdown>
      <span class="el-dropdown-link">
        选择企业群
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled>比亚迪 秦 汽车能源供给合作数据共享组</el-dropdown-item>
          <el-dropdown-item>比亚迪 汉 汽车能源供给合作数据共享组</el-dropdown-item>
          <el-dropdown-item>比亚迪 宋 汽车能源供给合作数据共享组</el-dropdown-item>
          <el-dropdown-item >比亚迪 海鸥 汽车能源供给合作数据共享组</el-dropdown-item>
          <el-dropdown-item divided>比亚迪 海豚 汽车能源供给合作数据共享组</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
    <el-row>
        <el-col :span="16"   >
<div style="display: flex;align-items: center;">
<span class="font">当前所在群组：</span>
<el-button type="text"  style="font-size: medium;  font-weight: 600;    font-size: 23px; 
">{{ currentGroup }}</el-button>
</div>
</el-col>
    </el-row>
    <el-dialog v-model="isDetailVis" title="查看详情" width="30%" center>
      <el-form  :inline="true"  label-width="68px">
        <el-form-item label="数据名称" prop="motivationTaskName">
            <el-input
              v-model="currentDataName"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
              disabled
            />
        </el-form-item>
        <el-form-item label="上传时间" style="width: 308px">
            <el-date-picker
              v-model="currentUploadTime"
              value-format="YYYY-MM-DD"
              type="date"
              range-separator="-"
              disabled
            ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isDetailVis = false">取消</el-button>
          <el-button type="primary" @click="isDownloadVisFunc()">
            下载
          </el-button>
        </span>
      </template>
    </el-dialog>


    <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><calendar /></el-icon>
            <span>
              群内企业
            </span>
          </span>
        </template>
        <el-form :model="queryParams" ref="queryRef" :inline="true"  label-width="68px">
       <el-form-item label="企业名称" prop="motivationTaskName">
          <el-input
             v-model="queryParams.motivationTaskName"
             placeholder="请输入企业名称"
             clearable
             style="width: 240px"
             @keyup.enter="handleQuery"
          />
       </el-form-item>
       <el-form-item label="累计上传" prop="valuechain">
        <el-select 
        v-model="queryParams.valueChain"  
        placeholder="累计上传数据"
        class="m-2" clearable  size="small">
            <el-option
              v-for="item in optionsChain"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
       </el-form-item>
       <el-form-item label="信誉等级" prop="status">
          <el-select
             v-model="queryParams.status"
             placeholder="信誉等级"
             clearable
             style="width: 240px"
          >
             <el-option
             v-for="item in optionsAuctionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
             />
          </el-select>
       </el-form-item>
       <el-form-item label="加入时间" style="width: 308px">
          <el-date-picker
             v-model="dateRange"
             value-format="YYYY-MM-DD"
             type="date"
             range-separator="-"
              placeholder="选择日期"
          ></el-date-picker>
       </el-form-item>
       <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
       </el-form-item>

    </el-form>
      <el-table :data="companyData" border stripe :header-cell-class-name="headerBg"  max-height="500" :fit="true">
        <el-table-column type="selection" width="65"> <!--多选框-->
        </el-table-column>
        <el-table-column prop="companyName" label="企业名称" >
        </el-table-column>
        <el-table-column prop="joinTime" label="加入时间" >
        </el-table-column>
        <el-table-column prop="sumData" label="累计上传数据" >
        </el-table-column>
        <el-table-column prop="averageScore" label="数据均分" >
        </el-table-column> 
        <el-table-column prop="incomePercent" label="预期收益占比(%)" >
        </el-table-column>  
        <el-table-column prop="creditLevel" label="信誉等级" >
        </el-table-column>   
      </el-table> 
      </el-tab-pane>
      <el-tab-pane label="当前共享">
        <el-form :model="queryParams" ref="queryRef" :inline="true"  label-width="68px">
       <el-form-item label="数据名称" prop="motivationTaskName">
          <el-input
             v-model="queryParams.motivationTaskName"
             placeholder="请输入数据名称"
             clearable
             style="width: 240px"
             @keyup.enter="handleQuery"
          />
       </el-form-item>
       <el-form-item label="提供方" prop="valuechain">
        <el-select 
        v-model="queryParams.valueChain"  
        placeholder="数据提供方"
        class="m-2" clearable  size="small">
            <el-option
              v-for="item in optionsChain"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
       </el-form-item>
       <el-form-item label="信誉等级" prop="status">
          <el-select
             v-model="queryParams.status"
             placeholder="信誉等级"
             clearable
             style="width: 240px"
          >
             <el-option
             v-for="item in optionsAuctionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
             />
          </el-select>
       </el-form-item>
       <el-form-item label="上传时间" style="width: 308px">
          <el-date-picker
             v-model="dateRange"
             value-format="YYYY-MM-DD"
             type="date"
             range-separator="-"
              placeholder="选择日期"
          ></el-date-picker>
       </el-form-item>
       <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
       </el-form-item>

    </el-form>
        <el-table :data="dataTableAvailable" border stripe :header-cell-class-name="headerBg"  max-height="500" :fit="true">
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="dataName" label="数据名称" >
          </el-table-column>
          <el-table-column prop="dataReleaser" label="数据提供方" >
          </el-table-column>
          <el-table-column prop="dataDate" label="上传日期" >
          </el-table-column>
          <el-table-column prop="hisClick" label="历史点击量" >
          </el-table-column>    
          <el-table-column prop="recClick" label="最近点击量" >
          </el-table-column> 
          <el-table-column prop="hisDonload" label="历史下载量" >
          </el-table-column>  
          <el-table-column prop="recDonload" label="最近下载量" >
          </el-table-column> 
          <el-table-column label="所属产业链" prop="chain" >
          </el-table-column>
          <el-table-column label="历史评分" align=“center” >  
            <!-- 添加自定义模板 --> 
            <template #default="scope"> 
              <el-tooltip class="item" effect="dark" :content="scope.row.hisComment" placement="top">
                <el-rate v-model="scope.row.hisScore" disabled> 
                </el-rate> 
              </el-tooltip>
            </template> 
          </el-table-column>
          <el-table-column label="最近评分" align=“center” prop="recScore"> 
            <!-- 添加自定义模板 --> 
            <template #default="scope"> 
              <el-tooltip class="item" effect="dark" :content="scope.row.recComment" placement="top">
                <el-rate v-model="scope.row.recScore" disabled> 
                </el-rate> 
              </el-tooltip>
            </template> 
          </el-table-column>
          <el-table-column label="查看详情" align="center"  class-name="small-padding fixed-width">
            <template #default="scope"> 
              <el-button link type="primary" icon="Edit" @click="isDetailVisFunc(scope.row)" ></el-button>
            </template> 

        </el-table-column>
        <el-table-column label="评分评论" align="center"  class-name="small-padding fixed-width">
          <el-button link type="primary" icon="Edit" @click="openFileUploadDialog" ></el-button>
        </el-table-column>
        </el-table> 
      </el-tab-pane>
      <el-tab-pane label="我的共享">
        <el-form :model="queryParams" ref="queryRef" :inline="true"  label-width="68px">
       <el-form-item label="数据名称" prop="motivationTaskName">
          <el-input
             v-model="queryParams.motivationTaskName"
             placeholder="请输入数据名称"
             clearable
             style="width: 240px"
             @keyup.enter="handleQuery"
          />
       </el-form-item>
       <el-form-item label="提供方" prop="valuechain">
        <el-select 
        v-model="queryParams.valueChain"  
        placeholder="数据提供方"
        class="m-2" clearable  size="small">
            <el-option
              v-for="item in optionsChain"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
       </el-form-item>
       <el-form-item label="信誉等级" prop="status">
          <el-select
             v-model="queryParams.status"
             placeholder="信誉等级"
             clearable
             style="width: 240px"
          >
             <el-option
             v-for="item in optionsAuctionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
             />
          </el-select>
       </el-form-item>
       <el-form-item label="上传时间" style="width: 308px">
          <el-date-picker
             v-model="dateRange"
             value-format="YYYY-MM-DD"
             type="date"
             range-separator="-"
              placeholder="选择日期"
          ></el-date-picker>
       </el-form-item>
       <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
       </el-form-item>

    </el-form>
        <el-table :data="dataTableSelf" border stripe :header-cell-class-name="headerBg"  max-height="500" :fit="true">
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="dataName" label="数据名称" >
          </el-table-column>
          <el-table-column prop="dataDate" label="上传日期" >
          </el-table-column>
          <el-table-column prop="hisClick" label="历史点击量" >
          </el-table-column>    
          <el-table-column prop="recClick" label="最近点击量" >
          </el-table-column> 
          <el-table-column prop="hisDonload" label="历史下载量" >
          </el-table-column>  
          <el-table-column prop="recDonload" label="最近下载量" >
          </el-table-column> 
          <el-table-column label="历史评分" align=“center” >  
            <!-- 添加自定义模板 --> 
            <template #default="scope"> 
              <el-tooltip class="item" effect="dark" :content="scope.row.hisComment" placement="top">
                <el-rate v-model="scope.row.hisScore" disabled> 
                </el-rate> 
              </el-tooltip>
            </template> 
          </el-table-column>
          <el-table-column label="最近评分" align=“center” prop="recScore"> 
            <!-- 添加自定义模板 --> 
            <template #default="scope"> 
              <el-tooltip class="item" effect="dark" :content="scope.row.recComment" placement="top">
                <el-rate v-model="scope.row.recScore" disabled> 
                </el-rate> 
              </el-tooltip>
            </template> 
          </el-table-column>
        <el-table-column label="重新上传" align="center"  class-name="small-padding fixed-width">
          <el-button link type="primary" icon="Edit" @click="openFileUploadDialog" ></el-button>
        </el-table-column>
        </el-table> 
      </el-tab-pane>
      <!-- <el-tab-pane label="Task">Task</el-tab-pane> -->
    </el-tabs>


    <el-dialog title="评分与评论" width="400px" v-model="showCommentDialogVisible" @close="closeShowCommentDialog">
    <el-form :model="commentFormData" label-position="top">
      <el-form-item label="评分">
        <el-rate v-model="commentFormData.score" :max="5" :allow-half="true"></el-rate>
      </el-form-item>
      <el-form-item label="评论">
        <el-input type="textarea" v-model="commentFormData.comment"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeShowCommentDialog">取消</el-button>
      <el-button type="primary" @click="closeShowCommentDialog">确定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import  * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
let currentGroup = ref('比亚迪 秦 汽车能源供给合作数据共享组');
let queryParams = ref({
valueChain: undefined,
pageNum: 1,
  pageSize: 10,
  dictName: undefined,
  dictType: undefined,
  status: undefined
})
////////////////////////////////////////////////////
const isDetailVis = ref(false);
const currentDataName =ref(null);
const currentUploadTime =ref(null);
const currentCompany =ref("小鸭集团");
const isdownload =ref(false);
const selectedReleaser = ref(null);
const selectedRow1 = ref(null);
const selectedRow=reactive({dataName:'四月电池销量',
          dataReleaser:'小鸭集团',
          dataDate:"2022.5.1",
          hisClick:'已完成',
          recClick: ['南孚电池', '超威电池'],
          hisDonload:['20','15'],
          recDonload:[87,13],
          chain: '南孚电池',
          hisComment:'家电产业链',
          hisScore: 3,
          recComment:'符合要求',
          recScore: 8});
function isDetailVisFunc(row){
selectedRow1.value = row;
    Object.keys(row).forEach((key) => {
        selectedRow[key] = row[key];

      });
    nextTick(() => {
  console.log("selectedRow updated:", selectedRow);})

// const hisdownload = parseInt(row.hisDonload);
// console.log("hisdownload  "
// )
// console.log(hisdownload)
// row.hisDonload = hisdownload +1
// console.log("row.hisDonload after")
// console.log(row.hisDonload)
row.hisClick = parseInt(row.hisClick)+1
row.recClick = parseInt(row.recClick)+1

selectedReleaser.value=row.dataReleaser;
currentDataName.value = row.dataName;
currentUploadTime.value =row.dataDate;
isDetailVis.value= true;

}
function isDownloadVisFunc(){  
selectedRow1.value.hisDonload = parseInt(selectedRow1.value.hisDonload) +1
selectedRow1.value.recDonload = parseInt(selectedRow1.value.recDonload) +1

isdownload.value=true;
ElMessage.success('下载成功！');


}




/////////////////////////////////////////////////
/////showCommentDialogVisible///////////////////

let commentFormData = ref({
  score: 0,
      comment: '',
});
const showCommentDialogVisible = ref(false);
const openFileUploadDialog = () => {
  if(isdownload.value == true){
      showCommentDialogVisible.value = true;
  }else{
    ElMessage.warning('您需要下载之后才能评论！');
  }

};

const closeShowCommentDialog = () => {
showCommentDialogVisible.value = false;
};
///////////////////////////////////////////////////////


const tablename = ref(null);
const tableData = ref([]);
const dataTable = ref([]);
const dataTableSelf = ref([]);
const dataTableAvailable = ref([]);
const companyData =ref([]);

function load() {  //加载
    tablename.value='上传记录表'
    const dataInit=[
      { 
        taskName:'四月电池销量',
        taskReleaser:'小鸭集团',
        profit:10,
        dataRelease:"2023.5.1",
        dataFinish:"2023.6.1",
        taskState:'已完成',
        dataProviders: ['南孚电池', '超威电池'],
        dataProviderValues:['20','15'],
        dataProviderRates:[87,13],
        accepter: '南孚电池',
        chain:'家电产业链',
        commentScore: 3,
        comment:'符合要求',
        enterpriseRelationshipStrength: 8,
        sharedPointsGain: 20,
        continuousSharingRewards: 15,
        afterSalesEvaluationGain: 5
        },
      { 
        taskName:'五月A型芯片计划产量',
        taskReleaser:'小鸭集团',
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
        taskReleaser:'小鸭集团',
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
        taskReleaser:'小鸭集团',
        profit:30,
        dataRelease:"2022.9.16",
        dataFinish:"/",
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
        dataProviders: ['小鸭集团', '苏宁家电',' 国美家电'],
        dataProviderValues:['20','15','23'],
        dataProviderRates:[56,13,31],
        accepter: '小鸭集团' ,
        chain:'家电产业链',
        commentScore: 3,
        comment:'/',
        enterpriseRelationshipStrength: 8,
        sharedPointsGain: 20,
        continuousSharingRewards: 15,
        afterSalesEvaluationGain: 5
        },
        ]

    const dataNow=[
      { 
        dataName: '一季度轮胎销售数据',
        dataReleaser: '玲珑轮胎',
        dataDate: '2023-01-01',
        hisClick: 100,
        recClick: 20,
        hisDonload: 50,
        recDonload: 10,
        chain: '汽车产业链',
        hisScore: 5,
        hisComment: '品质不错',
        recScore: 3,
        recComment: '数据量偏小'
      },
      {
        dataName: '21年人力平均工资',
        dataReleaser: '小鸭集团',
        dataDate: '2023-02-01',
        hisClick: 150,
        recClick: 30,
        hisDonload: 70,
        recDonload: 15,
        chain: '汽车产业链',
        hisScore: 4,
        hisComment: '质量不错！',
        recScore: 3,
        recComment: '张总来点新的数据！',
      },
      {
      dataName: '3月份预计220v电池产量',
      dataReleaser: '南孚电池',
      dataDate: '2023-03-15',
      hisClick: 120,
      recClick: 25,
      hisDonload: 60,
      recDonload: 12,
      chain: '家电产业链',
      hisScore: 4.5,
      hisComment: '不错的数据',
      recScore: 3.2,
      recComment: '值得关注',
    },
    {
      dataName: '2022年一线工人工资支付详情',
      dataReleaser: '富士康',
      dataDate: '2023-04-10',
      hisClick: 110,
      recClick: 22,
      hisDonload: 55,
      recDonload: 11,
      chain: '家电产业链',
      hisScore: 4.2,
      hisComment: '数据量大',
      recScore: 3.5,
      recComment: '建议下载',
    },
    {
      dataName: '2023下半年预计钢铁提供信息',
      dataReleaser: '首都钢铁公司',
      dataDate: '2023-05-05',
      hisClick: 130,
      recClick: 28,
      hisDonload: 65,
      recDonload: 13,
      chain: '汽车产业链',
      hisScore: 4.8,
      hisComment: '高质量数据',
      recScore: 3.0,
      recComment: '有点小问题',
    },
    {
      dataName: '618家电基本购买情况与分析',
      dataReleaser: '小鸭集团',
      dataDate: '2023-06-20',
      hisClick: 105,
      recClick: 21,
      hisDonload: 52,
      recDonload: 10,
      chain: '家电产业链',
      hisScore: 4.0,
      hisComment: '一般般',
      recScore: 3.8,
      recComment: '值得推荐',
    }
  ]
        const dataCompany=[        {
        companyName: '小鸭集团',
        joinTime: '2023-01-01',
        sumData: 100,
        averageScore: 4.5,
        incomePercent:10,
        creditLevel:3,
      },
      {
        companyName: '比亚迪',
        joinTime: '2023-02-15',
        sumData: 150,
        averageScore: 3.8,
        incomePercent:20,
        creditLevel:3,
      },
      {
        companyName: '南孚电池',
        joinTime: '2023-03-01',
        sumData: 100,
        averageScore: 4.5,
        incomePercent:30,
        creditLevel:3,
      },
      {
        companyName: '玲珑轮胎',
        joinTime: '2023-03-16',
        sumData: 150,
        averageScore: 3.8,
        incomePercent:40,
        creditLevel:3,
      },
      {
        companyName: '首都钢铁公司',
        joinTime: '2023-03-16',
        sumData: 150,
        averageScore: 3.8,
        incomePercent:40,
        creditLevel:3,
      },
    ]
    tableData.value=dataInit
    dataTable.value=dataNow
    companyData.value=dataCompany
    dataTableSelf.value = dataTable.value.filter(item => item.dataReleaser === '小鸭集团');
    dataTableAvailable.value = dataTable.value.filter(item => item.dataReleaser !== '小鸭集团');
    console.log(dataTableSelf.value)
};
 
  setInterval(() =>{
    for(let index in companyData.value){
      // console.log("before");
      // console.log(companyData.value[index].creditLevel);
      if(companyData.value[index].companyName === selectedReleaser.value ){
      const valueNow = companyData.value[index].creditLevel;

        const randomCreditLevel = Math.floor(Math.random() * (5-valueNow)) + 1+valueNow;
      companyData.value[index].creditLevel = randomCreditLevel;
      if(companyData.value[index].creditLevel >= 5){
        companyData.value[index].creditLevel = 5
      }
      selectedReleaser.value = null;
      }

      // console.log("after");
      // console.log(companyData.value[index].creditLevel);

    }
    // console.log(companyData.value)
  }, 1000 )   


onMounted(() => {
  load();


  });


</script>

<style scoped>
.demo-tabs > .el-tabs__content {
padding: 32px;
color: #6b778c;
font-size: 32px;
font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
vertical-align: middle;
margin-left: 4px;
}
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
.custom-dialog {
/* 自定义样式 */
width: 400px; /* 设置宽度 */
}

/* 自定义 footer 样式 */
.custom-dialog .dialog-footer {
text-align: right;
}

/* 自定义关闭按钮样式 */
.custom-dialog .el-button {
margin-left: 10px;
}

.font{
font-weight: 600;
margin-bottom: 4px;
font-size: 23px;
align-items: center;
}
</style>