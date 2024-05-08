<script setup>
import * as echarts from 'echarts';
const resourcePie=ref();
const props=defineProps(['data']);
onMounted(()=>{
  let resourcePieinstance=echarts.init(resourcePie.value);
  let option = {
    legend: {
     left:0,
      orient:'vertical'
    },
    tooltip:{

    },
    series: [
      {
        type: 'pie',
        radius: [50, 200],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data:props.data
      }
    ]
  };
  resourcePieinstance.setOption(option);
})
</script>

<template>
  <div class="resourcePie" ref="resourcePie">
  </div>
</template>

<style scoped lang="scss">
.resourcePie{
  width:100%;
  height: 400px;
}
</style>