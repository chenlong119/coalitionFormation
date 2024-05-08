<template>
  <div >
    <h2 class="table-title">企业数据查询表</h2>

    <div class="select-container">
      <el-select class="el-select" v-model="filterType" placeholder="选择产业链">
        <el-option label="所有类别" value=""></el-option>
        <el-option v-for="option in uniqueTypes" :key="option" :label="option" :value="option"></el-option>
      </el-select>



        <el-input v-model="searchTerm" style="width: 300px;margin-bottom: 5px;" placeholder="请输入搜索关键词"></el-input>
    <el-button class="btn1" type="primary" @click="searchTasks" style="margin-bottom: 5px;"><el-icon><Search /></el-icon>搜索</el-button>

     
    </div>

    <el-table :data="filteredData" style="width: 100% " height="498px" padding="10px">
      <el-table-column 
      prop="id" 
      label="企业编号"  
      width=100 
      align="center">
    </el-table-column>

      <el-table-column 
      prop="name" 
      label="企业名称"  
      align="center">
    </el-table-column>

      <el-table-column
          prop="company_type"
          label="所属领域"
          align="center">
        <template #default="{row}">
          {{ companyTypeNames[row.company_type] }}
        </template>
      </el-table-column>
      <el-table-column
          prop="layer_id"
          label="所属产业链"
          align="center">
        <template #default="{row}">
          {{ industryLayerNames[row.layer_id] }}
        </template>
      </el-table-column>


      <el-table-column 
      prop="score" 
      label="综合评分"
      align="center">
    </el-table-column>


  <el-table-column 
      label="查看详情" 
      width="150" align="center">
      <template #default="{ row }">
        <el-button 
        @click="viewDetails(row)">详情</el-button>
        <el-dialog 
        v-model="dialogVisible"
        title="协同效果详情"
        width="30%"
        :modal="false">
  
    <div v-if="dialogContent">
      <p>1. 企业名称: {{ dialogContent.name }}</p>
      <p>2. 近期评分: {{ dialogContent.recentScores }}</p>
      <p>3. 评分较高项: {{ dialogContent.highScores }} </p>
      <p>4. 评分较低项: {{ dialogContent.lowScores }} </p>
    </div>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">关闭</el-button>
  </span>
</el-dialog>
      </template>
  </el-table-column>
    </el-table>
    
  </div>
</template>
<script>
import { ElDialog, ElTable, ElTableColumn, ElButton, ElInput, ElSelect, ElOption } from 'element-plus';
import { fetchEnterprises } from "@/api/multigranularity/datashow"; // 确保这个路径与您的项目结构匹配

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput,
    ElDialog,
    ElSelect,
    ElOption,
  },
  data() {
    return {
      companyTypeNames: {
        '1': '原料供应',
        '2': '零件生产',
        '3': '整机组装',
        '4': '销售和回收'

      },
      industryLayerNames: {
        '1': '洗衣机产业链',
        '2': '空调产业链',
        '3': '汽车产业链',
        '4': '冰箱产业链',


      },
      company_type:'',
      layer_id:'',
      data: [],
      searchTerm: '',
      filterType: '',
      dialogVisible: false,
      dialogContent: null,
    };
  },
  computed: {
      uniqueTypes() {
        if (!this.data.length) {
          console.warn('Data is available but empty.');
          return [];
        }

        // 创建一个 Set 来存储唯一的产业链名称
        const uniqueTypeSet = new Set(this.data.map(item => this.industryLayerNames[item.layer_id.toString()]));


        // 转换 Set 为 Array
        const types = Array.from(uniqueTypeSet);
        console.log('Unique types available:', types);
        return types;
      },


    filteredData() {
      console.log("Filtering data with searchTerm:", this.searchTerm, "and filterType:", this.filterType);
      // 根据选择的产业链名称查找对应的 layer_id
      const selectedLayerId = Object.keys(this.industryLayerNames).find(key => this.industryLayerNames[key] === this.filterType);

      // 筛选数据
      return this.data.filter(item =>
          item.name.includes(this.searchTerm) &&
          (this.filterType ? item.layer_id.toString() === selectedLayerId : true)
      );
    },
  },

  methods: {
    async loadData() {
      try {
        const response = await fetchEnterprises();
        if (response && response.length > 0) {
          this.data = response;  // 确保这里正确地将响应赋值给data
          console.log('Data loaded:', this.data);
        } else {
          console.error('No data returned from the API:', response);
        }
      } catch (error) {
        console.error('Error fetching enterprise data:', error);
      }
    },

    viewDetails(row) {
      // 模拟企业详细数据
      this.dialogContent = {
        name: row.name,
        recentScores: '92, 88, 91, 94, 90',
        highScores: '质量评价, 服务评价 >90分 ',
        lowScores: '交货情况 <70分 ',
      };
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
  mounted() {
    this.loadData();
  }
};

</script>


<style scoped>
 .el-overlay {
    background-color: rgba(255, 255, 255, 0.8)!important; /* 或任何其他颜色 */
  }
:deep(.el-table .el-table__body tr) {
    height: 45px !important;
}

:deep(.el-table .el-table__body tr td) {
    line-height: 3px !important;
}
.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.8em;
  margin-bottom: 20px;
}

