<script setup>

import TaskTable from "@/views/coalitionformation/taskcoalition/TaskTable.vue";
import TaskGraph from "@/views/coalitionformation/taskcoalition/TaskGraph.vue";
import TaskChainPie from "@/views/coalitionformation/taskcoalition/TaskChainPie.vue";
import TaskStatusPie from "@/views/coalitionformation/taskcoalition/TaskStatusPie.vue";
import TaskCompanyPie from "@/views/coalitionformation/taskcoalition/TaskCompanyPie.vue";
import TaskRelationWM from "@/views/coalitionformation/taskcoalition/TaskRelationWM.vue";
import {getCurrentInstance} from "vue";
import TaskRelationKt from "@/views/coalitionformation/taskcoalition/TaskRelationKt.vue";
import TaskRelationCar from "@/views/coalitionformation/taskcoalition/TaskRelationCar.vue";
const chainType=ref("洗衣机产业链")
const {proxy}=getCurrentInstance()
const { chain } = proxy.useDict('chain');
const getType=()=>{
  if(chainType.value==="洗衣机产业链")
    return 1;
  else
    return chainType.value;
}

const chains=['洗衣机产业链','空调产业链','汽车产业链']
const openDrawer=ref(false)
const handleExpand=()=>{
  openDrawer.value=true;
}
</script>

<template>
  <div>
    <el-row class="row1">
      <TaskTable/>
    </el-row>
    <el-row :gutter="10" class="row2">
      <el-col :span="8">
        <div class="taskGraph">
          <div class="graphHeader">
            <span>当前产业链：</span>
          <el-select  placeholder="请选择产业链" style="width:150px" v-model="chainType">
            <el-option
                v-for="dict in chain"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
              <el-button type="primary" style="margin-left: 5px" @click="handleExpand">展开成链</el-button>
          </div>
        <el-card shadow="hover">
          <TaskGraph :chain-type="getType()"/>
        </el-card>
        </div>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover">
          <TaskChainPie/>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="hover" class="part1">
          <TaskStatusPie/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <TaskCompanyPie/>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer v-model="openDrawer" size="1500">
      <template #header>
        <h3>{{chains[getType()-1]+"上的任务详情"}}</h3>
      </template>
      <TaskRelationWM v-if="getType()==1"/>
      <TaskRelationKt v-if="getType()==2"/>
      <TaskRelationCar v-if="getType()==3"/>
    </el-drawer>
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

.taskGraph{
  position: relative;
  .graphHeader{
    position: absolute;
    top: -35px; /* 负的高度，使得在上方 */
    left: 0;
    width: 100%;
  }
}
</style>