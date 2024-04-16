<script setup>

import CoalitionTable from "@/views/coalitionformation/coalitionresult/CoalitionTable.vue";
import CoalitiondynamicBar from "@/views/coalitionformation/coalitionresult/CoalitiondynamicBar.vue";
</script>

<template>
  <div class="container">
    <div class="column1">
      <CoalitionTable/>
      <CoalitiondynamicBar></CoalitiondynamicBar>
    </div>
    <div class="column2">222</div>
  </div>
</template>

<style scoped lang="scss">
.container{
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 900px;
  .column1{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 50%;
    height: 100%;
    margin-right: 5px;
  }
  .column2{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 50%;
    height: 100%;
  }
}
</style>