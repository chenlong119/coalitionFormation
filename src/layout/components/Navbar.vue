<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav"/>

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <div style="position: relative">
          <!--          <el-tooltip :content="htmlString" placement="bottom"-->
          <!--                      raw-content-->
          <!--                      effect="light"-->
          <!--          >-->
          <!--            <el-icon :size="24"-->
          <!--                     color="#5a5e66"-->
          <!--                     style="margin-top: 12px;margin-right: 10px">-->
          <!--              <Bell/>-->
          <!--            </el-icon>-->
          <!--          </el-tooltip>-->
          <!--          <div class="red-dot"></div>-->
        </div>
        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar"/>
            <el-icon>
              <caret-bottom/>
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ElMessageBox} from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const finishTasks = [{
  id: 1,
  name: '生产三元锂电池',
  status: '已完成',
  time: '2021-09-01'
},
  {
    id: 5,
    name: '生产汽车车身',
    status: '已完成',
    time: '2021-08-20'
  },
  {
    id: 8,
    name: '生产汽车轮胎',
    status: '已完成',
    time: '2021-08-10'
  }
]

let htmlString = "<div style='text-align: center'><h3>任务完成情况</h3><table border='1' style='margin: 0 auto'><tr><th>任务名称</th><th>完成状态</th><th>完成时间</th></tr>"
for (let i = 0; i < finishTasks.length; i++) {
  htmlString += "<tr><td>" + finishTasks[i].name + "</td><td>" + finishTasks[i].status + "</td><td>" + finishTasks[i].time + "</td></tr>"
}
htmlString += "</table></div>"

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
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

const emits = defineEmits(['setLayout'])

function setLayout() {
  emits('setLayout');
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.red-dot {
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 13px;
  right: 16px;
}
</style>
