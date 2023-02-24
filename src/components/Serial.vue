<template>
    
<el-select v-model="value"   style="width: 300px" :disabled="!portsLoaded" class="m-4" placeholder="选择串口" size="large">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
</el-select>


</template>

<script setup lang="ts">
import {onMounted,ref,reactive} from 'vue'
const oports=ref()
// import {SerialPort} from "serialport"

const serialport= require('serialport')

const value = ref('')
const portsLoaded=ref(false)

const options:any =reactive([
  
])

onMounted(async ()=>{
    // listSerialPorts()
    try {
        let ports = await serialport.SerialPort.list();
        console.log(ports); // 打印串口列表
        ports.forEach((port: any)=> {
            options.push({
                value:port.path,
                label:port.friendlyName
            })
            
        });
        portsLoaded.value=true
        oports.value=ports
    } catch (error) {
        console.log(error);
    }
    // https://blog.csdn.net/Naisu_kun/article/details/125146766


})

</script>