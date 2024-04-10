const useLoadingStore = defineStore('isloading', () => {
    const isloading = ref(false);
    return {
        isloading
    }
})
export default useLoadingStore;