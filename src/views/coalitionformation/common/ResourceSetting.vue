<script setup>
import request from "@/utils/request.js";
import {ElMessage} from "element-plus";

const props = defineProps(["ckey"])

let prefix = null;
let id = ref();
let chainId = ref();
let placeholder="";
let isTask = props.ckey === "task";
if (isTask) {
  prefix = "任务";
  placeholder="范围[100,250]";
} else {
  prefix = "企业";
  placeholder="范围[100,150]";
}
const chainNames = ["洗衣机产业链", "空调产业链", "汽车产业链"]
let chain = ref("");
const getChain = () => {
  chain.value = chainNames[chainId.value - 1]
}
let cname = ref("");
const getNameById = async () => {
  const res = await request({
    url: "/coalition/company/show/getbyid",
    params: {
      id: id.value
    }
  })
  cname.value = res[0].name;
}
let cResource = ref([]);
const getCompanyResource = async () => {
  const res = await request({
    url: "/resource/getCompanyResource",
    params: {
      companyId: id.value,
      layerId: chainId.value
    }
  })
  cResource.value = res;
  cResource.value.forEach(resource => {
    resource.isAdd = false;
    resource.isUpdate = false;
    resource.isDelete = false;
  })
}

let tname = ref("");
const getTaskNameById = async () => {
  const res = await request({
    url: "/coalition/coalition/formation/getone",
    params: {
      id: id.value
    }
  })
  tname.value = res.name;
}

let tResource = ref([]);
const getTaskResource = async () => {
  const res = await request({
    url: "/coalition/resource/getTaskResource",
    params: {
      task_id: id.value
    }
  })
  tResource.value = res;
  tResource.value.forEach(resource => {
    resource.isUpdate = false;
    resource.isDelete = false;
  })
}

const getResourceDetail = () => {
  if (!isTask) {
    getCompanyResource()
  } else {
    getTaskResource();
  }
}

const handleDelete = (resource) => {
  resource.isDelete = true;
}

const handleUpdate = (resource) => {
  resource.isUpdate = true;
}

const addedResource = ref([]);
const addResource = () => {
  addedResource.value.push({
    id: "",
    name: "",
    num: "",
  })
}
const getResourceNameById = async (resource) => {
  if(isTask)
  {
    if(id.value==null||id.value==="")
    {
      ElMessage.error("请先输入任务编号");
      return ;
    }
    const r = await request({
      url: "/coalition/resource/getone",
      params: {
        id: resource.id,
        taskId: id.value
      }
    })
    resource.name = r.name;
  }
  if(!isTask)
  {
    if(id.value==null||id.value==="")
    {
      ElMessage.error("请先输入任务编号");
      return ;
    }
    if(chainId.value==null||chainId.value==="")
    {
      ElMessage.error("请先输入企业所属产业链编号");
      return ;
    }
    const r = await request({
      url: "/coalition/resource/getone",
      params: {
        id: resource.id,
        companyId: id.value,
        layerId: chainId.value
      }
    })
    resource.name = r.name;
  }
}
const addedDelete = (resource) => {
  const index = addedResource.value.indexOf(resource);
  addedResource.value.splice(index, 1);
}
const clearData = () => {
  id.value = "";
  chainId.value = "";
  cname.value = "";
  chain.value = "";
  cResource.value = [];
  tname.value = "";
  tResource.value = [];
  addedResource.value = [];
}
//把资源配置写到数据
const submit = () => {
  if (isTask) {
    let updateArr = [];
    tResource.value.forEach(item => {
      if (item.isUpdate && !item.isDelete) {
        updateArr.push({
          id: item.id,
          name: item.name,
          num: item.num
        })
      }
    })
    let deleteArr = [];
    tResource.value.map((item) => {
      if (item.isDelete) {
        deleteArr.push({
          id: item.id,
          name: item.name,
          num: item.num
        })
      }
    })
    if (updateArr.length > 0) {
      request({
        url: "/coalition/resource/updateTaskResource",
        method: 'put',
        params: {
          taskId: id.value
        },
        data: updateArr
      })
    }
    if (deleteArr.length > 0) {
      request({
        url: "/coalition/resource/deleteTaskResource",
        method: 'delete',
        params: {
          taskId: id.value,
          resources: deleteArr.map(item => item.id).join(",")
        }
      })
    }
    if (addedResource.value.length > 0) {
      request({
        url: "/coalition/resource/insertTaskResource",
        method: 'post',
        params: {
          taskId: id.value,
        },
        data: addedResource.value
      })
    }
  } else {
    let updateArr = [];
    cResource.value.forEach(item => {
      if (item.isUpdate && !item.isDelete) {
        updateArr.push({
          id: item.id,
          name: item.name,
          num: item.num
        })
      }
    })
    let deleteArr = [];
    cResource.value.map((item) => {
      if (item.isDelete) {
        deleteArr.push({
          id: item.id,
          name: item.name,
          num: item.num
        })
      }
    })
    if (updateArr.length > 0) {
      request({
        url: "/coalition/resource/updateCompanyResource",
        method: 'put',
        params: {
          companyId: id.value,
          layerId: chainId.value
        },
        data: updateArr
      })
    }
    if (deleteArr.length > 0) {
      request({
        url: "/coalition/resource/deleteCompanyResource",
        method: 'delete',
        params: {
          companyId: id.value,
          layerId: chainId.value,
          resources: deleteArr.map(item => item.id).join(",")
        },
      })
    }
    if (addedResource.value.length > 0) {
      request({
        url: "/coalition/resource/insertCompanyResource",
        method: 'post',
        params: {
          companyId: id.value,
          layerId: chainId.value,
        },
        data: addedResource.value
      })
    }
  }
}

