<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="businessList">
      <el-table-column label="企业编号" align="center" prop="id"/>
      <el-table-column label="企业名称" align="center" prop="name"/>
      <el-table-column label="具有技能种类数量" align="center" prop="skillNum"/>
      <el-table-column label="企业地址" align="center" prop="address"/>
      <el-table-column label="所属产业链" align="center" prop="chain"/>
      <el-table-column label="所属园区" align="center" prop="park"/>
      <el-table-column label="所属网络层" align="center" prop="layer"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['taskallocation:business:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        :limit="4"
        @pagination="getList"
    />
  </div>
</template>

<script setup name="Business">
import {delBusiness, listBusiness} from "@/api/taskallocation/business";
import {onMounted, watch} from "vue";

const props = defineProps(['cid']);

const {proxy} = getCurrentInstance();
const {business_type} = proxy.useDict('business_type');

watch(() => props.cid, (newVal, oldVal) => {
  getList();
});

const businessList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 100,
    name: null,
    chain: null,
    park: null,
    state: null,
    layer: null
  }
});

const {queryParams} = toRefs(data);

/** 查询企业信息列表 */
function getList() {
  loading.value = true;
  listBusiness(queryParams.value).then(response => {
    console.log(response)
    businessList.value = response.rows.filter(
        bus => {
          return bus.task === props.cid;
        }
    );
    total.value = businessList.value.length;
    loading.value = false;
  });
}

function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除企业信息编号为"' + _ids + '"的数据项？').then(function () {
    return delBusiness(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

onMounted(() => {
  getList();
})
</script>
