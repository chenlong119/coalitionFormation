<template>
    <div>
      <el-dropdown>
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
      </el-dropdown>
      <el-main style="width: 100%;">
        <div>当前所在群组：比亚迪 秦 汽车能源供给合作数据共享组</div>    
      </el-main>

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

      <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><calendar /></el-icon>
              <span>
                企业详情
              </span>
            </span>
          </template>
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
        </el-table> 
        </el-tab-pane>
        <el-tab-pane label="当前共享">当前共享
          <el-table :data="dataTable" border stripe :header-cell-class-name="headerBg"  max-height="500" :fit="true">
            <el-table-column type="selection" width="65"> <!--多选框-->
            </el-table-column>
            <el-table-column prop="dataName" label="数据名称" >
            </el-table-column>
            <el-table-column prop="dataReleaser" label="数据提供方" >
            </el-table-column>
            <el-table-column prop="dataDate" label="上传日期" >
            </el-table-column>
            <el-table-column prop="hisClick" label="历史浏览量" >
            </el-table-column>    
            <el-table-column prop="recClick" label="最近浏览量" >
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
            <el-table-column label="下载" align="center"  class-name="small-padding fixed-width">
            <el-button link type="primary" icon="Edit" @click="showDataDetails" ></el-button>
          </el-table-column>
          <el-table-column label="评分评论" align="center"  class-name="small-padding fixed-width">
            <el-button link type="primary" icon="Edit" @click="openFileUploadDialog" ></el-button>
          </el-table-column>
          </el-table> 
        </el-tab-pane>
        <el-tab-pane label="我的共享">我的共享
          <el-table :data="dataTable" border stripe :header-cell-class-name="headerBg"  max-height="500" :fit="true">
            <el-table-column type="selection" width="65"> <!--多选框-->
            </el-table-column>
            <el-table-column prop="dataName" label="数据名称" >
            </el-table-column>
            <el-table-column prop="dataDate" label="上传日期" >
            </el-table-column>
            <el-table-column prop="hisClick" label="历史浏览量" >
            </el-table-column>    
            <el-table-column prop="recClick" label="最近浏览量" >
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
  /////showCommentDialogVisible///////////////////
  let commentFormData = ref({
    score: 0,
        comment: '',
  });
  const showCommentDialogVisible = ref(false);
  const openFileUploadDialog = () => {
  showCommentDialogVisible.value = true;
  };

  const closeShowCommentDialog = () => {
  showCommentDialogVisible.value = false;
  };
 ///////////////////////////////////////////////////////

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
            afterSalesEvaluationGain: 5});
  const showPopup = () => {
    isPopupVisible.value = true;
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

  const tablename = ref(null);
  const tableData = ref([]);
  const dataTable = ref([]);
  const companyData =ref([])
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
          ]

      const dataNow=[
        { 
          dataName: '双十一电视销售数据',
          dataReleaser: '闲鱼',
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
          dataReleaser: '小鸭家电',
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

          ]
          const dataCompany=[        {
          companyName: '小鸭家电',
          joinTime: '2023-01-01',
          sumData: 100,
          averageScore: 4.5,
          incomePercent:10,
        },
        {
          companyName: '比亚迪',
          joinTime: '2023-02-15',
          sumData: 150,
          averageScore: 3.8,
          incomePercent:20,
        },
        {
          companyName: '南孚电池',
          joinTime: '2023-03-01',
          sumData: 100,
          averageScore: 4.5,
          incomePercent:30,
        },
        {
          companyName: '超威电池',
          joinTime: '2023-03-16',
          sumData: 150,
          averageScore: 3.8,
          incomePercent:40,
        },
      ]
      tableData.value=dataInit
      dataTable.value=dataNow
      companyData.value=dataCompany
  };
  onMounted(() => {
    load();
    });
  function calculateWeightedGain(row) {
  // 在这里计算加权增益数值
  // 您的计算逻辑可以放在这里
  // 示例：假设计算逻辑是简单的加总
  const weightedGain = row.dataProviders.reduce((total, provider, index) => {
    return total + (row.dataProviderValues[index] * row.dataProviderRates[index] / 100);
  }, 0);

  // 使用 toFixed 保留一位小数并将结果转换为浮点数
  return parseFloat(weightedGain.toFixed(1));
  };

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
  </style>