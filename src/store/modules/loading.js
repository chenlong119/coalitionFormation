const useLoadingStore = defineStore('isloading', () => {
    const isloading = ref(false);
    const coalitionloading=ref(false);
    return {
        isloading,
        coalitionloading
    }
})
export default useLoadingStore;