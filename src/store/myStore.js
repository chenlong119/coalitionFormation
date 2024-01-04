import { defineStore } from 'pinia';

export const useMyStore = defineStore({
  id: 'myStore',
  state: () => {
    return {
      individualIncome: 0,
      groupIncome: 0,
      isLoading: false,
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