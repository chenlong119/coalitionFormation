<script setup>
import * as echarts from 'echarts';
import taskData from "@/assets/task_jd.json"

const taskGraph = ref(null);
let option = {
  title: {
    text: '多重产业链网络任务关系图',
    left: 'center',
    top: 0
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'circular',
      symbolSize: 50,
      roam: false,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      data: taskData.nodes,
      links: taskData.links,
      lineStyle: {
        width: 2,
        curveness: 0.2
      },
      emphasis: { // 高亮状态
        focus: 'adjacency'
      }
    }
  ]
};
onMounted(() => {
  let taskGraphInstance = echarts.init(taskGraph.value);
  taskGraphInstance.setOption(option)
})
</script>

<template>
  <div class="taskGraph" ref="taskGraph"></div>
</template>

<style scoped lang="scss">
.taskGraph {
  width: 100%;
  height: 470px
}
</style>