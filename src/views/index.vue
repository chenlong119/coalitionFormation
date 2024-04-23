<template>
  <div class="index" ref="index">
    <div class="dashboard">
      <div class="lineOne">
        <dv-decoration-10 class="dv-dec-10"/>
        <div class="middle">
          <dv-decoration-8 class="dv-dec-8"/>
          <div class="middleCenter">
            <dv-decoration-11
                class="dec-11">
              {{ title }}
            </dv-decoration-11>
          </div>
          <dv-decoration-8
              class="dv-dec-8"
              :reverse="true"
          />
        </div>
        <dv-decoration-10 class="reverse dv-dec-10"/>
      </div>
      <div class="lineTwo">
        <div class="leftBox">
          <div class="box1 skew bg" @click="$router.push('/shareing/auction/history')">
            <div class="rSkew bg">
              <span>数据共享激励</span>
            </div>
          </div>
          <div class="box2 bg skew" @click="$router.push('/aa')">
            <span class="rSkew">群智汇聚</span>
          </div>
          <div class="box2 bg skew" @click="$router.push('/coalitionFormation/companyInfo')">
            <span class="rSkew">联盟形成</span>
          </div>
          <div class="box2 bg skew" @click="$router.push('/xietong')">
            <span class="rSkew">企业群多模式协同</span>
          </div>
        </div>
        <div class="rightBox">
          <div class="box1 bg skew" @click="$router.push('/123654')">
            <span class="rSkew">协同效果评估</span>
          </div>
          <div class="box2  skew bg ">
            <div class="rSkew bg">
              <span>
                {{ timeInfo.dateYear }} {{ timeInfo.dateWeek }}
                {{ timeInfo.dateDay }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <Main></Main>
      </div>
    </div>
  </div>
</template>

<script setup name="Index">
import {formatTime} from '@/utils/formatTime'
import {onMounted, reactive, ref} from "vue";
import Main from "@/views/dashboard/components/main/Main.vue";
import {ElMessage, ElMessageBox} from "element-plus";
const userStore=useUserStore();
import {useRouter} from "vue-router";
import useUserStore from "@/store/modules/user.js";
const router=useRouter();
const handleReloginAdmin=()=>{
  ElMessage({
    type:'warning',
    'message':"请使用管理员账号登录"
  })
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => {
  });
}
const handleReLoginRegular=()=>{
  ElMessage({
    type:'warning',
    'message':"请使用普通用户账号登录"
  })
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => {
  });
}
const index = ref(null);
const title = "多重产业链企业群协同系统"
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
let height;
let width;

// * 时间内容
const timeInfo = reactive({
  setInterval: 0,
  dateDay: '',
  dateYear: '',
  dateWeek: ''
})

onMounted(() => {
  height = index.value.offsetHeight;
  width = index.value.offsetWidth;
  handleTime();
})


const handleTime = () => {
  timeInfo.setInterval = setInterval(() => {
    const date = new Date()
    timeInfo.dateDay = formatTime(date, 'HH: mm: ss')
    timeInfo.dateYear = formatTime(date, 'yyyy-MM-dd')
    timeInfo.dateWeek = WEEK[date.getDay()]
  }, 1000)
}
</script>

<style scoped lang="scss">
.index {
  background-image: url('@/assets/dashboard/pageBg.png');
  height: 100vh;
  padding: 10px;
  overflow: auto;

  .dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;

    .lineOne {
      display: flex;

      .dv-dec-10 {
        width: 25%;
        height: 10px;

        &.reverse {
          transform: rotate(180deg);
        }
      }

      .middle {
        display: flex;
        width: 70%;

        .dv-dec-8 {
          width: 25%;
          height: 50px;
        }

        .middleCenter {
          width: 70%;
          position: relative;
          color: #fff;

          .dec-11 {
            width: 90%;
            height: 60px;
            font-size: 35px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }

          .dec-6 {
            height: 10px !important;
            width: 50%;
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 5;
          }
        }
      }
    }

    .lineTwo {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      padding: 0 5px;
      color: #fff;
      font-size: 25px;
      height: 6%;

      .leftBox {
        width: 60%;
        height: 100%;
        display: flex;

        .box1 {
          height: 100%;
          width: 25%;
          position: relative;

          div {
            position: absolute;
            height: 100%;
            top: 0;
            left: -10px;
            padding-left: 30px;
          }
        }

        .box2 {
          height: 100%;
          width: 25%;
          margin-left: 10px;
          display: flex;
          justify-content: center;
        }
      }

      .rightBox {
        width: 40%;
        height: 100%;
        display: flex;
        margin-left: 10px;

        .box1 {
          width: 40%;
          height: 100%;
          margin-right: 10px;

          span {
            display: inline-block;
            margin-left: 10px;
          }
        }

        .box2 {
          width: 60%;
          height: 100%;
          position: relative;

          div {
            position: absolute;
            top: 0;
            right: -10px;
            padding-right: 30px;
            height: 100%;
          }
        }
      }
    }

    .main {
      flex: 1;
      margin-top: 10px;
    }

    .skew {
      transform: skewX(45deg);
    }

    .rSkew {
      transform: skewX(-45deg);
    }

    .bg {
      background-color: #004d8c;
      text-align: center;
      line-height: 45px;
      color: #fff;
      font-size: 25px;
    }

  }
}
</style>

