import { defineStore } from 'pinia';

export const useMyStore = defineStore({
  id: 'myStore',
  state: () => {
    return {
      companyInfo: {},  //当前登录企业信息
      relatedCompany: [],  //数据库中存储的关联关系
      newRelatedCompany:[],  //用户修改并提交的关联关系
      isSubmitRelation:false,//是否提交修改后的关联关系
      isSubmitForm:false,//是否提交算法参数
      isLoading: false, //加载动画
      inputForm: {}, //算法参数
      individualIncome: 0, //个体收益
      groupIncome: 0,  //群体收益
      predictMonth: 0,  //预测月份
    }
  },
  actions: {
    setIndividualIncome(income) {
      this.individualIncome = income
    },
    setGroupIncome(income) {
      this.groupIncome = income
    },
  },
});