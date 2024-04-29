const useLoadingStore = defineStore('isloading', () => {
    const isloading = ref(false);
    const coalitionloading=ref(false);
    const taskId=ref();
    return {
        isloading,
        coalitionloading,
        taskId
    }
})
export default useLoadingStore;