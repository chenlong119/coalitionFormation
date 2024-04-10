<script setup>
import * as echarts from 'echarts';

const bar = ref(null);
const pie = ref(null);
const props = defineProps({
  resourceData: Array
})

let barChart = null;
let pieChart = null;

const updateChart = () => {
  const categories = props.resourceData.map(item => item.name);
  const num = props.resourceData.map(item => item.num);
  const pieData = props.resourceData.map(item => {
    return {
      value: item.num,
      name: item.name
    }
  })
  let barOption = {
    xAxis: {
      type: 'category',
      data: categories
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        data: num,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };
  let pieOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '资源详情',
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
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
        data: pieData
      }
    ]
  };
  barChart.setOption(barOption);
  pieChart.setOption(pieOption);
}

watch(() => props.resourceData, () => {
  updateChart();
});

onMounted(() => {
  barChart = echarts.init(bar.value);
  pieChart = echarts.init(pie.value);
  updateChart();
})
</script>

<template>
  <el-row :gutter="20" class="dialogContent">
    <el-col :span="14">
      <div class="barChart" ref="bar"></div>
    </el-col>
    <el-col :span="10">
      <div class="pieChart" ref="pie"></div>
    </el-col>
  </el-row>
</template>

<style scoped>
.dialogContent {
  width: 800px;
  height: 300px;
}

.barChart {
  width: 500px;
  height: 300px;
}

.pieChart {
  width: 300px;
  height: 300px;
}
</style>