<template>
  <div ref="chartRef" style="height: 100%;width:100%">
  </div>
</template>

<script setup>
import {getCurrentInstance, onBeforeUnmount, onMounted, ref} from "vue";

const {proxy} = getCurrentInstance();
const chartRef = ref(null);
let intervalInstance = null;
const cdata = {
  xData: ['资源1', '资源2', '资源3', '资源4', '资源5', '资源6'],
  seriesData: [
    {value: 10, name: '资源1'},
    {value: 10, name: '资源2'},
    {value: 15, name: '资源3'},
    {value: 25, name: '资源4'},
    {value: 20, name: '资源5'},
    {value: 35, name: '资源6'},
  ],
}
let chart = null;
const initChart = () => {
  chart = proxy.$echarts.init(chartRef.value);
  const options = {
    color: [
      '#37a2da',
      '#32c5e9',
      '#9fe6b8',
      '#ffdb5c',
      '#ff9f7f',
      '#fb7293',
      '#e7bcf3',
      '#8378ea'
    ],
    tooltip: {
      trigger: 'item',
      formatter: function(params){
        return params.data.name+"需求数量："+params.data.value;
      }
    },
    toolbox: {
      show: true
    },
    calculable: true,
    legend: {
      orient: 'horizontal',
      icon: 'circle',
      bottom: 0,
      x: 'center',
      textStyle: {
        color: '#fff'
      },
      width: '50%',
    },
    series: [
      {
        type: 'pie',
        radius: [10, 50],
        roseType: 'area',
        center: ['50%', '40%'],
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: true,
          color: "#fff",
        },
        emphasis: {
          label: {
            show: false
          }
        },
      }
    ]
  }
  chart.setOption(options)
};
const updateChart = () => {
  const options = {
    legend: {
      data: cdata.xData
    },

    series: [
      {
        data: cdata.seriesData
      }
    ]
  };
  chart.setOption(options);
}
const interval = () => {
  intervalInstance = setInterval(() => {
    const data = cdata.seriesData;
    cdata.seriesData = data.map((e) => {
      return {value: e.value + 10, name: e.name}
    });
    updateChart();
  }, 1000)
}
onBeforeUnmount(() => {
  clearInterval(intervalInstance)
})
onMounted(() => {
  initChart();
  updateChart();
  interval();
})
</script>

<style scoped>

</style>