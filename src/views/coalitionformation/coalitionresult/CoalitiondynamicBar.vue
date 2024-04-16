<script setup>
import * as echarts from 'echarts';
import userTaskStore from "@/store/modules/task.js";
import request from "@/utils/request.js";
const dynamicBar=ref(null);
let barChart=null;
const taskStore=userTaskStore();
const draw=async ()=>{
  taskStore.tasks = await request({
    url: "/coalition/formation/getall"
  });
 let taskList=taskStore.tasks.map(item=>item.name);
}
onMounted(()=>{
  barChart=echarts.init(dynamicBar.value)
})
</script>

<template>
<div class="dynamicBar" ref="dynamicBar"></div>
</template>

<style scoped lang="scss">

</style>