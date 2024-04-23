<template>
  <div :gutter="10" style="display:flex;height:60%">
    <div style="width:25%">
      <dv-border-box-12 class="pd">
        <LeftTop/>
      </dv-border-box-12>
    </div>
    <div style="height:100%; width:75%">
      <CompanyRelationGraph/>
    </div>
  </div>

  <el-row :gutter="10" style="height:40%">
    <el-col :span="8">
      <dv-border-box-8 class="pd">
        <BottomLeft/>
      </dv-border-box-8>
    </el-col>
    <el-col :span="8">
      <dv-border-box-12 class="pd">
        <BottomCenter/>
      </dv-border-box-12>
    </el-col>
    <el-col :span="8">
      <dv-border-box-8 class="pd">
        <BottomRight/>
      </dv-border-box-8>
    </el-col>
  </el-row>
</template>

<script setup>
import LeftTop from "../leftTop/LeftTop.vue";
import BottomCenter from "../bottomCenter/BottomCenter.vue";
import BottomRight from "../bottomRight/BottomRight.vue";
import BottomLeft from "../bottomLeft/BottomLeft.vue";
import CompanyRelationGraph from "../multilayer/CompanyRelationGraph.vue"
</script>

<style scoped>
.pd {
  padding: 10px;
}
</style>