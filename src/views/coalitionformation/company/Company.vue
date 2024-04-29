<script setup>

import CompanyTable from "@/views/coalitionformation/company/CompanyTable.vue";
import CompanyRelation from "@/views/coalitionformation/company/CompanyRelation.vue";
import CompanyMap from "@/views/coalitionformation/company/CompanyMap.vue";
</script>

<template>
  <div>
    <el-row class="row1">
      <company-table></company-table>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="13">
          <company-relation/>
      </el-col>
      <el-col :span="11">
          <company-map/>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.row1 {
  margin-bottom: 10px;
  width: 100%;
}
</style>