<template>
  <div>
    <button @click="showPopup">Open Table Popup</button>
    <el-dialog v-model="isPopupVisible" title="Table Popup" @close="hidePopup">
      <el-table :data="people" border>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="age" label="Age"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isPopupVisible = ref(false);

    const people = ref([
      { id: 1, name: 'John', age: 30, email: 'john@example.com' },
      { id: 2, name: 'Jane', age: 25, email: 'jane@example.com' },
      { id: 3, name: 'Bob', age: 40, email: 'bob@example.com' },
    ]);

    const showPopup = () => {
      isPopupVisible.value = true;
    };

    const hidePopup = () => {
      isPopupVisible.value = false;
    };

    return {
      isPopupVisible,
      people,
      showPopup,
      hidePopup,
    };
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