defineExpose({
  clearData,
  submit
})
</script>

<template>
  <el-form label-width="200px">
    <el-form-item :label="prefix+'编号'">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-input v-model="id" placeholder="请输入企业编号" @keyup="getNameById" v-if="!isTask"></el-input>
          <el-input v-model="id" placeholder="请输入任务编号" @keyup="getTaskNameById" v-else></el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="cname" disabled v-if="!isTask"></el-input>
          <el-input v-model="tname" disabled v-else></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="企业所属产业链编号" v-if="!isTask">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-input v-model="chainId" placeholder="输入企业所属产业链编号" @keyup="getChain"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="chain" disabled></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getResourceDetail">获取资源信息</el-button>
    </el-form-item>
    <el-form-item label="资源详情">
      <div v-if="!isTask">
        <template v-for="resource in cResource" :key="resource.id">
          <el-row :gutter="5" v-if="!resource.isDelete">
            <el-col :span="3">
              <el-button link icon="Delete" @click="handleDelete(resource)"></el-button>
            </el-col>
            <el-col :span="7">
              <el-input v-model="resource.id" disabled></el-input>
            </el-col>
            <el-col :span="7">
              <el-input v-model="resource.name" disabled></el-input>
            </el-col>
            <el-col :span="7">
              <el-input v-model="resource.num" @change="handleUpdate(resource)"></el-input>
            </el-col>
          </el-row>
        </template>
      </div>
      <div v-else>
        <template v-for="resource in tResource" :key="resource.id">
          <el-row :gutter="5" v-if="!resource.isDelete">
            <el-col :span="3">
              <el-button link icon="Delete" @click="handleDelete(resource)"></el-button>
            </el-col>
            <el-col :span="7">
              <el-input v-model="resource.id" disabled></el-input>
            </el-col>
            <el-col :span="7">
              <el-input v-model="resource.name" disabled></el-input>
            </el-col>
            <el-col :span="7">
              <el-input v-model="resource.num" @change="handleUpdate(resource)"></el-input>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-form-item>
    <el-form-item label="添加资源">
      <el-button link type="primary" @click="addResource">点击此处添加资源</el-button>
    </el-form-item>
    <el-form-item>
      <template v-for="(resource,index) in addedResource" :key="index">
        <el-row :gutter="5">
          <el-col :span="2">
            <el-button link icon="Delete" @click="addedDelete(resource)"></el-button>
          </el-col>
          <el-col :span="7">
            <el-input v-model="resource.id" @keyup="getResourceNameById(resource)"></el-input>
          </el-col>
          <el-col :span="7">
            <el-input v-model="resource.name" disabled></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="resource.num" :placeholder="placeholder"></el-input>
          </el-col>
        </el-row>
      </template>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>