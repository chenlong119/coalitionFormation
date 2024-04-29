const useTaskStore = defineStore("taskstore", () => {
    const tasks = ref([])
    const isAddTask = ref(false)
    return {
        tasks,
        isAddTask
    }
})
export default useTaskStore;