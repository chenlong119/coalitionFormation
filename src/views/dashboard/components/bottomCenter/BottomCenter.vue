<script setup>
import Body from "@/views/dashboard/components/main/component/Body.vue";
import {getCurrentInstance, onMounted, ref} from "vue";
import * as echarts from "echarts";
import {getGroupInfo} from "@/api/datafusion/test.js";
const pieChart = ref(null);
let groupData = ref([]);
let pieData = ref([]);

let chartOptions = null;
chartOptions = {
  title: {
    text: '企业协作团体总览图',
    textStyle: {
      color: "#ffffff",
    },
    textAlign: 'center', // 设置标题文本水平居中
    left: '50%', // 将标题水平居中
    top: 'top', // 距离底部的距离
  },
  legend: {
    textStyle:
        {
          color: 'white',
          fontSize: 10,
        },
    left: 'center',
    top: 'bottom',
    formatter: function (id) {
      return '团体 ' + id; // 在每个图例项前加上 "Category "
    },
  },
};
const renderPieChart = async () => {

  const chartInstance = echarts.init(pieChart.value);
  //chartInstance.setOption(chartOptions);

  let res = await getGroupInfo();

  for (const group of res) {
    groupData.value.push({
      value: group.value,
      name: group.name,
      list: group.list,
      describe: group.describe,
    });
  }

  for (const group of groupData.value) {
    const dataItem = {
      value: group.value,
      name: group.name,
      list: group.list,
      describe: group.describe,
    };
    pieData.value.push(dataItem);
  }


  const tooltip = {
    trigger: 'item',
    // formatter: '{b} :<br/>企业数量： {c} ({d}%)'
    formatter: function (params) {
      // 查找对应团体的企业信息
      const groupInfo = groupData.value.find(group => group.name === params.name);
      if (groupInfo) {
        return `团体${params.name}企业数量: ${params.value} (${params.percent}%)<br>企业名单：${groupInfo.list}`;
      } else {
        return `${params.id}: ${params.value} (${params.percent}%)`;
      }
    },
  }
  const series = [
    {
      type: 'pie',
      left: 'center',
      bottom: 0,
      radius: '100%',
      roseType: 'area',
      data: pieData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        position: 'outside',  // 将标签放在扇形外部
        show: false,
      },
      focusNodeAdjacency: true,
      itemStyle: {
        borderWidth: 0,
      },
    },
  ];
  chartOptions.tooltip = tooltip;
  chartOptions.series = series;
  chartInstance.setOption(chartOptions);
};
onMounted(() => {
  //const chartInstance = echarts.init(pieChart.value);
  //chartInstance.setOption(chartOptions);
  renderPieChart();
})
</script>

<template>
  <Body :dec-id="3" :name="'群智汇聚'" icon="icon-huiju">
  <!--  <div ref="chartref" style="height:100%"></div>-->
  <div id="pieChart" ref="pieChart" class="container"
       style="flex: 1 0 25%; height: 100%; background-color: #0f1325;">
  </div>
  </Body>

</template>

<style scoped lang="scss">

</style>