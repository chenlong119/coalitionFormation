<script setup>
import * as echarts from 'echarts';
import useTaskStore from "@/store/modules/task.js";
import request from "@/utils/request.js";

const taskStore = useTaskStore();
const taskCompanyPie = ref();
let chartInstance = null;

const drawtaskCompanyPie = async () => {
  taskStore.tasks = await request({
    url: "/coalition/formation/getall"
  });
  const res = taskStore.tasks;
  //统计每种类别的个数 taskStatus 0,1,2,3
  let categoryArr = [];
  let data = [];
  res.forEach(item => {
    if (categoryArr.indexOf(item.companyId) === -1) {
      categoryArr.push(item.companyId);
      data.push({
        name: item.companyId,
        value: 1
      })
    } else {
      data.forEach(ditem => {
        if (ditem.name === item.companyId)
          ditem.value++;
      })
    }
  })
  //根据企业id获取企业名字
  let ids = data.map(item => item.name).join(",");
  const names = await request({
    url: "/company/show/getnames",
    params: {
      ids
    }
  })
  data.forEach((item, index) => {
    item.name = names[index];
  })
  data=data.filter(item=>item.name.length<=5)
  data=data.slice(0,6);
  let option = {
    title: {
      text: "任务所属企业分布图",
      top: 0,
      left: 'center'
    },
    legend: {
      left: 0,
      bottom: 0,
      orient: 'vertical'
    },
    tooltip: {
      show: true,
      trigger: 'item',
    },
    series: [
      {
        name: '任务所属企业分布',
        type: 'pie',
        center: ['50%', '53%'],
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
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
          show: true
        },
        data
      }
    ]
  };
  chartInstance.setOption(option);
}

onMounted(() => {
  chartInstance = echarts.init(taskCompanyPie.value);
  drawtaskCompanyPie()
})
</script>

<template>
  <div class="taskCompanyPie" ref="taskCompanyPie"></div>
</template>

<style scoped lang="scss">
.taskCompanyPie {
  width: 100%;
  height: 200px
}
</style>