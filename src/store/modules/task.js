const useTaskStore = defineStore("taskstore", () => {
    const tasks = ref([])
    return {
        tasks
    }
})
export default useTaskStore;