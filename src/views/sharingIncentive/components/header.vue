<template>
  <div>
    <div class="menu-container">
      <el-menu
          :default-active= "DataAnalysis"
          background-color="#204F71"
          text-color="#fff"
          active-text-color="#3eede7"
          mode="horizontal"
          router
          class="menu"
          @select="handleSelect">
        <div class="left-items">
          <el-menu-item index="DataAnalysis" style="margin-right: 20px;">
            <i class="el-icon-map-location"></i>
            共享态势
          </el-menu-item>
          <el-menu-item index="MySharing" style="margin-right: -200px;">
            <i class="el-icon-data-analysis"></i>
            我的共享
          </el-menu-item>
        </div>
        <div class="center-item">
            <span class="neon" style="font-size: 18px;">
            基于多重产业链的数据共享激励构件
            </span>
        </div>
        <div class="right-items">
          <el-menu-item index="CurrentSharing" style="margin-left: -200px;">
            <i class="el-icon-edit-outline"></i>
            当前任务
          </el-menu-item>
          <el-menu-item index="IncentiveUsage" style="margin-left: 20px;">
            <i class="el-icon-set-up"></i>
            激励使用
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <!-- <el-container> -->
      <!-- <el-menu
          background-color="#204F71"
          text-color="#fff"
          active-text-color="#3eede7"
          mode="horizontal"
          router
          class="menu"
          @select="handleSelect">
        <div class="left-items">
          <el-menu-item index="DataAnalysis" style="margin-right: 20px;">
            <i class="el-icon-map-location"></i>
            共享态势
          </el-menu-item>
          <el-menu-item index="mysharing" style="margin-right: -200px;">
            <i class="el-icon-data-analysis"></i>
            我的共享
          </el-menu-item>
        </div>
        <div class="center-item">
            <span class="neon" style="font-size: 18px;">
            基于多重产业链的数据共享激励构件
            </span>
        </div>
        <div class="right-items">
          <el-menu-item index="currentsharing" style="margin-left: -200px;">
            <i class="el-icon-edit-outline"></i>
            当前任务
          </el-menu-item>
          <el-menu-item index="incentiveusage" style="margin-left: 20px;">
            <i class="el-icon-set-up"></i>
            激励使用
          </el-menu-item>
        </div>
      </el-menu> -->
    <el-main>
      <Step1></Step1>
      <!-- <el-card v-if="active === 0">
        <Step1 ></Step1>
      </el-card>
      <el-card v-if="active === 1">
        <Step2></Step2>
      </el-card>
      <el-card v-if="active === 2">
        <Step3></Step3>
      </el-card>
      
      <el-card  v-if="active === 3">
        <Step4 ></Step4>
      </el-card> -->
    </el-main>
    <!-- </el-container> -->

  </div>
</template>

<script>
import Step3 from './currentsharing.vue'
import Step1 from './dataanalysis.vue'
import Step4 from './incentiveusage.vue'
import Step2 from './mysharing.vue'

const active = ref(0)
export default {
  components:{Step1,Step2,Step3,Step4},
  

  data(){
    return{
      // active0 = 0 
      // date:new Date(),
      // paths:[],
      // user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    }
  },
  mounted() {
    // //显示当前日期时间
    // let _this = this// 声明一个变量指向Vue实例this，保证作用域一致
    // this.timer = setInterval(() => {
    //   _this.date = new Date(); // 修改数据date
    // }, 1000)
  },
  methods:{
    handleSelect(key){
      consle.log(key);
      if (key == "DataAnalysis")(active = 0)
      if (key == "MySharing")(active = 1)
      if (key == "CurrentSharing")(active = 2)
      if (key == "IncentiveUsage")(active = 3)
    }
  },
  created() {
    //console.log(this.$router)
  },
  methods:{
    dateFormat(time) {
      var date=new Date(time);
      var year=date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
      * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
      * */
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    logoout(){
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    }
  }
}
</script>

<style scoped>
.menu-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.left-items {
  display: flex;
  align-items: center;
}

.right-items {
  display: flex;
  align-items: center;
}

.center-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-menu-item {
  font-size: 15px;
  background-color: #002339;
  font-family: 微软雅黑;
  font-weight:800;
  color: #fff;
}
.neon {
  font-family: 微软雅黑;
  font-style:oblique;
  font-weight:800;
  color: #fff;
  -webkit-animation: shining 0.5s alternate infinite;
  animation: shining 1s alternate infinite;
}
@-webkit-keyframes shining {
  from {
    text-shadow: 0 0 10px rgb(10, 25, 66), 0 0 20px
    /*lightblue, 0 0 30px lightblue, 0 0 40px skyblue, 0 0 50px skyblue, 0 0 60px skyblue;*/
  }
  to {
    text-shadow: 0 0 5px #0237ff, 0 0 10px
    /*lightblue, 0 0 15px #0939ef, 0 0 20px skyblue, 0 0 25px skyblue, 0 0 30px skyblue;*/
  }
}

@-webkit-keyframes shining {
  from {
    text-shadow: 0 0 10px rgb(10, 25, 66), 0 0 20px
    /*lightblue, 0 0 30px lightblue, 0 0 40px skyblue, 0 0 50px skyblue, 0 0 60px skyblue;*/
  }
  to {
    text-shadow: 0 0 5px #0237ff, 0 0 10px
    /*lightblue, 0 0 15px #0939ef, 0 0 20px skyblue, 0 0 25px skyblue, 0 0 30px skyblue;*/
  }
}
</style>