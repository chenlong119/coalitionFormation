<script setup>
import * as echarts from 'echarts';

const taskCompletion = ref(null);
let data = [70, 34, 60, 78, 69, 80, 90]
let titlename = ['洗衣机发动机', '洗衣机外壳', '洗衣机电路板', '洗衣机电机', '洗衣机滚筒', '洗衣机控制板', '洗衣机排水管'];
let valdata = [70, 34, 60, 78, 69, 80, 90]
let myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6', '#F8B448', '#8B78F6'];
let option = {
  backgroundColor: '#0e2147',
  grid: {
    left: '4%',
    top:'5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    show: false
  },
  yAxis: [{
    show: true,
    data: titlename,
    inverse: true,
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#fff',
      formatter: function (value, index) {
        return [
          '{lg|' + (index + 1) + '}' + '{title|' + value + '} '
        ].join('\n')
      },
      rich: {
        lg: {
          backgroundColor: '#339911',
          color: '#fff',
          borderRadius: 15,
          align: 'center',
          width: 15,
          height: 15
        },
      }
    },
  },
    {
    show: true,
    inverse: true,
    data: valdata,
    axisLabel: {
      textStyle: {
        fontSize: 12,
        color: '#fff',
      },
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
  }
  ],
  series: [
    {
    name: '条',
    type: 'bar',
    yAxisIndex: 0,
    data: data,
    barWidth: 30,
    itemStyle: {
      normal: {
        barBorderRadius: 30,
        color: function (params) {
          let num = myColor.length;
          return myColor[params.dataIndex % num]
        },
      }
    },
    label: {
      normal: {
        show: true,
        position: 'inside',
        formatter: '{c}%'
      }
    },
  },
  {
    name: '框',
    type: 'bar',
    yAxisIndex: 1,
    barGap: '-100%',
    data: [100, 100, 100, 100, 100,100,100],
    barWidth: 40,
    itemStyle: {
      normal: {
        color: 'none',
        borderColor: '#00c1de',
        borderWidth: 3,
        barBorderRadius: 15,
      }
    }
  },
  ]
};
onMounted(() => {
  let myChart = echarts.init(taskCompletion.value);
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})

</script>

<template>
  <div class="taskCompletion" ref="taskCompletion">
  </div>
</template>

<style scoped lang="scss">
.taskCompletion {
  width: 900px;
  height: 350px;
}
</style>