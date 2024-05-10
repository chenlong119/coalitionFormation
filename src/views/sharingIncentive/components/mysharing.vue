<template>
  <div>
    <el-main tyle="width: 100%;">

      <el-row>
          <el-col :span="6">
            <div style="display: flex;align-items: center;">
                <span class="font">当前登录企业：</span>
                <el-button type="text"  style="font-size: medium;font-weight: 600;    font-size: 23px;">{{ currentCompany }}</el-button>
            </div>
          </el-col>
      </el-row>
  <el-form :model="queryParams" ref="queryRef" :inline="true"  label-width="68px">
        <el-form-item label="共享状态" prop="status">
          <el-select v-model="valueAuctionStatus" class="m-2"  filterable clearable placeholder="Select" size="small">
          <el-option
            v-for="item in optionsAuctionStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
         </el-form-item>
         <el-form-item label="产业链" prop="valuechain">
              <el-select v-model="valueChain" class="m-2" clearable placeholder="Select" size="small">
              <el-option
                v-for="item in optionsChain"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
         </el-form-item>

         <el-form-item label="创建时间" style="width: 308px">
          <el-date-picker
                v-model="ValueDataRelease"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                autocomplete="off"
              ></el-date-picker>
         </el-form-item>
         <el-form-item>
          <el-button type="primary" icon="Search" @click="filtering">筛      选</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
         <el-form-item>
          <el-button class="ml-5" type="primary" @click="showPopup">新增共享<i class="el-icon-circle-plus-outline"></i> </el-button>
         </el-form-item>
      </el-form>

      <!-- 跳转的菜单 -->
      <!-- <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="已经结束" name="first"></el-tab-pane>
      <el-tab-pane label="进行中" name="second"></el-tab-pane>
      <el-tab-pane label="等待交付" name="third"></el-tab-pane>
    </el-tabs>
      </div> -->
      <el-dialog v-model="byAfterAuctionVisible" title="提示">
    <template #default>
      <el-dialog
        v-model="innerVisible"
        width="30%"
        title="购买成功！"
        append-to-body
      />
      <div>您目前还没有权限下载！</div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="byAfterAuctionVisible = false">取消</el-button>
        <el-button type="primary" @click="innerVisible = true">
         购买
        </el-button>
      </div>
    </template>
  </el-dialog>
       
      <!-- 修改之前已经完成的表格界面 -->
      <el-table :data="dataFiltered" border stripe :header-cell-class-name="headerBg" max-height="240" :fit="true" >
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
          <el-table-column prop="dataFinish" label="完成日期" >
            <template #header="{ column }">
              <el-tooltip effect="dark" content="这里是悬浮内容" placement="top-start">
                <span>{{ column.label }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="taskState" label="共享状态" >
          </el-table-column>        
          <el-table-column label="数据提供方" align="center">
            <template #default="scope">
              <el-tooltip class="item" effect="dark" placement="top">
                <template #content>
                  <!-- 显示 dataProviders 数组中的每个元素 -->
                  <el-tag v-for="(item, index) in scope.row.dataProviders" :key="index" type="success">{{ item }}</el-tag>
                </template>
                <!-- <div>1</div> -->
                <div>{{ scope.row.dataProviders.length }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="加权增益数值">
            <template #default="scope">
              <el-link @click="showProfitDetails(scope.row)">{{ calculateWeightedGain(scope.row) }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="所属产业链" prop="chain" >
          </el-table-column>
          <el-table-column label="评价" align=“center”> 
            <!-- 添加自定义模板 --> 
            <template #default="scope"> 
              <el-tooltip class="item" effect="dark" :content="scope.row.comment" placement="top">
                <el-rate v-model="scope.row.commentScore" disabled> 
                </el-rate> 
              </el-tooltip>
            </template> 
          </el-table-column>
          <el-table-column label="查看详情" align="center"  class-name="small-padding fixed-width">
            <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="showDataDetails(scope.row)" ></el-button>
            </template>

            <!-- <template #default="scope">
                <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                </el-tooltip>
            </template> -->
            
          </el-table-column>
        </el-table> 
    <!-- 上传文件弹窗 -->
    <el-dialog title="出价" v-model="uploadDialogVisible" @close="closeFileUploadDialog" :width="dialogWidthSmall">
      <el-form label-width="110px" size="small">
        <el-form-item label="数据条数">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出价">
            <el-input   autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      <div class="button-container">
        <!-- <el-upload
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
      >
        <el-button type="primary" size="medium" round icon="upload">上传数据</el-button>
      </el-upload> -->
      <div class="center-container">
        <el-button style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;" @click="uploadFile">确认修改</el-button>
      </div>
    </div>
        
    </el-dialog>

      <el-dialog title="数据上传情况" v-model="isDatadetailVisible" @close="hideDataDetails" class="custom-dialog">
        <el-table :data="dataProvidersInfo" border stripe :header-cell-class-name="headerBg"  max-height="300" :fit="true" >
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="provider" label="企业名称" >
          </el-table-column>
          <el-table-column prop="value" label="出价" >
          </el-table-column>
          <el-table-column prop="dataName" label="数据名称" >
          </el-table-column>
          <el-table-column label="查看详情" align="center"  class-name="small-padding fixed-width">
            <template #default="scope">
            <el-button type="text" icon="el-icon-download" @click="downloadSucc">下载</el-button>
            </template>         
          </el-table-column>
        </el-table> 
      <div class="center-container">
        <el-button @click="showModifyAuction()" 
        style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;">
        重新发布拍卖</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDataDetails">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="拍卖确认" v-model=" isAuctionConfirmVis" @close="hideDataDetails" class="custom-dialog">
        <el-table :data="dataProvidersInfo" border stripe :header-cell-class-name="headerBg"  max-height="300" :fit="true" >
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="provider" label="企业名称" >
          </el-table-column>
          <el-table-column prop="value" label="最终出价" >
          </el-table-column>
          <el-table-column prop="dataName" label="数据名称" >
          </el-table-column>
          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
            <template #default="scope">
            <el-button type="text" icon="el-icon-download" @click="tradeDone">确认交易</el-button>
            </template>         
          </el-table-column>
        </el-table> 
    </el-dialog>
    <el-dialog title="拍卖详情" v-model="isAuctiondetailVisible" @close="hideAuctionDetails" class="custom-dialog">
      <div>
        <h4>当前报价：103</h4>
        <h3>历史报价：</h3>
        <ul>
          <li v-for="(dataItem, index) in auctionHistory" :key="index" class="data-item">
            <div class="data-name">日期：{{ dataItem.date }}</div>
            <div class="data-name">数据条数：{{ dataItem.number }}</div>
            <div class="uploaded-company">拍卖报价: {{ dataItem.money }}</div>
            <el-button type="text" icon="el-icon-download" @click="downloadData(dataItem)">查看</el-button>
          </li>
        </ul>
      </div>
      <div class="center-container">
        <el-button @click="openFileUploadDialog()" 
        style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;">
        修改出价</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDataDetails">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="交付详情" v-model="isPaymentdetailVisible" @close="hidePaymentDetails" class="custom-dialog">
      <div>
        <h4>中拍信息： </h4>
        <ul>            <div class="data-name">日期：2023.10.12</div>
            <div class="data-name">数据条数：12</div>
            <div class="uploaded-company">拍卖报价: 103</div></ul>

        <h3>历史报价：</h3>
        <ul>
          <li v-for="(dataItem, index) in auctionHistory" :key="index" class="data-item">
            <div class="data-name">日期：{{ dataItem.date }}</div>
            <div class="data-name">数据条数：{{ dataItem.number }}</div>
            <div class="uploaded-company">拍卖报价: {{ dataItem.money }}</div>
            <el-button type="text" icon="el-icon-download" @click="downloadData(dataItem)">查看</el-button>
          </li>
        </ul>
      </div>
      <div class="center-container">
        <el-upload
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
      >
        <el-button type="primary" size="medium" round icon="upload">确认交易并上传数据</el-button>
      </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDataDetails">关闭</el-button>
      </span>
    </el-dialog>
      <el-dialog title="详细信息" v-model="isProfitVisible" @close="hideProfitDetails" class="custom-dialog">
        <div v-if="selectedRow">
          <p>参与企业：</p>
          <ul>
            <li v-for="(provider, index) in selectedRow.dataProviders">
              {{ provider }} - {{ selectedRow.dataProviderValues[index] }} - {{ selectedRow.dataProviderRates[index] }}%
            </li>
          </ul>
        </div>
      </el-dialog>
      <div style="padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[ 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
      <el-dialog title="新添拍卖任务" width="50%" v-model="isPopupVisible"  @close="hidePopup">
        <el-form label-width="110px" size="small" id="addAuctionForm">
          <el-form-item label="数据需求">
            <el-input v-model="AuctionTaskForm.taskName" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="数据规模">
            <el-input v-model="AuctionTaskForm.comment" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="所属产业链">
            <el-input v-model="AuctionTaskForm.chain" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="起拍价">
            <el-input v-model="AuctionTaskForm.profit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="AuctionTaskForm.dataFinish"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              autocomplete="off"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="截止日期">
            <el-input v-model="AuctionTaskForm.dataFinish" autocomplete="off"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePopup">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改拍卖任务" width="50%" v-model="isModifyAuctionVisible"  @close="hideModifyAuctionp">
        <el-form label-width="110px" size="small">
          <el-form-item label="数据需求">
            <el-input v-model="AuctionTaskForm.taskName" autocomplete="off"></el-input>
          </el-form-item> 
          <!-- <el-form-item label="数据规模">
            <el-input v-model="AuctionTaskForm.comment" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="所属产业链">
            <el-input v-model="AuctionTaskForm.chain" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="起拍价">
            <el-input v-model="AuctionTaskForm.profit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="AuctionTaskForm.dataFinish"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              autocomplete="off"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hideModifyAuction">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>


      <el-row class="second" type="flex" justify="space_around">
        <el-col :span="12">
          <el-card shadow="hover">
            <!-- <div id="echarts-access" ref="echarts_access"></div> -->
            <!-- <div id="echarts-new" ref="echarts_new"></div> -->
            <div id="echarts-line" ref="echarts_line"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <!-- <div id="income-chartHis" ref="income_chartHis"></div> -->
            <div id="income-chart" ref="income_chart"></div>
            <!-- <div id="echarts-scatter" ref="echarts_scatter"></div> -->
          </el-card>
        </el-col>
        <!-- <el-col :span="12">
          <el-card shadow="hover">
            <div id="echarts-scatter" ref="echarts_scatter"></div>
          </el-card>
        </el-col> -->
      </el-row>
    </el-main>
  </div>
</template>
<script setup>
import request from "@/utils/request";
import  * as echarts from 'echarts'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
const uploadDialogVisible = ref(false);
const activeName =ref('first');
const openFileUploadDialog = () => {
    uploadDialogVisible.value = true;
  };

const closeFileUploadDialog = () => {
    uploadDialogVisible.value = false;
  };
  function uploadFile() {
    ElMessage.success('修改成功！');

  };
let form = ref({
  taskName: '',
  taskReleaser: '',
  fileSize: '',
  profit: '',
  chain: '',
  network: [],
  relation: [],
  x: -1,
  y: -1,
  deleted: false
});
let AuctionTaskForm = ref({
  taskName: '',
  taskReleaser: '',
  profit: 0,
  dataRelease: '',
  dataFinish: '',
  taskState: '',
  dataProviders: '',
  dataProviderValues: '',
  dataProviderRates: '',
  accepter: '',
  chain: '',
  commentScore: 0,
  comment: '',
  enterpriseRelationshipStrength: 0,
  sharedPointsGain: 0,
  continuousSharingRewards: 0,
  afterSalesEvaluationGain: 0,
  dataNames:''
});
const dataList= reactive([  // 写死的数据示例
        { dataName: '南孚电池4月电池销量', uploadedCompany: '南孚电池' },
        { dataName: '超威电池4月电池销量', uploadedCompany: '超威电池' },
        // 添加更多数据项
      ]);
const auctionHistory = reactive([  // 写死的数据示例
        { date: '2023.10.11', number: '12', money: '102' },
        { date: '2023.10.12', number: '12',money: '103' },
        // 添加更多数据项
      ]);
const tablename = ref(null);
const tableData = ref([]);

const dataFiltered =ref([]);
const allData = ref([]);

const finishedData =ref([]);
const ingData =ref([]);
const awaitData =ref([]);
const uploadData=ref([])

const getAllTaskData = async () => {
  const res = await request.get("/tasks/all");
  // 将字符串字段解析为数组
  res.forEach(task => {
    task.dataProviderRates = JSON.parse(task.dataProviderRates);
    task.dataProviderValues = JSON.parse(task.dataProviderValues);
    // console.log("dataProvidersAll",task.dataProviders)
    task.dataProviders = JSON.parse(task.dataProviders);
    // console.log("taskNamesAll",task.dataNames)
    task.dataNames = JSON.parse(task.dataNames);
    // 其他需要处理的字段也可以在这里添加
  });


  allData.value = res;
  dataFiltered.value=allData.value;
// console.log(allData.value)
// console.log(tableData.value)
}; 


const getFinishedTaskData = async () => {
  const res = await request.get("/tasks/已完成");
    // 将字符串字段解析为数组
    res.forEach(task => {
    task.dataProviderRates = JSON.parse(task.dataProviderRates);
    task.dataProviderValues = JSON.parse(task.dataProviderValues);
    task.dataProviders = JSON.parse(task.dataProviders);
    // console.log("taskNames",task.dataNames)
    task.dataNames = JSON.parse(task.dataNames);
    // 其他需要处理的字段也可以在这里添加
  });

  finishedData.value = res;
  console.log(finishedData.value[1].dataFinish)
};


const getIngTaskData = async () => {
const res = await request.get("/tasks/进行中");
  // 将字符串字段解析为数组
  res.forEach(task => {
    task.dataProviderRates = JSON.parse(task.dataProviderRates);
    task.dataProviderValues = JSON.parse(task.dataProviderValues);
    task.dataProviders = JSON.parse(task.dataProviders);
    task.dataNames = JSON.parse(task.dataNames);
    // 其他需要处理的字段也可以在这里添加
  });


ingData.value = res;
}; 


const getWaitingTaskData = async () => {
const res = await request.get("/tasks/待交付");
  // 将字符串字段解析为数组
  res.forEach(task => {
    task.dataProviderRates = JSON.parse(task.dataProviderRates);
    task.dataProviderValues = JSON.parse(task.dataProviderValues);
    task.dataProviders = JSON.parse(task.dataProviders);
    task.dataNames = JSON.parse(task.dataNames);
    // 其他需要处理的字段也可以在这里添加
  });


awaitData.value = res;
}; 

//////////////////////////////////////////////////filtering//////////////////////////////////////////
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
    {
      value: '',
      label: '--',
    }
  ]
  const optionsChain = [
    {
      value: '家电产业链',
      label: '家电产业链',
    },
    {
      value: '汽车产业链',
      label: '汽车产业链',
    },
    {
      value: '',
      label: '--',
    }
  ]
function formattedDateData(){
if(ValueDataRelease.value){
const dataFinishDate = ValueDataRelease.value;

const formattedDate = `${dataFinishDate.getFullYear()}-${(dataFinishDate.getMonth() + 1).toString().padStart(2, '0')}-${dataFinishDate.getDate().toString().padStart(2, '0')}`;

ValueDataRelease.value =formattedDate  }
}

function resetQuery(){
  dataFiltered.value=allData.value;

}
function filtering() {
    // getAllTaskData();
    dataFiltered.value=allData.value;
    console.log("before",allData.value)
    // console.log("before",ingData.value)

    
    console.log("before",dataFiltered.value)
    formattedDateData();
  // 根据 valueAuctionStatus 进行筛选
  if (valueAuctionStatus.value) {
    console.log("i ama in valueAuctionStatus")
    dataFiltered.value = dataFiltered.value.filter(item => item.taskState  === valueAuctionStatus.value);
    valueAuctionStatus.value=''
  }

  // 根据 valueChain 进行筛选
  if (valueChain.value) {
    console.log("i ama in valueChain")
    dataFiltered.value = dataFiltered.value.filter(item => item.chain === valueChain.value);
    valueChain.value=''
  }

  // 根据 valueDataRelease 进行筛选
  if (ValueDataRelease.value) {
    console.log("i ama in ValueDataRelease")
    dataFiltered.value = dataFiltered.value.filter(item => item.dataRelease === ValueDataRelease.value);
    ValueDataRelease.value=''
  }

  console.log("after",dataFiltered.value)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////定义筛选当前用户是否购买//////////////////////////////////////////////
let currentCompany = ref('小鸭集团');

//////////////////////////////////////////////////////////////
function getTaskData(){
  getAllTaskData();
  // filtering();
  getFinishedTaskData();
  getIngTaskData();
  getWaitingTaskData();
};
function formattedFinishedData(){
const dataFinishDate = AuctionTaskForm.value.dataFinish;

const formattedDate = `${dataFinishDate.getFullYear()}-${(dataFinishDate.getMonth() + 1).toString().padStart(2, '0')}-${dataFinishDate.getDate().toString().padStart(2, '0')}`;

AuctionTaskForm.value.dataFinish =formattedDate  
}

function addAuction(){
  const addAuction1 = async () => {


// const dataFinishDate = AuctionTaskForm.value.dataFinish;

// const formattedDate = `${dataFinishDate.getFullYear()}-${(dataFinishDate.getMonth() + 1).toString().padStart(2, '0')}-${dataFinishDate.getDate().toString().padStart(2, '0')}`;

// AuctionTaskForm.value.dataFinish =formattedDate   
formattedFinishedData();

// 获取当前系统时间的 Date 对象
const currentDate = new Date();

// 获取年、月、日等信息
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // 月份从 0 开始，所以要加 1
const day = currentDate.getDate();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();

// 构建格式化的时间字符串
const formattedDateCurrent = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} `;
AuctionTaskForm.value.dataRelease =formattedDateCurrent   

AuctionTaskForm.value.taskReleaser="小鸭集团"
AuctionTaskForm.value.taskState="进行中"

  const res = await request.post("/tasks/add",AuctionTaskForm.value 
  );
    // 检查状态码
    if (res.status >= 200 && res.status < 300) {
      // 成功的情况
      console.log("Auction added successfully");
      // 这里可以添加其他成功的逻辑
    } else {
      // 失败的情况
      console.error("Failed to add auction");
      // 这里可以添加其他失败的逻辑
    }
  // } catch (error) {
  //   // 捕获异常，例如网络错误
  //   console.error("Error while adding auction:", error.message);
  //   // 这里可以添加其他处理逻辑
  // }   
  };
  addAuction1();

}
const isModifyAuctionVisible =ref(false);
const isPopupVisible = ref(false);
const isProfitVisible = ref(false);
const selectedRow=reactive({taskName:'四月电池销量',
          taskReleaser:'小鸭集团',
          profit:10,
          data:"2022.5.1",
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
          afterSalesEvaluationGain: 5,
          dataNames:['南孚电池4月电池销量', '超威电池4月电池销量'],
        
        });
// 初始化 dataProvidersInfo
const dataProvidersInfo = selectedRow.dataProviders.map((provider, index) => ({
  provider,
  value: selectedRow.dataProviderValues[index],
  rate: selectedRow.dataProviderRates[index],
  dataName: selectedRow.dataNames[index],
}));
  const showPopup = () => {
    isPopupVisible.value = true;

  };
  const showModifyAuction = () => {
    isModifyAuctionVisible.value = true;
  };
  const hideModifyAuction = () => {
    isModifyAuctionVisible.value = false;
  };
  const showProfitDetails = (row) =>{
    console.log(selectedRow);
    // selectedRow = row;
      // Object.assign(selectedRow, row);
      Object.keys(row).forEach((key) => {
          selectedRow[key] = row[key];

        });
      nextTick(() => {
    console.log("selectedRow updated:", selectedRow);
    isProfitVisible.value = true;
  });  


    };
  const hideProfitDetails = () => {
    isProfitVisible.value = false;
  };

  const hidePopup = () => {
    isPopupVisible.value = false;
  };
const echarts_line = ref(null);
const echarts_access = ref(null);
const echarts_scatter = ref(null);
const echarts_new = ref(null);
const income_chartHis = ref(null);
const income_chartPol = ref(null);
const income_chart =ref(null);
const tableDataAdd=ref([
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
])
const dialogWidth = ref('90%'); // Set the width as a string (e.g., '500px', '50%')
const dialogHeight = ref('500vh');


  onMounted(() => {

  createEchartsline1();
  // createincomechartHistogram();
  createincomechart();
  // createincomechartPolylines();

  // createEchartsscater1();


  getTaskData() ;
  load();

  // clasifytdata();
  });

const isAuctionConfirmVis = ref(false)
const isDatadetailVisible = ref(null);
const isAuctiondetailVisible = ref(null);
const isPaymentdetailVisible = ref(null);
const showDataDetails = (row) =>{
  if(row.taskState === '已完成'){
  Object.keys(row).forEach((key) => {
          selectedRow[key] = row[key];
        });
      nextTick(() => {
    console.log("selectedRow updated:", selectedRow);
    console.log(dataProvidersInfo);
    dataProvidersInfo.forEach((info, index) => {
    info.provider = selectedRow.dataProviders[index];
    info.value = selectedRow.dataProviderValues[index];
    info.rate = selectedRow.dataProviderRates[index];
    info.dataName = selectedRow.dataNames[index];
  });

  console.log("dataProvidersInfo updated:",dataProvidersInfo);
    
  });
  isDatadetailVisible.value = true;
  }else if(row.taskState === '进行中'){
      ElMessage.warning('拍卖还未结束，请耐心等待！');
  }else{
    Object.keys(row).forEach((key) => {
          selectedRow[key] = row[key];
        });
      nextTick(() => {
    console.log("selectedRow updated:", selectedRow);
    console.log(dataProvidersInfo);
    dataProvidersInfo.forEach((info, index) => {
    info.provider = selectedRow.dataProviders[index];
    info.value = selectedRow.dataProviderValues[index];
    info.rate = selectedRow.dataProviderRates[index];
    info.dataName = selectedRow.dataNames[index];
  });

  console.log("dataProvidersInfo updated:",dataProvidersInfo);
    
  });
  isAuctionConfirmVis.value = true;
  }
  

};
const hideDataDetails = () => {
    isDatadetailVisible.value = false;
  };
const showAuctionDetails = () =>{
  isAuctiondetailVisible.value = true;
    };
const hideAuctionDetails = () => {
  isAuctiondetailVisible.value = false;
  }; 
const showPaymentDetails = () =>{
  isPaymentdetailVisible.value = true;
    };
const hidePaymentDetails = () => {
  isPaymentdetailVisible.value = false;
  }; 
  function downloadData(dataItem) {
    // if(currentCompany.value === )
      // 处理下载数据的逻辑
      console.log('下载数据:', dataItem.dataName);
      ElMessage.success('下载成功！');
    };
  const byAfterAuctionVisible = ref(false)
  const innerVisible = ref(false)
    function downloadSucc() {
      // 处理下载数据的逻辑
      // console.log("selectedRow.accepter",selectedRow.taskReleaser)
      // console.log("currentCompany.value",currentCompany.value)
      if(selectedRow.taskReleaser===currentCompany.value){
              ElMessage.success('下载成功！');
      }else{
        byAfterAuctionVisible.value = true
  }}
  function tradeDone() {
      // 处理下载数据的逻辑
      // console.log("selectedRow.accepter",selectedRow.taskReleaser)
      // console.log("currentCompany.value",currentCompany.value)
  
              ElMessage.success('交易成功！');

    };

  function expendauction(){
    ElMessage.success('已经重新发布！');
  };
  function delBatch(){
    //批量删除
    let ids=this.multipleSelection.map(v =>v.id)   //[{} ,{} ,{}] =>[1,2,3]
    console.log(ids)
    this.request.post("/evaporation-merge/del/batch",ids).then(res=>{
      if(res){
        this.$message.success("批量删除成功!")
        this.load()
      }else{
        this.$message.error("批量删除失败!")
      }
    })
  };
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
          { 
          taskName:'六月橡胶销量',
          taskReleaser:'小鸭集团',
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
      // tableData.value=dataInit
  };
  function clasifytdata() {
    finishedData.value=tableData.value.filter(item => item.taskState === '已完成');
    ingData.value=tableData.value.filter(item => item.taskState === '未完成');
    awaitData.value=tableData.value.filter(item => item.taskState === '待交付');
  };
  function save(){  //保存

      // 使用 setTimeout 给异步操作一些时间

    addAuction();




  };
  function l(Station_Number){  //删除

    console.log(Station_Number)
    this.request.delete("/evaporation-merge/"+Station_Number).then(res=>{
      if(res){
        this.$message.success("删除成功!")
        this.dialogFormVisible=false
        this.load()
      }else{
        this.$message.error("删除失败!")
      }
    })
  };
  function exp(){  //导出
    console.log(this.tableData)
    var year = this.tableData[0]['year']
    var num = this.pageSize
    this.request.get("/evaporation-merge/export",{params:{year:year,Num:num}}).then(res=>{
      // 导出成功后显示消息提示框
      Message.success({
        message: '导出 Excel 数据成功！，请到D盘根目录查看',
        showClose: true,  // 是否显示关闭按钮
        duration: 3000     // 持续时间（毫秒）
      });
    }).catch(error => {
      // 导出失败后显示错误提示框
      Message.error({
        message: '导出 Excel 数据失败，请重试！',
        showClose: true,  // 是否显示关闭按钮
        duration: 3000     // 持续时间（毫秒）
      });
    });
  };
  function importSuccess(){
    this.$message.success("导入成功")
    this.load()
  };
  function reset(){
    // const axios = require('axios');  //调用axios获取api数据
    // //var url = "https://api.epmap.org/api/v1/air/station?pubtime=2022-8-4&station_code=1409A";//接口后台允许跨域了,否则获取不到数据
    // var url="https://api.epmap.org/api/v1/air/station_list"
    // axios.get(url
    //     ,{
    //   headers:{
    //      'Authorization':'APPCODE 6918864e8f774be196a00e406e987db7',
    //   }
    // }
    // ).then((response) => {
    //       console.log(response,response.data.result);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    this.time=""
    this.Station_Number=""
    this.load()
  };
  function handleSizeChange(pageSize) {    //页面最大条数
    console.log(pageSize)
    this.pageSize = pageSize
    this.load()
  };
  function handleCurrentChange(pageNum) {   //第几页
    console.log(pageNum)
    this.pageNum = pageNum
    this.load()
  };
  function calculateWeightedGain(row) {
  // 在这里计算加权增益数值
  // 示例：假设计算逻辑是简单的加总
  const weightedGain = row.dataProviders.reduce((total, provider, index) => {
    return total + (row.dataProviderValues[index] * row.dataProviderRates[index] / 100);
  }, 0);


  // 使用 toFixed 保留一位小数并将结果转换为浮点数
  return parseFloat(weightedGain.toFixed(1));
}
  function createEchartsscater1(){

    // 获取当前日期
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // 月份从0开始，需要加1

// 生成过去6个月的月份数组
const monthArray = [];
for (let i = 6; i > 0; i--) {
  const pastMonth = currentMonth - i;
  const pastYear = currentYear - Math.floor((pastMonth - 1) / 12);
  const formattedMonth = `${pastYear}-${(pastMonth % 12 === 0 ? 12 : pastMonth % 12)
    .toString()
    .padStart(2, '0')}`;
  monthArray.push(formattedMonth);
}
        const myChart = echarts.init(echarts_scatter.value);
        const option = {
          title: {
            text: '近6个月收益变化表',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {          
            orient: 'vertical',
            // bottom: '2%',
            // padding: 1
            },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: monthArray
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '数据请求支出',
              type: 'bar',
              stack: 'inout',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '数据提供获得',
              type: 'bar',
              stack: 'inout',
              emphasis: {
                focus: 'series'
              },
              data: [220, 182, 191, 234, 290, 330, 310]
            },
  
            {
              name: '总计收益',
              type: 'bar',
              data: [862, 1018, 964, 1026, 1679, 1600, 1570],
              emphasis: {
                focus: 'series'
              },
              markLine: {
                lineStyle: {
                  type: 'dashed'
                },
                data: [[{ type: 'min' }, { type: 'max' }]]
              }
            },
            {
              name: '上游供应商',
              type: 'bar',
              barWidth: 5,
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
              name: '人力资源',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
              name: '线下零售',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
              name: '电商零售',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [62, 82, 91, 84, 109, 110, 120]
            }
          ]
        };
  
        myChart.setOption(option);
  
      };
  function createEchartsAccess1(){
    const myChart = echarts.init(echarts_access.value);
    const option  = {
      title: {
        text: '近6个月数据共享产业链分布图',
        // left:0,
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
            { value: 38, name: '上游供应商' },
            { value: 8, name: '人力资源' },
            { value: 25, name: '线下零售' },
            { value: 18, name: '电商零售' },
            // { value: 8, name: '山东' },
            // { value: 5, name: '河北' },
          ]
        }
      ]
    };
    myChart.setOption(option);
  };
  function createEchartsline1(){
    const myChart = echarts.init(echarts_line.value);
    const option = {
      title: {
        text: '近6个月的数据请求和数据提供数量变化曲线'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {          
        orient: 'horizontal',
        bottom: '0'},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['三月', '四月', '五月', '六月', '七月', '八月', '九月']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} '
        }
      },
      series: [
        {
          name: '请求',
          type: 'line',
          data: [10, 11, 13, 11, 12, 12, 9],
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }]
          }
        },
        {
          name: '提供',
          type: 'line',
          data: [1, 2, 2, 5, 3, 2, 0],
          markPoint: {
            data: [{ name: '近期最低', value: -2, xAxis: 1, yAxis: -1.5 }]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
              [
                {
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                },
                {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: 'Max'
                  },
                  type: 'max',
                  name: '最高点'
                }
              ]
            ]
          }
        }
      ]
    };

    myChart.setOption(option);

  };
  function createEchartsline2(){

const currentDate = new Date();

// 生成过去7天的日期数组
const dateArray = [];
for (let i = 6; i >= 0; i--) {
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - i);
  const formattedDate = `${pastDate.getMonth() + 1}-${pastDate.getDate()}`;
  dateArray.push(formattedDate);
}
const myChart = echarts.init(echarts_new.value);


const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  xAxis: [
    {
      type: 'category',
      data:dateArray,
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Precipitation',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: 'Temperature',
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: '{value} °C'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml';
        }
      },
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ]
    },
    {
      name: 'Precipitation',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' ml';
        }
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' °C';
        }
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
};
myChart.setOption(option);



  };
  function createincomechartHistogram(){        
    const myChart = echarts.init(income_chartHis.value);
var dataMap = {};
function dataFormatter(obj) {
  // prettier-ignore
  var pList = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'];
  var temp;
  for (var year = 2002; year <= 2011; year++) {
    var max = 0;
    var sum = 0;
    temp = obj[year];
    for (var i = 0, l = temp.length; i < l; i++) {
      max = Math.max(max, temp[i]);
      sum += temp[i];
      obj[year][i] = {
        name: pList[i],
        value: temp[i]
      };
    }
    obj[year + 'max'] = Math.floor(max / 100) * 100;
    obj[year + 'sum'] = sum;
  }
  return obj;
}
// prettier-ignore
dataMap.dataGDP = dataFormatter({
    //max : 60000,
    2011: [16251.93, 11307.28, 24515.76, 11237.55, 14359.88, 22226.7, 10568.83, 12582, 19195.69, 49110.27, 32318.85, 15300.65, 17560.18, 11702.82, 45361.85, 26931.03, 19632.26, 19669.56, 53210.28, 11720.87, 2522.66, 10011.37, 21026.68, 5701.84, 8893.12, 605.83, 12512.3, 5020.37, 1670.44, 2102.21, 6610.05],
    2010: [14113.58, 9224.46, 20394.26, 9200.86, 11672, 18457.27, 8667.58, 10368.6, 17165.98, 41425.48, 27722.31, 12359.33, 14737.12, 9451.26, 39169.92, 23092.36, 15967.61, 16037.96, 46013.06, 9569.85, 2064.5, 7925.58, 17185.48, 4602.16, 7224.18, 507.46, 10123.48, 4120.75, 1350.43, 1689.65, 5437.47],
    2009: [12153.03, 7521.85, 17235.48, 7358.31, 9740.25, 15212.49, 7278.75, 8587, 15046.45, 34457.3, 22990.35, 10062.82, 12236.53, 7655.18, 33896.65, 19480.46, 12961.1, 13059.69, 39482.56, 7759.16, 1654.21, 6530.01, 14151.28, 3912.68, 6169.75, 441.36, 8169.8, 3387.56, 1081.27, 1353.31, 4277.05],
    2008: [11115, 6719.01, 16011.97, 7315.4, 8496.2, 13668.58, 6426.1, 8314.37, 14069.87, 30981.98, 21462.69, 8851.66, 10823.01, 6971.05, 30933.28, 18018.53, 11328.92, 11555, 36796.71, 7021, 1503.06, 5793.66, 12601.23, 3561.56, 5692.12, 394.85, 7314.58, 3166.82, 1018.62, 1203.92, 4183.21],
    2007: [9846.81, 5252.76, 13607.32, 6024.45, 6423.18, 11164.3, 5284.69, 7104, 12494.01, 26018.48, 18753.73, 7360.92, 9248.53, 5800.25, 25776.91, 15012.46, 9333.4, 9439.6, 31777.01, 5823.41, 1254.17, 4676.13, 10562.39, 2884.11, 4772.52, 341.43, 5757.29, 2703.98, 797.35, 919.11, 3523.16],
    2006: [8117.78, 4462.74, 11467.6, 4878.61, 4944.25, 9304.52, 4275.12, 6211.8, 10572.24, 21742.05, 15718.47, 6112.5, 7583.85, 4820.53, 21900.19, 12362.79, 7617.47, 7688.67, 26587.76, 4746.16, 1065.67, 3907.23, 8690.24, 2338.98, 3988.14, 290.76, 4743.61, 2277.35, 648.5, 725.9, 3045.26],
    2005: [6969.52, 3905.64, 10012.11, 4230.53, 3905.03, 8047.26, 3620.27, 5513.7, 9247.66, 18598.69, 13417.68, 5350.17, 6554.69, 4056.76, 18366.87, 10587.42, 6590.19, 6596.1, 22557.37, 3984.1, 918.75, 3467.72, 7385.1, 2005.42, 3462.73, 248.8, 3933.72, 1933.98, 543.32, 612.61, 2604.19],
    2004: [6033.21, 3110.97, 8477.63, 3571.37, 3041.07, 6672, 3122.01, 4750.6, 8072.83, 15003.6, 11648.7, 4759.3, 5763.35, 3456.7, 15021.84, 8553.79, 5633.24, 5641.94, 18864.62, 3433.5, 819.66, 3034.58, 6379.63, 1677.8, 3081.91, 220.34, 3175.58, 1688.49, 466.1, 537.11, 2209.09],
    2003: [5007.21, 2578.03, 6921.29, 2855.23, 2388.38, 6002.54, 2662.08, 4057.4, 6694.23, 12442.87, 9705.02, 3923.11, 4983.67, 2807.41, 12078.15, 6867.7, 4757.45, 4659.99, 15844.64, 2821.11, 713.96, 2555.72, 5333.09, 1426.34, 2556.02, 185.09, 2587.72, 1399.83, 390.2, 445.36, 1886.35],
    2002: [4315, 2150.76, 6018.28, 2324.8, 1940.94, 5458.22, 2348.54, 3637.2, 5741.03, 10606.85, 8003.67, 3519.72, 4467.55, 2450.48, 10275.5, 6035.48, 4212.82, 4151.54, 13502.42, 2523.73, 642.73, 2232.86, 4725.01, 1243.43, 2312.82, 162.04, 2253.39, 1232.03, 340.65, 377.16, 1612.6]
});
// prettier-ignore空调产业链
dataMap.dataPI = dataFormatter({
    //max : 4000,
    2011: [-136.27, -159.72, -2905.73, -641.42, 136.27, 159.72, 2905.73, 641.42, 0,0,],
    2010: [124.36, 145.58, 2562.81, 554.48, 1095.28, 1631.08, 1050.15, 1302.9, 1114.15, 2540.1, 1360.56, 1729.02],
    2009: [118.29, 128.85, 2207.34, 477.59, 929.6, 1414.9, 980.57, 1154.33, 1113.82, 2261.86, 1163.08, 1495.45],
    2008: [112.83, 122.58, 2034.59, 313.58, 907.95, 1302.02, 916.72, 1088.94, 1111.8, 2100.11, 1095.96, 1418.09],
    2007: [101.26, 110.19, 1804.72, 311.97, 762.1, 1133.42, 783.8, 915.38, 1101.84, 1816.31, 1986.02, 1200.18],
    2006: [88.8, 103.35, 1461.81, 276.77, 634.94, 939.43, 672.76, 750.14, 1193.81, 1545.05, 1925.1, 1011.03],
    2005: [88.68, 112.38, 1400, 262.42, 589.56, 882.41, 625.61, 684.6, 1190.26, 1461.51, 1892.83, 966.5],
    2004: [87.36, 105.28, 1370.43, 276.3, 522.8, 798.43, 568.69, 605.79, 1183.45, 1367.58, 1814.1, 950.5],
    2003: [84.11, 89.91, 1064.05, 215.19, 420.1, 615.8, 488.23, 504.8, 1181.02, 1162.45, 1717.85, 749.4],
    2002: [82.44, 84.21, 956.84, 197.8, 374.69, 590.2, 446.17, 474.2, 1179.68, 1110.44, 685.2, 783.66]
});
// prettier-ignore
dataMap.dataSI = dataFormatter({
    //max : 26600,
    2011: [3752.48, 5928.32, 13126.86, 6635.26, 8037.69, 12152.15, 5611.48, 5962.41, 5927.89, 5203.28, 6555.58, 8309.38, 9069.2],
    2010: [3388.38, 4840.23, 10707.68, 5234, 6367.69, 9976.82, 4506.31, 5025.15, 2218.32, 2153.93, 1297.93, 6436.62],
    2009: [2855.55, 3987.84, 8959.83, 3993.8, 5114, 7906.34, 3541.92, 4060.72, 6001.78, 1566.37, 1908.49, 4905.22],
    2008: [2626.41, 3709.78, 8701.34, 4242.36, 4376.19, 7158.84, 3097.12, 4319.75, 6085.84, 1993.34, 1567.42, 4198.93],
    2007: [2509.4, 2892.53, 7201.88, 3454.49, 3193.67, 5544.14, 2475.45, 3695.58, 5571.06, 1471.26, 154.25, 3370.96],
    2006: [2191.43, 2457.08, 6110.43, 2755.66, 2374.96, 4566.83, 1915.29, 3365.31, 4969.95, 1282.89, 811.51, 2711.18],
    2005: [2026.51, 2135.07, 5271.57, 2357.04, 1773.21, 3869.4, 1580.83, 2971.68, 4381.2, 1524.96, 5164.75, 2245.9],
    2004: [1853.58, 1685.93, 4301.73, 1919.4, 1248.27, 3061.62, 1329.68, 2487.04, 3892.12, 1437.99, 1250.38, 1844.9],
    2003: [1487.15, 1337.31, 3417.56, 1463.38, 967.49, 2898.89, 1098.37, 2084.7, 3209.02, 6787.11, 5096.38, 1535.29],
    2002: [1249.99, 1069.08, 2911.69, 1134.31, 754.78, 2609.85, 943.49, 1843.6, 2622.45, 2604.49, 2090.48, 1337.04]
});
// prettier-ignore
dataMap.dataTI = dataFormatter({
    //max : 25000,
    2011: [12363.18, 5219.24, 8483.17, 3960.87, 5015.89, 8158.98, 3679.91, 4918.09, 1142.86, 2842.21, 1180.23, 4975.96, 6878.74],
    2010: [10600.84, 4238.65, 7123.77, 3412.38, 4209.03, 6849.37, 3111.12, 4040.55, 9833.51, 1131.45, 1063.82, 4193.69],
    2009: [9179.19, 3405.16, 6068.31, 2886.92, 3696.65, 5891.25, 2756.26, 3371.95, 8930.85, 1329.07, 918.78, 3662.15],
    2008: [8375.76, 2886.65, 5276.04, 2759.46, 3212.06, 5207.72, 2412.26, 2905.68, 7872.23, 1188.53, 899.31, 3234.64],
    2007: [7236.15, 2250.04, 4600.72, 2257.99, 2467.41, 4486.74, 2025.44, 2493.04, 6821.11, 9730.91, 7613.46, 2515.31 ],
    2006: [5837.55, 1902.31, 3895.36, 1846.18, 1934.35, 3798.26, 1687.07, 2096.35, 5508.48, 714.11, 6281.86, 2390.29],
    2005: [4854.33, 1658.19, 3340.54, 1611.07, 1542.26, 3295.45, 1413.83, 1857.42, 4776.2, 6612.22, 5360.1, 2137.77],
    2004: [4092.27, 1319.76, 2805.47, 1375.67, 1270, 2811.95, 1223.64, 1657.77, 4097.26, 5198.03, 4584.22, 1963.9],
    2003: [3435.95, 1150.81, 2439.68, 1176.65, 1000.79, 2487.85, 1075.48, 1467.9, 3404.19, 4493.31, 3890.79, 1638.42],
    2002: [2982.57, 997.47, 2149.75, 992.69, 811.47, 2258.17, 958.88, 1319.4, 3038.9, 3891.92, 3227.99, 1399.02 ]
});
// prettier-ignore
dataMap.dataEstate = dataFormatter({
    //max : 3600,
    2011: [1074.93, 411.46, 918.02, 224.91, 384.76, 876.12, 238.61, 492.1, 1019.68, 2747.89, 1677.13, 634.92, 911.16, 402.51, 1838.14, 987, 634.67, 518.04, 3321.31, 465.68, 208.71, 396.28, 620.62, 160.3, 222.31, 17.44, 398.03, 134.25, 29.05, 79.01, 176.22],
    2010: [1006.52, 377.59, 697.79, 192, 309.25, 733.37, 212.32, 391.89, 1002.5, 2600.95, 1618.17, 532.17, 679.03, 340.56, 1622.15, 773.23, 564.41, 464.21, 2813.95, 405.79, 188.33, 266.38, 558.56, 139.64, 223.45, 14.54, 315.95, 110.02, 25.41, 60.53, 143.44],
    2009: [1062.47, 308.73, 612.4, 173.31, 286.65, 605.27, 200.14, 301.18, 1237.56, 2025.39, 1316.84, 497.94, 656.61, 305.9, 1329.59, 622.98, 546.11, 400.11, 2470.63, 348.98, 121.76, 229.09, 548.14, 136.15, 205.14, 13.28, 239.92, 101.37, 23.05, 47.56, 115.23],
    2008: [844.59, 227.88, 513.81, 166.04, 273.3, 500.81, 182.7, 244.47, 939.34, 1626.13, 1052.03, 431.27, 506.98, 281.96, 1104.95, 512.42, 526.88, 340.07, 2057.45, 282.96, 95.6, 191.21, 453.63, 104.81, 195.48, 15.08, 193.27, 93.8, 19.96, 38.85, 89.79],
    2007: [821.5, 183.44, 467.97, 134.12, 191.01, 410.43, 153.03, 225.81, 958.06, 1365.71, 981.42, 366.57, 511.5, 225.96, 953.69, 447.44, 409.65, 301.8, 2029.77, 239.45, 67.19, 196.06, 376.84, 93.19, 193.59, 13.24, 153.98, 83.52, 16.98, 29.49, 91.28],
    2006: [658.3, 156.64, 397.14, 117.01, 136.5, 318.54, 131.01, 194.7, 773.61, 1017.91, 794.41, 281.98, 435.22, 184.67, 786.51, 348.7, 294.73, 254.81, 1722.07, 192.2, 44.45, 158.2, 336.2, 80.24, 165.92, 11.92, 125.2, 73.21, 15.17, 25.53, 68.9],
    2005: [493.73, 122.67, 330.87, 106, 98.75, 256.77, 112.29, 163.34, 715.97, 799.73, 688.86, 231.66, 331.8, 171.88, 664.9, 298.19, 217.17, 215.63, 1430.37, 165.05, 38.2, 143.88, 286.23, 76.38, 148.69, 10.02, 108.62, 63.78, 14.1, 22.97, 55.79],
    2004: [436.11, 106.14, 231.08, 95.1, 73.81, 203.1, 97.93, 137.74, 666.3, 534.17, 587.83, 188.28, 248.44, 167.2, 473.27, 236.44, 204.8, 191.5, 1103.75, 122.52, 30.64, 129.12, 264.3, 68.3, 116.54, 5.8, 95.9, 56.84, 13, 20.78, 53.55],
    2003: [341.88, 92.31, 185.19, 78.73, 61.05, 188.49, 91.99, 127.2, 487.82, 447.47, 473.16, 162.63, 215.84, 138.02, 418.21, 217.58, 176.8, 186.49, 955.66, 100.93, 25.14, 113.69, 231.72, 59.86, 103.79, 4.35, 83.9, 48.09, 11.41, 16.85, 47.84],
    2002: [298.02, 73.04, 140.89, 65.83, 51.48, 130.94, 76.11, 118.7, 384.86, 371.09, 360.63, 139.18, 188.09, 125.27, 371.13, 199.31, 145.17, 165.29, 808.16, 82.83, 21.45, 90.48, 210.82, 53.49, 95.68, 3.42, 77.68, 41.52, 9.74, 13.46, 43.04]
});
// prettier-ignore
dataMap.dataFinancial = dataFormatter({
    //max : 3200,
    2011: [2215.41, 756.5, 746.01, 519.32, 447.46, 755.57, 207.65, 370.78, 2277.4, 2600.11, 2730.29, 503.85, 862.41, 357.44, 1640.41, 868.2, 674.57, 501.09, 2916.13, 445.37, 105.24, 704.66, 868.15, 297.27, 456.23, 31.7, 432.11, 145.05, 62.56, 134.18, 288.77],
    2010: [1863.61, 572.99, 615.42, 448.3, 346.44, 639.27, 190.12, 304.59, 1950.96, 2105.92, 2326.58, 396.17, 767.58, 241.49, 1361.45, 697.68, 561.27, 463.16, 2658.76, 384.53, 78.12, 496.56, 654.7, 231.51, 375.08, 27.08, 384.75, 100.54, 54.53, 97.87, 225.2],
    2009: [1603.63, 461.2, 525.67, 361.64, 291.1, 560.2, 180.83, 227.54, 1804.28, 1596.98, 1899.33, 359.6, 612.2, 165.1, 1044.9, 499.92, 479.11, 402.57, 2283.29, 336.82, 65.73, 389.97, 524.63, 194.44, 351.74, 23.17, 336.21, 88.27, 45.63, 75.54, 198.87],
    2008: [1519.19, 368.1, 420.74, 290.91, 219.09, 455.07, 147.24, 177.43, 1414.21, 1298.48, 1653.45, 313.81, 497.65, 130.57, 880.28, 413.83, 393.05, 334.32, 1972.4, 249.01, 47.33, 303.01, 411.14, 151.55, 277.66, 22.42, 287.16, 72.49, 36.54, 64.8, 171.97],
    2007: [1302.77, 288.17, 347.65, 218.73, 148.3, 386.34, 126.03, 155.48, 1209.08, 1054.25, 1251.43, 223.85, 385.84, 101.34, 734.9, 302.31, 337.27, 260.14, 1705.08, 190.73, 34.43, 247.46, 359.11, 122.25, 168.55, 11.51, 231.03, 61.6, 27.67, 51.05, 149.22],
    2006: [982.37, 186.87, 284.04, 169.63, 108.21, 303.41, 100.75, 74.17, 825.2, 653.25, 906.37, 166.01, 243.9, 79.75, 524.94, 219.72, 174.99, 204.72, 899.91, 129.14, 16.37, 213.7, 299.5, 89.43, 143.62, 6.44, 152.25, 50.51, 23.69, 36.99, 99.25],
    2005: [840.2, 147.4, 213.47, 135.07, 72.52, 232.85, 83.63, 35.03, 675.12, 492.4, 686.32, 127.05, 186.12, 69.55, 448.36, 181.74, 127.32, 162.37, 661.81, 91.93, 13.16, 185.18, 262.26, 73.67, 130.5, 7.57, 127.58, 44.73, 20.36, 32.25, 80.34],
    2004: [713.79, 136.97, 209.1, 110.29, 55.89, 188.04, 77.17, 32.2, 612.45, 440.5, 523.49, 94.1, 171, 65.1, 343.37, 170.82, 118.85, 118.64, 602.68, 74, 11.56, 162.38, 236.5, 60.3, 118.4, 5.4, 90.1, 42.99, 19, 27.92, 70.3],
    2003: [635.56, 112.79, 199.87, 118.48, 55.89, 145.38, 73.15, 32.2, 517.97, 392.11, 451.54, 87.45, 150.09, 64.31, 329.71, 165.11, 107.31, 99.35, 534.28, 61.59, 10.68, 147.04, 206.24, 48.01, 105.48, 4.74, 77.87, 42.31, 17.98, 24.8, 64.92],
    2002: [561.91, 76.86, 179.6, 124.1, 48.39, 137.18, 75.45, 31.6, 485.25, 368.86, 347.53, 81.85, 138.28, 76.51, 310.07, 158.77, 96.95, 92.43, 454.65, 35.86, 10.08, 134.52, 183.13, 41.45, 102.39, 2.81, 67.3, 42.08, 16.75, 21.45, 52.18]
});
const option = {
  baseOption: {
    timeline: {
      axisType: 'category',
      // realtime: false,
      // loop: false,
      autoPlay: true,
      // currentIndex: 2,
      playInterval: 1000,
      // controlStyle: {
      //     position: 'left'
      // },
      data: [
        // '2024-01-21',
        '2023-10-01',
        '2023-11-01',
        {
          value: '2023-12-01',
          tooltip: {
            formatter: '{b} 收益达到一个高度'
          },
          symbol: 'diamond',
          symbolSize: 16
        },
        '2024-01-01',
        '2024-02-01',
        '2024-03-01',
        '2024-04-01',
        '2024-05-01',
        {
          value: '2024-6-01',
          tooltip: {
            formatter: function (params) {
              return params.name + '收益达到又一个高度';
            }
          },
          symbol: 'diamond',
          symbolSize: 18
        }
      ],
      label: {
        formatter: function (s) {
          // return new Date(s).getFullYear();
          return new Date(s).getMonth()+"月";
        }
      }
    },
    title: {
      subtext: '数据来自近期统计'
    },
    tooltip: {},
    legend: {
      left: 'right',
      // data: ['空调产业链', '汽车产业链', '洗衣机产业链', 'GDP', '金融', '房地产'],
      data: ['空调产业链', '汽车产业链', '洗衣机产业链'],
      // selected: {
      //   GDP: false,
      //   金融: false,
      //   房地产: false
      // }
    },
    calculable: true,
    grid: {
      top: 80,
      bottom: 100,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
            formatter: function (params) {
              return params.value.replace('\n', '');
            }
          }
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisLabel: { interval: 0 },
        data: [
          '厦门\n钨业',
          '南山\n铝业',
          '金川\n集团',
          '置信\n电机',
          '宁德\n时代',
          '格力\n电器',
          '海尔\n智家',
          '格力\n电器',
          '海尔\n智家',
          '三星\n电子',
          '德固\n赛',
          '3M\n公司',
        ],
        splitLine: { show: false }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '增长值（亿元）'
      }
    ],
    series: [
      // { name: 'GDP', type: 'bar' },
      // { name: '金融', type: 'bar' },
      // { name: '房地产', type: 'bar' },
      { name: '空调产业链', type: 'bar' },
      { name: '汽车产业链', type: 'bar' },
      { name: '洗衣机产业链', type: 'bar' },
      ////修改饼图/////////////////////////////////////////////////////
      // {
      //   name: '收益占比',
      //   type: 'pie',
      //   center: ['75%', '35%'],
      //   radius: '28%',
      //   z: 100
      // }
      ///////////////////////////////////////////////////////////
    ]
  },
  options: [
    {
      title: { text: '2024年1月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2002'] },
        // { data: dataMap.dataFinancial['2002'] },
        // { data: dataMap.dataEstate['2002'] },
        { data: dataMap.dataPI['2002'] },
        { data: dataMap.dataSI['2002'] },
        { data: dataMap.dataTI['2002'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2002sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2002sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2002sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年2月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2003'] },
        // { data: dataMap.dataFinancial['2003'] },
        // { data: dataMap.dataEstate['2003'] },
        { data: dataMap.dataPI['2003'] },
        { data: dataMap.dataSI['2003'] },
        { data: dataMap.dataTI['2003'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2003sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2003sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2003sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年3月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2004'] },
        // { data: dataMap.dataFinancial['2004'] },
        // { data: dataMap.dataEstate['2004'] },
        { data: dataMap.dataPI['2004'] },
        { data: dataMap.dataSI['2004'] },
        { data: dataMap.dataTI['2004'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2004sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2004sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2004sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年4月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2005'] },
        // { data: dataMap.dataFinancial['2005'] },
        // { data: dataMap.dataEstate['2005'] },
        { data: dataMap.dataPI['2005'] },
        { data: dataMap.dataSI['2005'] },
        { data: dataMap.dataTI['2005'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2005sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2005sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2005sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年5月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2006'] },
        // { data: dataMap.dataFinancial['2006'] },
        // { data: dataMap.dataEstate['2006'] },
        { data: dataMap.dataPI['2006'] },
        { data: dataMap.dataSI['2006'] },
        { data: dataMap.dataTI['2006'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2006sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2006sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2006sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年6月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2007'] },
        // { data: dataMap.dataFinancial['2007'] },
        // { data: dataMap.dataEstate['2007'] },
        { data: dataMap.dataPI['2007'] },
        { data: dataMap.dataSI['2007'] },
        { data: dataMap.dataTI['2007'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2007sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2007sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2007sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年7月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2008'] },
        // { data: dataMap.dataFinancial['2008'] },
        // { data: dataMap.dataEstate['2008'] },
        { data: dataMap.dataPI['2008'] },
        { data: dataMap.dataSI['2008'] },
        { data: dataMap.dataTI['2008'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2008sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2008sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2008sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年8月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2009'] },
        // { data: dataMap.dataFinancial['2009'] },
        // { data: dataMap.dataEstate['2009'] },
        { data: dataMap.dataPI['2009'] },
        { data: dataMap.dataSI['2009'] },
        { data: dataMap.dataTI['2009'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2009sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2009sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2009sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年9月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2010'] },
        // { data: dataMap.dataFinancial['2010'] },
        // { data: dataMap.dataEstate['2010'] },
        { data: dataMap.dataPI['2010'] },
        { data: dataMap.dataSI['2010'] },
        { data: dataMap.dataTI['2010'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2010sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2010sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2010sum'] }
          ]
        }
      ]
    },
    {
      title: { text: '2024年10月共享收益指标' },
      series: [
        // { data: dataMap.dataGDP['2011'] },
        // { data: dataMap.dataFinancial['2011'] },
        // { data: dataMap.dataEstate['2011'] },
        { data: dataMap.dataPI['2011'] },
        { data: dataMap.dataSI['2011'] },
        { data: dataMap.dataTI['2011'] },
        {
          data: [
            { name: '空调产业链', value: dataMap.dataPI['2011sum'] },
            { name: '汽车产业链', value: dataMap.dataSI['2011sum'] },
            { name: '洗衣机产业链', value: dataMap.dataTI['2011sum'] }
          ]
        }
      ]
    }
  ]
};
   
    myChart.setOption(option);

  };
  function createincomechart(){
  const myChart = echarts.init(income_chart.value);
  var dataMap = {};
  function dataFormatter(obj) {
    // prettier-ignore
    var pList = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'];
    var temp;
    for (var year = 2002; year <= 2011; year++) {
      var max = 0;
      var sum = 0;
      temp = obj[year];
      for (var i = 0, l = temp.length; i < l; i++) {
        max = Math.max(max, temp[i]);
        sum += temp[i];
        obj[year][i] = {
          name: pList[i],
          value: temp[i]
        };
      }
      obj[year + 'max'] = Math.floor(max / 100) * 100;
      obj[year + 'sum'] = sum;
    }
    return obj;
  }
  // prettier-ignore
  dataMap.dataGDP = dataFormatter({
    //max : 60000,
    2011: [16251.93, 11307.28, 24515.76, 11237.55, 14359.88, 22226.7, 10568.83, 12582, 19195.69, 49110.27, 32318.85, 15300.65, 17560.18, 11702.82, 45361.85, 26931.03, 19632.26, 19669.56, 53210.28, 11720.87, 2522.66, 10011.37, 21026.68, 5701.84, 8893.12, 605.83, 12512.3, 5020.37, 1670.44, 2102.21, 6610.05],
    2010: [14113.58, 9224.46, 20394.26, 9200.86, 11672, 18457.27, 8667.58, 10368.6, 17165.98, 41425.48, 27722.31, 12359.33, 14737.12, 9451.26, 39169.92, 23092.36, 15967.61, 16037.96, 46013.06, 9569.85, 2064.5, 7925.58, 17185.48, 4602.16, 7224.18, 507.46, 10123.48, 4120.75, 1350.43, 1689.65, 5437.47],
    2009: [12153.03, 7521.85, 17235.48, 7358.31, 9740.25, 15212.49, 7278.75, 8587, 15046.45, 34457.3, 22990.35, 10062.82, 12236.53, 7655.18, 33896.65, 19480.46, 12961.1, 13059.69, 39482.56, 7759.16, 1654.21, 6530.01, 14151.28, 3912.68, 6169.75, 441.36, 8169.8, 3387.56, 1081.27, 1353.31, 4277.05],
    2008: [11115, 6719.01, 16011.97, 7315.4, 8496.2, 13668.58, 6426.1, 8314.37, 14069.87, 30981.98, 21462.69, 8851.66, 10823.01, 6971.05, 30933.28, 18018.53, 11328.92, 11555, 36796.71, 7021, 1503.06, 5793.66, 12601.23, 3561.56, 5692.12, 394.85, 7314.58, 3166.82, 1018.62, 1203.92, 4183.21],
    2007: [9846.81, 5252.76, 13607.32, 6024.45, 6423.18, 11164.3, 5284.69, 7104, 12494.01, 26018.48, 18753.73, 7360.92, 9248.53, 5800.25, 25776.91, 15012.46, 9333.4, 9439.6, 31777.01, 5823.41, 1254.17, 4676.13, 10562.39, 2884.11, 4772.52, 341.43, 5757.29, 2703.98, 797.35, 919.11, 3523.16],
    2006: [8117.78, 4462.74, 11467.6, 4878.61, 4944.25, 9304.52, 4275.12, 6211.8, 10572.24, 21742.05, 15718.47, 6112.5, 7583.85, 4820.53, 21900.19, 12362.79, 7617.47, 7688.67, 26587.76, 4746.16, 1065.67, 3907.23, 8690.24, 2338.98, 3988.14, 290.76, 4743.61, 2277.35, 648.5, 725.9, 3045.26],
    2005: [6969.52, 3905.64, 10012.11, 4230.53, 3905.03, 8047.26, 3620.27, 5513.7, 9247.66, 18598.69, 13417.68, 5350.17, 6554.69, 4056.76, 18366.87, 10587.42, 6590.19, 6596.1, 22557.37, 3984.1, 918.75, 3467.72, 7385.1, 2005.42, 3462.73, 248.8, 3933.72, 1933.98, 543.32, 612.61, 2604.19],
    2004: [6033.21, 3110.97, 8477.63, 3571.37, 3041.07, 6672, 3122.01, 4750.6, 8072.83, 15003.6, 11648.7, 4759.3, 5763.35, 3456.7, 15021.84, 8553.79, 5633.24, 5641.94, 18864.62, 3433.5, 819.66, 3034.58, 6379.63, 1677.8, 3081.91, 220.34, 3175.58, 1688.49, 466.1, 537.11, 2209.09],
    2003: [5007.21, 2578.03, 6921.29, 2855.23, 2388.38, 6002.54, 2662.08, 4057.4, 6694.23, 12442.87, 9705.02, 3923.11, 4983.67, 2807.41, 12078.15, 6867.7, 4757.45, 4659.99, 15844.64, 2821.11, 713.96, 2555.72, 5333.09, 1426.34, 2556.02, 185.09, 2587.72, 1399.83, 390.2, 445.36, 1886.35],
    2002: [4315, 2150.76, 6018.28, 2324.8, 1940.94, 5458.22, 2348.54, 3637.2, 5741.03, 10606.85, 8003.67, 3519.72, 4467.55, 2450.48, 10275.5, 6035.48, 4212.82, 4151.54, 13502.42, 2523.73, 642.73, 2232.86, 4725.01, 1243.43, 2312.82, 162.04, 2253.39, 1232.03, 340.65, 377.16, 1612.6]
  });
  // prettier-ignore空调产业链
  dataMap.dataPI = dataFormatter({
    //max : 4000,
    2011: [-136.27, -159.72, -2905.73, -641.42, 136.27, 159.72, 2905.73, 641.42, 0,0,],
    2010: [124.36, 145.58, 2562.81, 554.48, 1095.28, 1631.08, 1050.15, 1302.9, 114.15, 2540.1, 1360.56, 1729.02],
    2009: [118.29, 128.85, 2207.34, 477.59, 929.6, 1414.9, 980.57, 1154.33, 113.82, 2261.86, 1163.08, 1495.45],
    2008: [112.83, 122.58, 2034.59, 313.58, 907.95, 1302.02, 916.72, 1088.94, 111.8, 2100.11, 1095.96, 1418.09],
    2007: [101.26, 110.19, 1804.72, 311.97, 762.1, 1133.42, 783.8, 915.38, 101.84, 1816.31, 986.02, 1200.18],
    2006: [88.8, 103.35, 1461.81, 276.77, 634.94, 939.43, 672.76, 750.14, 93.81, 1545.05, 925.1, 1011.03],
    2005: [88.68, 112.38, 1400, 262.42, 589.56, 882.41, 625.61, 684.6, 90.26, 1461.51, 892.83, 966.5],
    2004: [87.36, 105.28, 1370.43, 276.3, 522.8, 798.43, 568.69, 605.79, 83.45, 1367.58, 814.1, 950.5],
    2003: [84.11, 89.91, 1064.05, 215.19, 420.1, 615.8, 488.23, 504.8, 81.02, 1162.45, 717.85, 749.4],
    2002: [82.44, 84.21, 956.84, 197.8, 374.69, 590.2, 446.17, 474.2, 79.68, 1110.44, 685.2, 783.66]
  });
  // prettier-ignore
  dataMap.dataSI = dataFormatter({
    //max : 26600,
    2011: [3752.48, 5928.32, 13126.86, 6635.26, 8037.69, 12152.15, 5611.48, 5962.41, 7927.89, 25203.28, 16555.58, 8309.38, 9069.2],
    2010: [3388.38, 4840.23, 10707.68, 5234, 6367.69, 9976.82, 4506.31, 5025.15, 7218.32, 21753.93, 14297.93, 6436.62],
    2009: [2855.55, 3987.84, 8959.83, 3993.8, 5114, 7906.34, 3541.92, 4060.72, 6001.78, 18566.37, 11908.49, 4905.22],
    2008: [2626.41, 3709.78, 8701.34, 4242.36, 4376.19, 7158.84, 3097.12, 4319.75, 6085.84, 16993.34, 11567.42, 4198.93],
    2007: [2509.4, 2892.53, 7201.88, 3454.49, 3193.67, 5544.14, 2475.45, 3695.58, 5571.06, 14471.26, 10154.25, 3370.96],
    2006: [2191.43, 2457.08, 6110.43, 2755.66, 2374.96, 4566.83, 1915.29, 3365.31, 4969.95, 12282.89, 8511.51, 2711.18],
    2005: [2026.51, 2135.07, 5271.57, 2357.04, 1773.21, 3869.4, 1580.83, 2971.68, 4381.2, 10524.96, 7164.75, 2245.9],
    2004: [1853.58, 1685.93, 4301.73, 1919.4, 1248.27, 3061.62, 1329.68, 2487.04, 3892.12, 8437.99, 6250.38, 1844.9],
    2003: [1487.15, 1337.31, 3417.56, 1463.38, 967.49, 2898.89, 1098.37, 2084.7, 3209.02, 6787.11, 5096.38, 1535.29],
    2002: [1249.99, 1069.08, 2911.69, 1134.31, 754.78, 2609.85, 943.49, 1843.6, 2622.45, 5604.49, 4090.48, 1337.04]
  });
  // prettier-ignore
  dataMap.dataTI = dataFormatter({
    //max : 25000,
    2011: [12363.18, 5219.24, 8483.17, 3960.87, 5015.89, 8158.98, 3679.91, 4918.09, 11142.86, 20842.21, 14180.23, 4975.96, 6878.74],
    2010: [10600.84, 4238.65, 7123.77, 3412.38, 4209.03, 6849.37, 3111.12, 4040.55, 9833.51, 17131.45, 12063.82, 4193.69],
    2009: [9179.19, 3405.16, 6068.31, 2886.92, 3696.65, 5891.25, 2756.26, 3371.95, 8930.85, 13629.07, 9918.78, 3662.15],
    2008: [8375.76, 2886.65, 5276.04, 2759.46, 3212.06, 5207.72, 2412.26, 2905.68, 7872.23, 11888.53, 8799.31, 3234.64],
    2007: [7236.15, 2250.04, 4600.72, 2257.99, 2467.41, 4486.74, 2025.44, 2493.04, 6821.11, 9730.91, 7613.46, 2515.31 ],
    2006: [5837.55, 1902.31, 3895.36, 1846.18, 1934.35, 3798.26, 1687.07, 2096.35, 5508.48, 7914.11, 6281.86, 2390.29],
    2005: [4854.33, 1658.19, 3340.54, 1611.07, 1542.26, 3295.45, 1413.83, 1857.42, 4776.2, 6612.22, 5360.1, 2137.77],
    2004: [4092.27, 1319.76, 2805.47, 1375.67, 1270, 2811.95, 1223.64, 1657.77, 4097.26, 5198.03, 4584.22, 1963.9],
    2003: [3435.95, 1150.81, 2439.68, 1176.65, 1000.79, 2487.85, 1075.48, 1467.9, 3404.19, 4493.31, 3890.79, 1638.42],
    2002: [2982.57, 997.47, 2149.75, 992.69, 811.47, 2258.17, 958.88, 1319.4, 3038.9, 3891.92, 3227.99, 1399.02 ]
  });
  // prettier-ignore
  dataMap.dataEstate = dataFormatter({
    //max : 3600,
    2011: [1074.93, 411.46, 918.02, 224.91, 384.76, 876.12, 238.61, 492.1, 1019.68, 2747.89, 1677.13, 634.92, 911.16, 402.51, 1838.14, 987, 634.67, 518.04, 3321.31, 465.68, 208.71, 396.28, 620.62, 160.3, 222.31, 17.44, 398.03, 134.25, 29.05, 79.01, 176.22],
    2010: [1006.52, 377.59, 697.79, 192, 309.25, 733.37, 212.32, 391.89, 1002.5, 2600.95, 1618.17, 532.17, 679.03, 340.56, 1622.15, 773.23, 564.41, 464.21, 2813.95, 405.79, 188.33, 266.38, 558.56, 139.64, 223.45, 14.54, 315.95, 110.02, 25.41, 60.53, 143.44],
    2009: [1062.47, 308.73, 612.4, 173.31, 286.65, 605.27, 200.14, 301.18, 1237.56, 2025.39, 1316.84, 497.94, 656.61, 305.9, 1329.59, 622.98, 546.11, 400.11, 2470.63, 348.98, 121.76, 229.09, 548.14, 136.15, 205.14, 13.28, 239.92, 101.37, 23.05, 47.56, 115.23],
    2008: [844.59, 227.88, 513.81, 166.04, 273.3, 500.81, 182.7, 244.47, 939.34, 1626.13, 1052.03, 431.27, 506.98, 281.96, 1104.95, 512.42, 526.88, 340.07, 2057.45, 282.96, 95.6, 191.21, 453.63, 104.81, 195.48, 15.08, 193.27, 93.8, 19.96, 38.85, 89.79],
    2007: [821.5, 183.44, 467.97, 134.12, 191.01, 410.43, 153.03, 225.81, 958.06, 1365.71, 981.42, 366.57, 511.5, 225.96, 953.69, 447.44, 409.65, 301.8, 2029.77, 239.45, 67.19, 196.06, 376.84, 93.19, 193.59, 13.24, 153.98, 83.52, 16.98, 29.49, 91.28],
    2006: [658.3, 156.64, 397.14, 117.01, 136.5, 318.54, 131.01, 194.7, 773.61, 1017.91, 794.41, 281.98, 435.22, 184.67, 786.51, 348.7, 294.73, 254.81, 1722.07, 192.2, 44.45, 158.2, 336.2, 80.24, 165.92, 11.92, 125.2, 73.21, 15.17, 25.53, 68.9],
    2005: [493.73, 122.67, 330.87, 106, 98.75, 256.77, 112.29, 163.34, 715.97, 799.73, 688.86, 231.66, 331.8, 171.88, 664.9, 298.19, 217.17, 215.63, 1430.37, 165.05, 38.2, 143.88, 286.23, 76.38, 148.69, 10.02, 108.62, 63.78, 14.1, 22.97, 55.79],
    2004: [436.11, 106.14, 231.08, 95.1, 73.81, 203.1, 97.93, 137.74, 666.3, 534.17, 587.83, 188.28, 248.44, 167.2, 473.27, 236.44, 204.8, 191.5, 1103.75, 122.52, 30.64, 129.12, 264.3, 68.3, 116.54, 5.8, 95.9, 56.84, 13, 20.78, 53.55],
    2003: [341.88, 92.31, 185.19, 78.73, 61.05, 188.49, 91.99, 127.2, 487.82, 447.47, 473.16, 162.63, 215.84, 138.02, 418.21, 217.58, 176.8, 186.49, 955.66, 100.93, 25.14, 113.69, 231.72, 59.86, 103.79, 4.35, 83.9, 48.09, 11.41, 16.85, 47.84],
    2002: [298.02, 73.04, 140.89, 65.83, 51.48, 130.94, 76.11, 118.7, 384.86, 371.09, 360.63, 139.18, 188.09, 125.27, 371.13, 199.31, 145.17, 165.29, 808.16, 82.83, 21.45, 90.48, 210.82, 53.49, 95.68, 3.42, 77.68, 41.52, 9.74, 13.46, 43.04]
  });
  // prettier-ignore
  dataMap.dataFinancial = dataFormatter({
    //max : 3200,
    2011: [2215.41, 756.5, 746.01, 519.32, 447.46, 755.57, 207.65, 370.78, 2277.4, 2600.11, 2730.29, 503.85, 862.41, 357.44, 1640.41, 868.2, 674.57, 501.09, 2916.13, 445.37, 105.24, 704.66, 868.15, 297.27, 456.23, 31.7, 432.11, 145.05, 62.56, 134.18, 288.77],
    2010: [1863.61, 572.99, 615.42, 448.3, 346.44, 639.27, 190.12, 304.59, 1950.96, 2105.92, 2326.58, 396.17, 767.58, 241.49, 1361.45, 697.68, 561.27, 463.16, 2658.76, 384.53, 78.12, 496.56, 654.7, 231.51, 375.08, 27.08, 384.75, 100.54, 54.53, 97.87, 225.2],
    2009: [1603.63, 461.2, 525.67, 361.64, 291.1, 560.2, 180.83, 227.54, 1804.28, 1596.98, 1899.33, 359.6, 612.2, 165.1, 1044.9, 499.92, 479.11, 402.57, 2283.29, 336.82, 65.73, 389.97, 524.63, 194.44, 351.74, 23.17, 336.21, 88.27, 45.63, 75.54, 198.87],
    2008: [1519.19, 368.1, 420.74, 290.91, 219.09, 455.07, 147.24, 177.43, 1414.21, 1298.48, 1653.45, 313.81, 497.65, 130.57, 880.28, 413.83, 393.05, 334.32, 1972.4, 249.01, 47.33, 303.01, 411.14, 151.55, 277.66, 22.42, 287.16, 72.49, 36.54, 64.8, 171.97],
    2007: [1302.77, 288.17, 347.65, 218.73, 148.3, 386.34, 126.03, 155.48, 1209.08, 1054.25, 1251.43, 223.85, 385.84, 101.34, 734.9, 302.31, 337.27, 260.14, 1705.08, 190.73, 34.43, 247.46, 359.11, 122.25, 168.55, 11.51, 231.03, 61.6, 27.67, 51.05, 149.22],
    2006: [982.37, 186.87, 284.04, 169.63, 108.21, 303.41, 100.75, 74.17, 825.2, 653.25, 906.37, 166.01, 243.9, 79.75, 524.94, 219.72, 174.99, 204.72, 899.91, 129.14, 16.37, 213.7, 299.5, 89.43, 143.62, 6.44, 152.25, 50.51, 23.69, 36.99, 99.25],
    2005: [840.2, 147.4, 213.47, 135.07, 72.52, 232.85, 83.63, 35.03, 675.12, 492.4, 686.32, 127.05, 186.12, 69.55, 448.36, 181.74, 127.32, 162.37, 661.81, 91.93, 13.16, 185.18, 262.26, 73.67, 130.5, 7.57, 127.58, 44.73, 20.36, 32.25, 80.34],
    2004: [713.79, 136.97, 209.1, 110.29, 55.89, 188.04, 77.17, 32.2, 612.45, 440.5, 523.49, 94.1, 171, 65.1, 343.37, 170.82, 118.85, 118.64, 602.68, 74, 11.56, 162.38, 236.5, 60.3, 118.4, 5.4, 90.1, 42.99, 19, 27.92, 70.3],
    2003: [635.56, 112.79, 199.87, 118.48, 55.89, 145.38, 73.15, 32.2, 517.97, 392.11, 451.54, 87.45, 150.09, 64.31, 329.71, 165.11, 107.31, 99.35, 534.28, 61.59, 10.68, 147.04, 206.24, 48.01, 105.48, 4.74, 77.87, 42.31, 17.98, 24.8, 64.92],
    2002: [561.91, 76.86, 179.6, 124.1, 48.39, 137.18, 75.45, 31.6, 485.25, 368.86, 347.53, 81.85, 138.28, 76.51, 310.07, 158.77, 96.95, 92.43, 454.65, 35.86, 10.08, 134.52, 183.13, 41.45, 102.39, 2.81, 67.3, 42.08, 16.75, 21.45, 52.18]
  });
  const option = {
    baseOption: {
      timeline: {
        axisType: 'category',
        // realtime: false,
        // loop: false,
        autoPlay: true,
        // currentIndex: 2,
        playInterval: 1000,
        // controlStyle: {
        //     position: 'left'
        // },
        data: [
          // '2024-01-21',
          '2023-08-01',
        '2023-09-01',
        {
          value: '2023-10-01',
          tooltip: {
            formatter: '{b} 收益达到一个高度'
          },
          symbol: 'diamond',
          symbolSize: 16
        },
        '2023-11-01',
        '2023-12-01',
        '2024-02-01',
        '2024-03-01',
        '2024-04-01',
        {
          value: '2024-5-18',
          tooltip: {
            formatter: function (params) {
              return params.name + '收益达到又一个高度';
            }
          },
          symbol: 'diamond',
          symbolSize: 18
        }
        ],
        label: {
          formatter: function (s) {
            // return new Date(s).getFullYear();
            return new Date(s).getMonth()+"月";
          }
        }
      },
      title: {
        subtext: '数据来自近期统计',
        // textStyle: {
        //   color:'white',
        //   fontSize:18
        // },
        // subtextStyle: {
        //   color:'white',
        //   fontSize:14
        // }
      },
      tooltip: {},
      legend: {
        left: 'right',
        // textStyle: {
        //   color:'white',
        // },
        // data: ['空调产业链', '汽车产业链', '冰箱产业链', 'GDP', '金融', '房地产'],
        data: ['空调产业链', '汽车产业链', '冰箱产业链'],
        // selected: {
        //   GDP: false,
        //   金融: false,
        //   房地产: false
        // }
      },
      calculable: true,
      grid: {
        top: 80,
        bottom: 100,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              formatter: function (params) {
                return params.value.replace('\n', '');
              }
            }
          }
        }
      },
      xAxis:
        {
          type: 'category',
          nameTextStyle: {
            color:'white',
          },
          axisLabel: { interval: 0 },
          data: [
            '厦门\n钨业',
            '南山\n铝业',
            '金川\n集团',
            '置信\n电机',
            '宁德\n时代',
            '格力\n电器',
            '海尔\n智家',
            '格力\n电器',
            '海尔\n智家',
            '三星\n电子',
            '德固\n赛',
            '3M\n公司',
          ],
          splitLine: { show: false }
        },
      yAxis:
        {
          type: 'value',
          name: '增长值（亿元）'
        },
      series: [
        // { name: 'GDP', type: 'bar' },
        // { name: '金融', type: 'bar' },
        // { name: '房地产', type: 'bar' },
        { name: '空调产业链', type: 'bar' },
        { name: '汽车产业链', type: 'bar' },
        { name: '冰箱产业链', type: 'bar' },
        // {
        //   name: '收益占比',
        //   type: 'pie',
        //   center: ['75%', '35%'],
        //   radius: '28%',
        //   z: 100
        // }
      ]
    },
    options: [
      {
        title: { text: '2024年1月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2002'] },
          // { data: dataMap.dataFinancial['2002'] },
          // { data: dataMap.dataEstate['2002'] },
          { data: dataMap.dataPI['2002'] },
          { data: dataMap.dataSI['2002'] },
          { data: dataMap.dataTI['2002'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2002sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2002sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2002sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年2月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2003'] },
          // { data: dataMap.dataFinancial['2003'] },
          // { data: dataMap.dataEstate['2003'] },
          { data: dataMap.dataPI['2003'] },
          { data: dataMap.dataSI['2003'] },
          { data: dataMap.dataTI['2003'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2003sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2003sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2003sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年3月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2004'] },
          // { data: dataMap.dataFinancial['2004'] },
          // { data: dataMap.dataEstate['2004'] },
          { data: dataMap.dataPI['2004'] },
          { data: dataMap.dataSI['2004'] },
          { data: dataMap.dataTI['2004'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2004sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2004sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2004sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年4月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2005'] },
          // { data: dataMap.dataFinancial['2005'] },
          // { data: dataMap.dataEstate['2005'] },
          { data: dataMap.dataPI['2005'] },
          { data: dataMap.dataSI['2005'] },
          { data: dataMap.dataTI['2005'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2005sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2005sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2005sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年5月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2006'] },
          // { data: dataMap.dataFinancial['2006'] },
          // { data: dataMap.dataEstate['2006'] },
          { data: dataMap.dataPI['2006'] },
          { data: dataMap.dataSI['2006'] },
          { data: dataMap.dataTI['2006'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2006sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2006sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2006sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年6月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2007'] },
          // { data: dataMap.dataFinancial['2007'] },
          // { data: dataMap.dataEstate['2007'] },
          { data: dataMap.dataPI['2007'] },
          { data: dataMap.dataSI['2007'] },
          { data: dataMap.dataTI['2007'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2007sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2007sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2007sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年7月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2008'] },
          // { data: dataMap.dataFinancial['2008'] },
          // { data: dataMap.dataEstate['2008'] },
          { data: dataMap.dataPI['2008'] },
          { data: dataMap.dataSI['2008'] },
          { data: dataMap.dataTI['2008'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2008sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2008sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2008sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年8月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2009'] },
          // { data: dataMap.dataFinancial['2009'] },
          // { data: dataMap.dataEstate['2009'] },
          { data: dataMap.dataPI['2009'] },
          { data: dataMap.dataSI['2009'] },
          { data: dataMap.dataTI['2009'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2009sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2009sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2009sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年9月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2010'] },
          // { data: dataMap.dataFinancial['2010'] },
          // { data: dataMap.dataEstate['2010'] },
          { data: dataMap.dataPI['2010'] },
          { data: dataMap.dataSI['2010'] },
          { data: dataMap.dataTI['2010'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2010sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2010sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2010sum'] }
            ]
          }
        ]
      },
      {
        title: { text: '2024年10月共享收益指标' },
        series: [
          // { data: dataMap.dataGDP['2011'] },
          // { data: dataMap.dataFinancial['2011'] },
          // { data: dataMap.dataEstate['2011'] },
          { data: dataMap.dataPI['2011'] },
          { data: dataMap.dataSI['2011'] },
          { data: dataMap.dataTI['2011'] },
          {
            data: [
              { name: '空调产业链', value: dataMap.dataPI['2011sum'] },
              { name: '汽车产业链', value: dataMap.dataSI['2011sum'] },
              { name: '冰箱产业链', value: dataMap.dataTI['2011sum'] }
            ]
          }
        ]
      }
    ]
  };

  myChart.setOption(option);
};
  function createincomechartPolylines(){
    const myChart = echarts.init(income_chartPol.value);
    const option = {
  title: {
    text: '共享收益变化表'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['洗衣机产业链', '家电产业链', '汽车产业链']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['23-06', '23-07', '23-08', '23-09', '23-10', '23-11', '23-12']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '增长值'
    }
  ],
  series: [
    {
      name: '洗衣机产业链',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [12, 13.2, 10.1, 13.4, 9, 23, 21]
    },
    {
      name: '家电产业链',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [22, 18.2, 19.1, 2.34, 29.0, 33.0, 31.0]
    },
    {
      name: '汽车产业链',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [-15.0, 23.2, 20.1, 15.4, 19.0, 3.30, 4.10]
    },
    // {
    //   name: 'Direct',
    //   type: 'line',
    //   stack: 'Total',
    //   areaStyle: {},
    //   emphasis: {
    //     focus: 'series'
    //   },
    //   data: [320, 332, 301, 334, 390, 330, 320]
    // },
    // {
    //   name: 'Search Engine',
    //   type: 'line',
    //   stack: 'Total',
    //   label: {
    //     show: true,
    //     position: 'top'
    //   },
    //   areaStyle: {},
    //   emphasis: {
    //     focus: 'series'
    //   },
    //   data: [820, 932, 901, 934, 1290, 1330, 1320]
    // }
  ]
};
    myChart.setOption(option);
  }

</script>

<style scoped>
/* .second{
  padding-top: 20px;
} */

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh; /* 如果需要垂直居中，设置父容器高度为视口高度 */
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
#echarts-line{
  height: 50vh;
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
#echarts-new{
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
#income-chartHis{
  height: 50vh;
  width: 100%;
}

#income-chartPol{
  height: 50vh;
  width: 100%;
}

#income-chart{
  height: 50vh;
  width: 100%;
}
.data-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.data-name {
  flex: 1;
  margin-right: 10px;
}

.uploaded-company {
  flex: 1;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.font{
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 23px;
  align-items: center;
}
</style>