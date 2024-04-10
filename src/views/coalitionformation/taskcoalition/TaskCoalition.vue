<script setup>

import TaskTable from "@/views/coalitionformation/taskcoalition/TaskTable.vue";
import TaskGraph from "@/views/coalitionformation/taskcoalition/TaskGraph.vue";
import TaskChainPie from "@/views/coalitionformation/taskcoalition/TaskChainPie.vue";
import TaskStatusPie from "@/views/coalitionformation/taskcoalition/TaskStatusPie.vue";
import TaskCompanyPie from "@/views/coalitionformation/taskcoalition/TaskCompanyPie.vue";
</script>

<template>
  <div>
    <el-row class="row1">
      <TaskTable/>
    </el-row>
    <el-row :gutter="10" class="row2">
      <el-col :span="6">
        <el-card shadow="hover">
          <TaskGraph/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <TaskChainPie/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="part1">
          <TaskStatusPie/>
        </el-card>
        <el-card shadow="hover">
          <TaskCompanyPie/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.row1 {
  width: 100%;
  margin-bottom: 10px;
}

.part1 {
  width: 100%;
  margin-bottom: 5px;
}
</style>