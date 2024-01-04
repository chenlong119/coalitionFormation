

<template>
  <div>
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
      <div style="font-size: 25px;margin-top: 10px; margin-bottom: 5px;">
        时间粒度推荐
      </div>
      <h style="width: 100%; margin-top: 10px; margin-bottom: 10px;"></h>


    </div>
    <h></h>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:data:add']"
        ><el-icon><Plus /></el-icon>   新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:data:edit']"
        > <el-icon> <Setting /> </el-icon> 修改 </el-button>
      </el-col> 
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
    
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:data:remove']"
        ><el-icon><SemiSelect /></el-icon>删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:data:export']"
        ><el-icon><FolderAdd /></el-icon>导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
 
  </div>

<hr style="width: 100%; margin-top: 10px; margin-bottom: 10px;">



  
    <el-table :data="currentTaskList" style="width: 100%">
    
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column prop="number" align="center" label="企业编号" width="100"></el-table-column>
    <el-table-column prop="name" align="center" label="企业名称"></el-table-column>
    <el-table-column label="开关" width="100">
    <template #default="{ row }">
      <el-switch v-model="row.switchValue"></el-switch>
    </template>
  </el-table-column>

    <el-table-column prop="amount" align="center" label="推荐时间粒度"></el-table-column>
   
        <el-table-column  label="操作" width="350">
          <el-button class="btn1" type="primary"  @click="toggleWindow">
  查看详情
</el-button>
<div v-if="show" class="floating-window" :style="{top: top + 'px', left: left + 'px'}">
  <div class="chart-title">协同率</div>
  <div class="chart-container" ref="chartContainer"></div>
</div>
      </el-table-column>
      
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="tasklist.length"
      @current-change="handleCurrentChange"
      class="mt-4"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import * as echarts from "echarts";
