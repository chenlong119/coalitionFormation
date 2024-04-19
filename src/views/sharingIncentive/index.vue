<script>
import Step3 from './components/currentsharing.vue'
import Step1 from './components/dataanalysis.vue'
import Step4 from './components/incentiveusage.vue'
import Step2 from './components/mysharing.vue'
import {computed, onMounted, ref} from "vue";
import * as echarts from 'echarts/core';
import {reactive} from 'vue'
import axios from 'axios';
export default {
    components:{Step1,Step2,Step3,Step4},
}
</script>

<template>
    <div>
        <div class="topicText">
            <h2>产业链数据共享激励</h2>
        </div>
        <el-tabs style="margin-left:20px" @tab-click="handleClick">
            <el-tab-pane label="共享态势">
                <el-card class="content-card">
                    <Step1></Step1>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="我的共享">
                <el-card class="content-card">
                    <Step2></Step2>
                </el-card>
            </el-tab-pane>            
            <el-tab-pane label="当前共享">
                <el-card class="content-card">
                    <Step3></Step3>
                </el-card>
            </el-tab-pane>            
            <el-tab-pane label="激励使用">
                <el-card class="content-card">
                    <Step4></Step4>
                </el-card>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<style scoped>


el-row {
  margin-bottom: 20px;
}

el-row:last-child {
  margin-bottom: 0;
}

el-col {
  border-radius: 4px;
}

grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.table {
  border: #2c3e50;
  align-content: center;
}

.topicText {
  text-align: center;
  font-family: BlinkMacSystemFont;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}


.card-header {
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  text-align: center;
}

.box-card {
  width: 480px;
}


</style>
