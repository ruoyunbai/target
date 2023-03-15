import {RouteRecord, createRouter, createWebHistory,RouteRecordRaw} from 'vue-router'

const routes:Array<RouteRecordRaw>=[
    {
        path:"/",
        component:()=>import('../components/Serial.vue')
    },
    {
        path:"/serial",
        component:()=>import('../components/Serial.vue')
    },
    {
        path:"/mqtt",
        component:()=>import('../components/Mqtt.vue')
    }
]
const router=createRouter({
    history:createWebHistory(),
    routes:routes
})
export default router