.divider {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.table-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.el-select {
  
  width: 100%;
  max-width: 200px;
  margin-bottom: 5px;
  margin-left: 5px;
  z-index: 1;
}
.el-input {
  
  width: 100%;
  max-width: 200px;
  margin-bottom: 5px;
  margin-left: 100px;

}


.el-table {
  border-radius: 12px;
  margin-top: 2px;
  padding: 0;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);

}
.el-table-column {
  text-align: center;
  
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-button {
  padding: 6px 16px;
  font-size: 12px;
}

.mt-4 {
  margin-top: 2px;
}
/* 为弹窗添加自定义样式 */
:deep(.el-dialog__wrapper) {
  background-color: rgba(0, 0, 0, 0.5); /* 调整为你想要的颜色和透明度 */
}


/* 通用样式调整 */
:deep(.el-dialog) {
  background-color: #f9f9f9; /* 使用更柔和的背景颜色 */
  border-radius: 15px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1); /* 添加柔和的阴影效果 */
  padding: 20px; /* 添加内部填充以创建更多空间 */
}

:deep(.el-dialog__title) {
  //font-weight: 600; /* 使标题更加粗体 */
  //font-size: 20px; /* 增加标题字体大小 */
  //color: #333; /* 为标题设置深色字体 */
  //margin-bottom: 20px; /* 增加标题和内容之间的间距 */
}

:deep(.el-dialog__body) {
  //padding:  5px 10px; /* 添加内部填充以创建更多空间 */
  //font-size: 16px; /* 增加主体字体大小 */
  //line-height: 1.7; /* 设置更大的行高来改善可读性 */
  //color: #555; /* 为文本设置深色字体 */
}

:deep(.el-dialog__body p) {
 
  margin: 10px 0; 
  padding: 0 0 0 0%; /* 调整这个值来改变文字的起始位置 */
  text-align: left; 
  border-left: 3px solid #007BFF; 

  &::before {
    content: '';
   
  margin-left: 40px;
    top: 0;
    bottom: 0;
    width: 3px; /* 将它更改为你想要的宽度 */
   
  }
}



/* 按钮样式调整 */
:deep(.dialog-footer) {
  border-top: 1px solid #e9e9e9; /* 添加一个顶部边界来分隔底部按钮区域 */
  padding-top: 15px; /* 在按钮区域上方添加一些填充 */
}

:deep(.dialog-footer .el-button) {
  font-size: 16px; /* 增加字体大小来强调按钮 */
  background-color: #007BFF; /* 设置一个明亮的背景色来吸引注意力 */
  border-color: #007BFF; /* 使边界颜色与背景颜色匹配 */
  color: #fff; /* 为按钮文字设置一个亮白色 */
}

:deep(.dialog-footer .el-button:hover) {
  background-color: #0056b3; /* 添加一个深色的悬停效果 */
  border-color: #0056b3; /* 使悬停边框颜色匹配背景色 */
}

 .select-container {

   text-align: center; /* 文本居中 */
   margin-bottom: 10px; /* 添加一些底部边距 */
 }

 .el-select {
   display: inline-block; /* 使下拉框成为内联块元素 */
   /* 您可以根据需要调整其他样式 */
 }
 .el-select .el-input__inner {
   text-align: center; /* 文本居中 */
 }
</style>





