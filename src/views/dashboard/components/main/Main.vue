<template>
  <el-row :gutter="10" style="height:60%;margin-bottom: 5px">
    <el-col :span="6">
      <dv-border-box-12 class="pd">
        <LeftTop/>
      </dv-border-box-12>
    </el-col>
    <el-col :span="11">
      <TopCenter/>
    </el-col>
    <el-col :span="7">
      <dv-border-box-12 class="pd">
        <RightTop/>
      </dv-border-box-12>
    </el-col>
  </el-row>

  <el-row :gutter="10" style="height:40%">
    <el-col :span="8">
      <dv-border-box-8 class="pd">
        <BottomLeft/>
      </dv-border-box-8>
    </el-col>
    <el-col :span="8">
      <dv-border-box-8 class="pd">
        <BottomRight/>
      </dv-border-box-8>
    </el-col>
    <el-col :span="8">
      <dv-border-box-12 class="pd">
        <NewBottomCenter/>
      </dv-border-box-12>
    </el-col>
  </el-row>
</template>

<script setup>
import LeftTop from "../leftTop/LeftTop.vue";
import BottomRight from "../bottomRight/BottomRight.vue";
import BottomLeft from "@/views/dashboard/components/bottomLeft/BottomLeft.vue";
import TopCenter from "@/views/dashboard/components/topCenter/TopCenter.vue";
import RightTop from "@/views/dashboard/components/rightTop/RightTop.vue";
import NewBottomCenter from "@/views/dashboard/components/bottomCenter/NewBottomCenter.vue";
</script>

<style scoped>
.pd {
  padding: 10px;
}
</style>