const chartContainer = ref(null);
export default {
  methods: {
   handleAdd ()  {
  // 示例：提示用户输入新项目的名称
  const newItemName = prompt('请输入新项目的名称：');
  if (newItemName) {
    // 在 tasklist 中添加新项目
    tasklist.value.push({
      name: newItemName,
      // ... 其他属性 ...
    });
    console.log(tasklist.value); // 检查 tasklist.value 是否已更新
  }
},
    
handleUpdate() {
  // 示例：提示用户选择要更新的项目
  const itemToUpdate = prompt('请输入要更新的项目名称：');
  if (itemToUpdate) {
    // 在 tasklist 中查找要更新的项目
    const item = tasklist.value.find(item => item.name === itemToUpdate);
    if (item) {
      // 示例：提示用户输入新名称
      const newName = prompt('请输入新名称：');
      if (newName) {
        // 更新项目的名称
        item.name = newName;
      }
    } else {
      alert('未找到指定的项目！');
    }
  }
},


handleDelete(){
  // Example: Prompt the user to select which item to delete
  const itemToDelete = prompt("Enter the name of the item to delete:");
  if (itemToDelete) {
    // Find the index of the item in the dataList
    const index = dataList.value.findIndex(item => item.name === itemToDelete);
    if (index !== -1) {
      // Remove the item from the dataList
      dataList.value.splice(index, 1);
    } else {
      alert("Item not found!");
    }
  }
},

    handleExport() {
      // 使用 this.tasklist 来访问响应式引用
      const header = Object.keys(this.tasklist.value[0]).join(",");
      const rows = this.tasklist.value.map(task =>
        Object.values(task)
          .map(value => (typeof value === "string" ? `"${value}"` : value))
          .join(",")
      );
      const csv = [header, ...rows].join("\n");

      // 下载 CSV 文件
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tasklist.csv";
      link.click();
      URL.revokeObjectURL(url);
    },
    // ...
  },




  setup() {

    const search = ref("");
    const show = ref(false);
    const top = ref(0);
    const left = ref(0);
    
    const tasklist = ref([
   
      {
        'name': '比亚迪汽车',
        'amount': 100,
        'x':[70,80,90,100,110,120,130],
        'y':[60,65, 70, 80, 75, 65,60],
        'type': '生产任务',
        'priority': '高',
        'deadline': '2021-07-01',
        'duration': 10,
        'state': '已分配',
        'number': 1
    },
    {
        'name': '宁德时代',
        'amount': 200,
        
        'type': '生产任务',
        'priority': '中',
        'deadline': '2021-07-02',
        'duration': 20,
        'state': '已分配',
        'number': 2
    },
    {
        'name': '小鸭家电',
        'amount': 300,
        
        'type': '销售任务',
        'priority': '低',
        'deadline': '2021-07-03',
        'duration': 30,
        'state': '未分配',
        'number': 3
    },
    {
        'name': '固特异轮胎',
        'amount': 400,
        
        'type': '生产任务',
        'priority': '高',
        'deadline': '2021-07-04',
        'duration': 40,
        'state': '未分配',
        'number': 4
    },
    {
        'name': '三花配件',
        'amount': 500,
        
        'type': '采购任务',
        'priority': '中',
        'deadline': '2021-07-05',
        'duration': 50,
        'state': '已分配',
        'number': 5
    },
    {
        'name': '大王玻璃',
        'amount': 600,
        
        'type': '采购任务',
        'priority': '低',
        'deadline': '2021-07-06',
        'duration': 60,
        'state': '未分配',
        'number': 6
    },
    {
        'name': '永恒电机  ',
        'amount': 700,
        
        'type': '生产任务',
        'priority': '高',
        'deadline': '2021-07-07',
        'duration': 70,
        'state': '未分配',
        'number': 7
    },
    {
        'name': '鸿蒙车机',
        'amount': 800,
      
        'type': '生产任务',
        'priority': '中',
        'deadline': '2021-07-08',
        'duration': 80,
        'state': '未分配',
        'number': 8
    },
    {
        'name': '销售汽车玻璃',
        'amount': 900,
      
        'type': '销售任务',
        'priority': '低',
        'deadline': '2021-07-09',
        'duration': 90,
        'state': '未分配',
        'number': 9
    },
    ]);
    tasklist.value.forEach(item => {
  item.switchValue = false;
});

    const pageSize = ref(8);
    const currentPage = ref(1);
    const chartInstance = ref(null);

    const filteredTaskList = computed(() => {
      if (search.value) {
        return tasklist.value.filter(task =>
          task.name.toLowerCase().includes(search.value.toLowerCase()) ||
          task.number.toString().includes(search.value)
        );
      } else {
        return tasklist.value;
      }
    });

    const currentTaskList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = currentPage.value * pageSize.value;
      return filteredTaskList.value.slice(start, end);
    });

    const handleCurrentChange = val => {
      currentPage.value = val;
    };

    const toggleWindow = event => {
      show.value = !show.value;
      top.value = event.clientY;
      left.value = event.clientX;

      if (show.value) {
        setTimeout(() => {
          const xData = [70, 80, 90, 100, 110, 120, 130];
          const yData = [60, 65, 70, 80, 75, 65, 60];
          renderChart(xData, yData);
          if (!chartInstance.value) {
            renderChart();
          }
        }, 0);
      } else {
        chartInstance.value = null;
      }
    };

    const searchTasks = () => {
      if (search.value) {
        currentTaskList.value = tasklist.value.filter(task =>
          task.name.toLowerCase().includes(search.value.toLowerCase()) ||
          task.number.toString().includes(search.value)
        );
      } else {
        currentTaskList.value = tasklist.value;
      }
    };

    const renderChart = (xData, yData) => {
      if (!chartInstance.value) {
        chartInstance.value = echarts.init(chartContainer.value);
      }

      const options = {
        xAxis: {
          type: "value",
          min: Math.min(...xData),
          max: Math.max(...xData),
        },
        yAxis: {
          type: "value",
          min: Math.min(...yData),
          max: Math.max(...yData),
        },
        series: [
          {
            data: yData.map((value, index) => [xData[index], value]),
            type: "line",
          },
        ],
      };

      chartInstance.value.setOption(options);
    };
    



    return {
      search,
      show,
      top,
      left,
      tasklist,
      pageSize,
      currentPage,
      chartInstance,
      chartContainer,
      filteredTaskList,
      currentTaskList,
      handleCurrentChange,
      toggleWindow,
      searchTasks,
      renderChart,
    };
  },
};
</script>


<style scoped>
.floating-window {
  position: fixed;
  top: 50px;
  left: 50px;
  width: 400px;
  height: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chart-container {
  width: 100%;
  height: 300px;
}
</style>
