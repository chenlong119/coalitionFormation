<script setup>

import CoalitionTable from "@/views/coalitionformation/coalitionresult/CoalitionTable.vue";
import CoalitionStatusPie from "@/views/coalitionformation/coalitionresult/CoalitionStatusPie.vue";
import CoalitionRelation from "@/views/coalitionformation/coalitionresult/CoalitionRelation.vue";
import CoalitionCompany from "@/views/coalitionformation/coalitionresult/CoalitionCompany.vue";
import CoalitionTaskDynamicSort from "@/views/coalitionformation/coalitionresult/CoalitionTaskDynamicSort.vue";
</script>

<template>
  <div class="container">
    <div class="column1">
      <CoalitionTable/>
      <el-card shadow="hover">
        <CoalitionTaskDynamicSort/>
      </el-card>
    </div>
    <div class="column2">
      <div style="margin-top:10px">
        <el-card shadow="hover">
        <el-row :gutter="10">
          <el-col :span="12">
            <CoalitionCompany/>
          </el-col>
          <el-col :span="12">
            <CoalitionStatusPie/>
          </el-col>
        </el-row>
        </el-card>
      </div>
      <div style="margin-top: 10px">
        <CoalitionRelation/>
      </div>
    </div>
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