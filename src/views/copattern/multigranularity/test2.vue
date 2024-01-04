<template>
  <el-row :gutter="4" class="flex-container">
    <el-col :span="16">
      <div class="box-card">
        <h3 class="productStatusTitle">企业关系评估</h3>
        <el-table :data="productData" class="el-table">
          <!-- Selection Column -->
          <el-table-column 
          type="selection" 
          width="55" 
          align="center">
        </el-table-column>

          <!-- Task ID Column -->
          <el-table-column 
          prop="id" 
          label="任务ID" 
          width="100" 
          align="center">
        </el-table-column>

          <!-- Task Name Column -->
          <el-table-column 
          prop="name" 
          label="任务名称" 
          align="center">
        </el-table-column>

          <!-- Enterprise Relationship Strength Column -->
          <el-table-column 
          label="企业关系强度" 
          align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === '强'" type="success">强</el-tag>
              <el-tag v-else-if="row.status === '弱'" type="danger">弱</el-tag>
              <el-tag v-else type="warning">中等</el-tag>
            </template>
          </el-table-column>

          <!-- Decision Factors Column -->
          <el-table-column label="决策因素" align="center">
    <template #default="{ row }">
      <el-tooltip
        placement="top"
        effect="light"
        open-delay="200"
      >
        <template #content>
          <div 
          :ref="el => 
          { chartRefs[row.id] = el }" 
          style="width: 400px;
          height:300px;">
          </div>
        </template>

        <el-button 
        type="text" 
        @click="togglePopover(row.id)">
        详细
      </el-button>
      </el-tooltip>

      <el-dialog 
      :visible.sync="showPopoverMap[row.id]" 
      width="20%" 
      @open="initChart(row.id)" 
      @close="destroyChart(row.id)">

      <div 
      :ref="el => 
      { chartRefs[row.id] = el }" 
      style="width: 400px;
      height:300px;" 
      v-if="showPopoverMap[row.id]">
    </div>

</el-dialog>
    </template>
  </el-table-column>

          <!-- Operations Column -->
          <el-table-column 
            label="操作" 
             align="center">
            <template #default="{ row }">
              <el-button type="link" 
              @click="viewDetails(row.id)">
              查看详情
            </el-button>
            </template>
          </el-table-column>

        </el-table>

        <!-- Pagination -->
        
          <el-pagination 
          background layout="prev, pager, next" 
          :page-size="10" 
          :total="productData.length" 
          @current-change="handleCurrentChange" 
          class="mt-4">
        </el-pagination>
        </div>
      </el-col>
    </el-row>
  </template>


<script setup>
import { ref, nextTick } from 'vue';
import { ElTable, ElTableColumn, ElDialog, ElButton, ElTag, ElTooltip, ElPagination } from 'element-plus';
import * as echarts from 'echarts';

const productData = ref([
  { 
    id: 1, 
    name: '任务1', 
    status: '强' 
  },
  { 
    id: 2, 
    name: '任务2', 
    status: '弱' 
  },
  { 
    id: 3, 
    name: '任务3', 
    status: '强' 
  },
  { 
    id: 4, 
    name: '任务1', 
    status: '强' 
  },
  { 
    id: 5, 
    name: '任务2', 
    status: '弱' 
  },
  { 
    id: 6, 
    name: '任务3', 
    status: '中等' 
  },
  { 
    id: 7, 
    name: '任务1', 
    status: '强' 
  },
  { 
    id: 8, 
    name: '任务2', 
    status: '弱' 
  },
  { 
    id: 9, 
    name: '任务3', 
    status: '中等' 
  },
]);

const showPopoverMap = ref({});
const chartRefs = ref({});

const initChart = (id) => {
  nextTick(() => {
    if (chartRefs.value[id]) {
      const chartInstance = echarts.init(chartRefs.value[id]);
      chartInstance.setOption({
        series: [
          {  tooltip: {
    trigger: 'item'
  },
            type: 'pie',
            radius: '60%',
            data: [
            { value: 1048, name: '因素一' },
              { value: 735, name: '因素二' },
              { value: 580, name: '因素三' },
              { value: 484, name: '因素四' },
              { value: 300, name: '因素五' },
              { value: 265, name: '因素六' },

            ],
            itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      }
          },
        ],
      });
      chartInstance.resize(); 
    }
  });
  
};

const destroyChart = (id) => {
  if (chartRefs.value[id]) {
    echarts.dispose(chartRefs.value[id]);
  }
};

const togglePopover = (id) => {
  showPopoverMap.value[id] = !showPopoverMap.value[id];
  if (showPopoverMap.value[id]) {
    initChart(id);  // 直接在这里初始化图表
  } else {
    destroyChart(id);  // 关闭对话框的时候销毁图表
  }
};

const viewDetails = (id) => {
  // your viewDetails logic here
};

const handleCurrentChange = (currentPage) => {
  // your pagination logic here
};
</script>



  
  
  
  <style scoped>
  .box-card {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
  }
  .el-table {
    border-radius: 12px;
    margin-top: 20px;
  }
  .mt-4 {
    margin-top: 20px;
  }
  .productStatusTitle {
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
  }
  .flex-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .pie-chart {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #ff0000, 
      #ff0000 25%, 
      #00ff00 25%, 
      #00ff00 50%, 
      #0000ff 50%, 
      #0000ff 75%, 
      #ff00ff 75%, 
      #ff00ff 100%
    );
  }
  </style>
  