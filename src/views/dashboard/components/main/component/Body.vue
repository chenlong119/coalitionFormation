<script setup>
defineProps(['iconName', 'name', 'decId']);
</script>

<template>
  <div class="container">
    <div class="title">
        <span>
          <i class="iconfont" :class="[iconName]"/>
        </span>
      <span class="name">{{ name }}</span>
      <Component :is="'dv-decoration-'+decId" class="dec"/>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100%;
  color: #fff;
  display: flex;
  background: #0f1325;
  flex-direction: column;
  font-size: 15px;

  .title {
    display: flex;

    .name {
      margin: 0 5px;
      line-height: 30px;
    }

    .dec {
      width: 25%;
      height: 30px;
    }

    i {
      font-size: 20px;
      line-height: 30px;
      color: #4AB7BD;
    }
  }

  .body {
    flex: 1;
  }
}
</style>