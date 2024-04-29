<script setup>

import Body from "@/views/dashboard/components/main/component/Body.vue";
import RTChart from "@/views/dashboard/components/rightTop/RTChart.vue";
const chainType=ref(1);
const changeChainType=()=>{
 chainType.value= Math.floor(Math.random() * 3) + 1
}
setInterval(()=>{
  changeChainType()
},10000)
</script>

<template>
  <Body :dec-id="3"  name="任务关系图" icon="icon-static">
    <RTChart :chain-type="chainType"></RTChart>
  </Body>
</template>

<style scoped lang="scss">

</style>