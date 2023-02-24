<template>
<el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="/serial">Serial</el-menu-item>
    <el-menu-item index="/mqtt">MQTT</el-menu-item>
  
  </el-menu>


  <router-view></router-view>

  
 
</template>
<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
const activeIndex = ref('')
const router=useRouter()
const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
  router.push(key)
}
</script>
<style scoped>
body{
  padding:0;
}
</style>
