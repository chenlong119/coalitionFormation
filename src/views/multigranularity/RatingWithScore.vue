<template>
    <div class="rating-with-score">
      <el-rate v-model="value" :max="max" :texts="texts" :allow-half="allowHalf" />
      <div class="score">{{ value }}/{{ max }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      value: Number,
      max: {
        type: Number,
        default: 5
      },
      texts: Array,
      allowHalf: Boolean
    }
  };
  </script>
  
  <style scoped>
  .rating-with-score {
    display: flex;
    align-items: center;
  }
  
  .score {
    margin-left: 10px;
  }
  </style>
  