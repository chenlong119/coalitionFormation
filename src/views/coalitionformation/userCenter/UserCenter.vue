<script setup>
import request from "@/utils/request.js";
import ResourcePie from "@/views/coalitionformation/userCenter/ResourcePie.vue";
import CompanyTaskTable from "@/views/coalitionformation/userCenter/CompanyTaskTable.vue";
import CompanyCoalitionTable from "@/views/coalitionformation/userCenter/CompanyCoalitionTable.vue";
let currentCompany=ref(null);
let companyResource=ref([]);
const chains=['洗衣机产业链','空调产业链','汽车产业链']
const companyTypes=['原料供应','零件生产','整机组装','销售和回收']
const state=['异常','工作','空闲']
let data=ref([]);
onMounted(async ()=>{
  let res=await request({
    url: "/userCenter/getUserInfo"
  })
  currentCompany.value=res[0];
  let res2=await request({
    url: "/resource/getCompanyResource",
    params: {
      companyId: res[0].id,
      layerId: res[0].layerId
    }
  })
  companyResource.value=res2;
  data.value=res2.map(item=>{
    return {
      name:item.name,
      value:item.num
    }
  })
})
</script>

<template>
  <div class="container">
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="text-align: center">
              <span style="font-weight: 600">企业基本信息</span>
            </div>
          </template>
          <el-form  label-width="120px">
            <el-form-item label="企业编号" :model="currentCompany">
              <el-input :value="currentCompany?.id" style="width:80px"></el-input>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input :value="currentCompany?.name" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="所在产业链">
              <el-input :value="chains[currentCompany?.layerId-1]" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="企业地址">
              <el-input :value="currentCompany?.address" style="width:100px"></el-input>
            </el-form-item>
            <el-form-item label="企业类型">
              <el-input :value="companyTypes[currentCompany?.companyType-1]" style="width:150px"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
              <el-input :value="state[currentCompany?.status-1]" style="width:100px"></el-input>
            </el-form-item>
            <el-form-item label="拥有资源种类数">
              <el-input :value="companyResource.length" style="width:100px"></el-input>
            </el-form-item>
            <el-form-item label="当前联盟编号">
              <el-input :value="currentCompany?.coalitionId" style="width:100px"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div style="text-align: center">
              <span style="font-weight: 600">企业资源信息</span>
            </div>
          </template>
          <ResourcePie :data="data" v-if="data.length>0"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="13">
        <el-card shadow="hover">
          <template #header>
            <div style="text-align: center">
              <span style="font-weight: 600">企业任务信息</span>
            </div>
          </template>
          <CompanyTaskTable :current-company="currentCompany" v-if="currentCompany"/>
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-card shadow="hover">
          <template #header>
            <div style="text-align: center">
              <span style="font-weight: 600">企业联盟信息</span>
            </div>
          </template>
          <CompanyCoalitionTable :current-company="currentCompany" v-if="currentCompany"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>