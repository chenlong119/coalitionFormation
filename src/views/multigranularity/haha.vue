<template>
  <div id="app1">
    <h1 class="page-title">多粒度决策系统</h1>
    <hr class="divider">
    <el-row 
    :gutter="30" 
    class="row-container">
      <!-- Left Column for Charts -->
      <el-col 
      :span="12" 
      class="chart-container">
        <div class="box-card">
          
          <div 
          ref="pieChartRef" 
          class="chart">
        </div>

        </div>
        <div class="box-card">
          
          <div 
          ref="lineChartRef" 
          class="chart">
        </div>

        </div>
      </el-col>

      <!-- Right Column for Table -->
      <el-col :span="12">
        <div class="box-card">
          <h3 class="productStatusTitle">产品合格情况</h3>
          <el-table :data="productData" class="el-table">

            <!-- Selection Column -->
            <el-table-column 
            type="selection" 
            width="55" 
            align="center">
          </el-table-column>

            <!-- Product ID Column -->
            <el-table-column 
            prop="id" 
            label="产品ID" 
            width="100" 
            align="center">
          </el-table-column>

            <!-- Product Name Column -->
            <el-table-column 
            prop="name" 
            label="产品名称" 
            align="center">
          </el-table-column>

            <!-- Status Column -->
            <el-table-column 
            label="是否合格" 
            width="120">
              <template #default="{ row }">
                <el-tag v-if="row.status === '合格'" type="success">合格</el-tag>
                <el-tag v-else-if="row.status === '不合格'" type="danger">不合格</el-tag>
                <el-tag v-else type="warning">待定</el-tag>
              </template>
            </el-table-column>
            
            <!-- Additional Columns and Actions -->
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" 
                style="padding: 8px 16px; 
                font-size: 12px;" 
                @click="viewDetails(row.id)">
                查看详情
              </el-button>

              </template>
            </el-table-column>
          </el-table>
          <!-- Pagination -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="productData.length"
            @current-change="handleCurrentChange"
            class="mt-4"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

import { ElTable, ElTableColumn, ElTag, ElRow, ElCol } from 'element-plus';

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElTag,
    ElRow,
    ElCol,
  },
  setup() {
    const pieChartRef = ref(null);
    const lineChartRef = ref(null);

    const productData = ref([
      { 
        id: 1, 
        name: '产品1', 
        status: '合格' 
      },
      { 
        id: 2, 
        name: '产品2', 
        status: '不合格' 
      },
      { 
        id: 3, 
        name: '产品3', 
        status: '待定' 
      },
      { 
        id: 4, 
        name: '产品4', 
        status: '合格' 
      },
      { 
        id: 5, 
        name: '产品5', 
        status: '不合格' 
      },
      { 
        id: 6, 
        name: '产品6', 
        status: '合格' 
      },

      { 
        id: 7, 
        name: '产品7', 
        status: '待定' 
      },
      { 
        id: 8, 
        name: '产品8', 
        status: '合格' 
      },
      { 
        id: 9, 
        name: '产品9', 
        status: '不合格'
      },
      { 
        id: 10,
        name: '产品10', 
        status: '待定' 
      }
    ]);

    onMounted(() => {
      // 创建扇形图
      const pieChart = echarts.init(pieChartRef.value);
const pieOption = {
  title: {
    text: '不同影响因素所占粒度大小',
    x: 'center',
    textStyle: {
      fontSize: 14,
      fontWeight: 'bolder'
    }
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: '70%',
      data: [
        { name: '因素1', value: 40 },
        { name: '因素2', value: 30 },
        { name: '因素3', value: 20 },
        { name: '因素4', value: 10 },
      ],
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      }
    },
  ],
};
pieChart.setOption(pieOption);

// 创建折线图
const lineChart = echarts.init(lineChartRef.value);
const lineOption = {
  title: {
    text: '合格率',
    x: 'center',
    textStyle: {
      fontSize: 14,
      fontWeight: 'bolder'
    }
  },
  tooltip: { 
    trigger: 'axis',
    formatter: '时间: {b0}<br/>合格率: {c0}%'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: 
    [
      '1月', 
      '2月', 
      '3月', 
      '4月', 
      '5月'
      
    ],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [82, 93, 90, 93, 98],
      type: 'line',
      areaStyle: {},
      smooth: true,
      itemStyle: {
        color: '#a18cd1',
        borderColor: '#754fa0'
      }
    },
  ],
};

lineChart.setOption(lineOption);
    });

    return {
      pieChartRef,
      lineChartRef,
      productData,
    };
  },
};


</script>
<style scoped>
#app1 {
  font-family: 'Arial', sans-serif;
  margin: 40px auto; /* 添加auto使内容居中 */
  max-width: 1200px;  /* 设置最大宽度 */
  color: #333;
}

.row-container {
  margin: 0 auto;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.box-card {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

h3 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

.chart {
  height: 280px;  
}

.el-table {
  border-radius: 12px;
  margin-top: 20px;
}

.mt-4 {
  margin-top: 20px;
}
.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 2em;
  margin-bottom: 20px;
}

.divider {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
.productStatusTitle {
    margin-top: 0px;  /* 调整上边距 */
    font-weight: bold; /* 字体加粗 */
    text-align: center; /* 居中对齐 */
  }
</style>