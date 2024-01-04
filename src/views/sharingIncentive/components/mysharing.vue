<template>
  <div>
    <el-main tyle="width: 100%;">
      <!-- 搜索界面 -->
      <!-- <div style="margin: 10px 0">
        <el-input style="width: 200px" placeholder="请输入搜索的文件名称" suffix-icon="el-icon-search" class="ml-5" v-model="Station_Number"></el-input>
        <el-date-picker
            class="ml-5"
            v-model="time"
            type="date"
            placeholder="选择日期"
        >
        </el-date-picker>
        <el-button icon="el-icon-search" style="position: relative" type="primary" @click="load">搜索</el-button>
        <el-button  icon="el-icon-refresh" type="warning" style="position: relative" @click="reset">重置</el-button>
      </div> -->
      <el-row>
    
      <!-- <el-col :span="12"><div class="grid-content ep-bg-purple-light" /></el-col>   -->
    <el-col :span="4"><div>当前登录企业：</div></el-col>

    <el-col :span="4">      <el-input v-model="currentCompany" disabled placeholder="Please input" /></el-col>


    <!-- <el-col :span="4"></el-col> -->
  </el-row>
  <el-row>
    <el-col :span="3"><div >拍卖状态</div>
    </el-col>
    <el-col :span="4"><el-select v-model="valueAuctionStatus" class="m-2"  filterable clearable placeholder="Select" size="small">
          <el-option
            v-for="item in optionsAuctionStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    <el-col :span="3"><div >所属产业链</div></el-col>

    <el-col :span="4">        <el-select v-model="valueChain" class="m-2" clearable placeholder="Select" size="small">
          <el-option
            v-for="item in optionsChain"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="3"><div >开始日期</div>
      </el-col>
     <el-col :span="4">
      <el-date-picker
                v-model="ValueDataRelease"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                autocomplete="off"
              ></el-date-picker>
            </el-col>
            <el-col :span="5 "><div class="grid-content ep-bg-purple-light" /></el-col> 
              <el-col :span="2">              
                <el-button type="primary" @click="filtering">筛      选</el-button>
              </el-col>
              <el-col :span="12"><div class="grid-content ep-bg-purple-light" /></el-col>
              <el-col :span="4">    <div style="margin:0">
        <el-button class="ml-5" type="primary" @click="showPopup">新增拍卖<i class="el-icon-circle-plus-outline"></i> </el-button>
        <!-- <el-button type="info" icon="el-icon-search" @click="showPopup">查看今日推荐</el-button> -->
        <el-popconfirm
            class="ml-5"
            title="确定批量删除这些数据吗？"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            @confirm="delBatch"
        >
          <el-button type="danger" slot="reference" >批量删除 <i class="el-icon-remove-outline"></i> </el-button>
        </el-popconfirm>
      </div></el-col> 

  </el-row>

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
      <el-table :data="dataFiltered.value" border stripe :header-cell-class-name="headerBg" max-height="300" :fit="true" >
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
          <el-table-column prop="taskState" label="拍卖状态" >
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
      <!-- 修改之后进行中的表格界面 -->
        <el-table :data="ingData" border stripe :header-cell-class-name="headerBg"  max-height="300" :fit="true" v-if="activeName === 'second'">
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="taskName" label="数据需求" >
          </el-table-column>
          <el-table-column prop="taskReleaser" label="数据请求方" >
          </el-table-column>
          <el-table-column prop="dataRelease" label="发布日期" >
          </el-table-column>
          <el-table-column prop="dataFinish" label="截止日期" >
            <template #header="{ column }">
              <el-tooltip effect="dark" content="这里是悬浮内容" placement="top-start">
                <span>{{ column.label }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="taskState" label="拍卖状态" >
          </el-table-column>        
          <el-table-column label="所属产业链" prop="chain" >
          </el-table-column>
          <el-table-column label="查看拍卖详情" align="center"  class-name="small-padding fixed-width">
            <el-button link type="primary" icon="Edit" @click="showAuctionDetails" ></el-button>
          </el-table-column>
        </el-table> 
      <!-- 修改之后待交付的表格界面 -->
      <el-table :data="awaitData" border stripe :header-cell-class-name="headerBg"  max-height="300" :fit="true" v-if="activeName === 'third'">
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="taskName" label="数据需求" >
          </el-table-column>
          <el-table-column prop="taskReleaser" label="数据请求方" >
          </el-table-column>
          <el-table-column prop="dataRelease" label="发布日期" >
          </el-table-column>
          <el-table-column prop="dataFinish" label="截止日期" >
            <template #header="{ column }">
              <el-tooltip effect="dark" content="这里是悬浮内容" placement="top-start">
                <span>{{ column.label }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="taskState" label="拍卖状态" >
          </el-table-column>        
          <el-table-column label="所属产业链" prop="chain" >
          </el-table-column>
          <el-table-column label="交付详情" align="center"  class-name="small-padding fixed-width">
            <el-button link type="primary" icon="Edit" @click="showPaymentDetails" ></el-button>
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
          <el-table-column prop="value" label="值" >
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideProfitDetails">关闭</el-button>
        </span>
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

      <!-- <el-row type="flex" justify="space-around">
          <el-col :span="24">
            <el-card shadow="hover">
              <div id="echarts-line" ref="echarts_line"></div>
            </el-card>
          </el-col>
        </el-row> -->
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
            <div id="echarts-scatter" ref="echarts_scatter"></div>
          </el-card>
        </el-col>
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

// const dataFiltered =ref([]);
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
if(ValueDataRelease.value){dataFiltered
const dataFinishDate = ValueDataRelease.value;

const formattedDate = `${dataFinishDate.getFullYear()}-${(dataFinishDate.getMonth() + 1).toString().padStart(2, '0')}-${dataFinishDate.getDate().toString().padStart(2, '0')}`;

ValueDataRelease.value =formattedDate  }
}

var dataFiltered = JSON.parse(JSON.stringify(allData.value));
// var dataFiltered = deepCopy(allData);
function filtering() {
    // getAllTaskData();
    dataFiltered.value= JSON.parse(JSON.stringify(allData.value));
    console.log("before",allData.value)
    // console.log("before",ingData.value)

    
    console.log("before",dataFiltered.value)
    formattedDateData();
  // 根据 valueAuctionStatus 进行筛选
  if (valueAuctionStatus.value) {
    console.log("i ama in valueAuctionStatus")
    dataFiltered.value = dataFiltered.value.filter(item => item.taskState  === valueAuctionStatus.value);
  }

  // 根据 valueChain 进行筛选
  if (valueChain.value) {
    console.log("i ama in valueChain")
    dataFiltered.value = dataFiltered.value.filter(item => item.chain === valueChain.value);
  }

  // 根据 valueDataRelease 进行筛选
  if (ValueDataRelease.value) {
    console.log("i ama in ValueDataRelease")
    dataFiltered.value = dataFiltered.value.filter(item => item.dataRelease === ValueDataRelease.value);
  }

  console.log("after",dataFiltered.value)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////定义筛选当前用户是否购买//////////////////////////////////////////////
let currentCompany = ref('小鸭家电');

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

AuctionTaskForm.value.taskReleaser="小鸭家电"
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
          taskReleaser:'小鸭家电',
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
const tableDataAdd=ref([
  { 
    taskName:'四月电池销量',
    taskReleaser:'小鸭家电',
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
    taskReleaser:'小鸭家电',
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

  // createEchartsAccess1();
  createEchartsscater1();
    // createEchartsline2();

  getTaskData() ;
  load();

  // clasifytdata();
  });

const isDatadetailVisible = ref(null);
const isAuctiondetailVisible = ref(null);
const isPaymentdetailVisible = ref(null);
const showDataDetails = (row) =>{
  console.log(selectedRow);
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
  }


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
          taskReleaser:'小鸭家电',
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
</style>