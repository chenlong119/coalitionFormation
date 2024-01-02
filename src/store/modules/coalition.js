import {defineStore} from "pinia";
import {ref} from "vue";

export const useCoalitionStore = defineStore('coalition', ()=>{
    const detail=ref({});
    const setDetail=(data)=>{
        detail.value=data;
    }
    return{
        detail,
        setDetail
    }
})