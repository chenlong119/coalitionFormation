<script setup>
import {ref} from "vue";
import Coalition from "@/views/coalitionformation/detail/coalition/Coalition.vue";

const props = defineProps(['cid', 'cname']);
const tableView = ref(true);

function onClickQueryTable() {
  tableView.value = true;
}

function onClickQueryMap() {
  tableView.value = false;
}

</script>

<template>
  <div>
    <h1 style="font-size:20px;text-align: center;font-weight: 700">{{ cname }}详情</h1>
    <div class="drawerBody">
      <Coalition :cid="parseInt(cid)" v-if="tableView"></Coalition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawerBody {
  margin-top: 10px;
}
</style>