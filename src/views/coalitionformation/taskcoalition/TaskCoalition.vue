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
    <el-row class="row1" :gutter="10">
      <el-col :span="18">
        <TaskTable/>
      </el-col>
      <el-col :span="6">
        <div class="taskStatistic">
          <div class="header">
            <span>平台企业统计</span>
          </div>
          <div class="body">
            <div class="cell">
              <div class="number">59</div>
              <div class="label">任务总数</div>
            </div>
            <div class="cell">
              <div class="number">22</div>
              <div class="label">正在执行</div>
            </div>
            <div class="cell">
              <div class="number">35</div>
              <div class="label">已完成</div>
            </div>
            <div class="cell">
              <div class="number">2</div>
              <div class="label">执行失败</div>
            </div>
          </div>
        </div>
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
          <el-card shadow="hover" class="taskGraphCard">
            <TaskGraph :chain-type="getType()"/>
          </el-card>
        </div>
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

.taskStatistic
{
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
  text-align: center;

  .body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    .cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 1px solid #ccc;
      padding: 10px 0;
    }

    .number {
      font-size: 24px;
      font-weight: bold;
    }

    .label {
      font-size: 12px;
      color: #666;
    }

    & :nth-child(4) {
      border-right: none;
    }
  }
}
.header {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
</style>