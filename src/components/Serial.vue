<template>
<div>
Serial
</div>
<div>{{ oports }}</div>

</template>

<script setup lang="ts">
import {onMounted,ref} from 'vue'
const oports=ref()
// import {SerialPort} from "serialport"

const serialport= require('serialport')

onMounted(async ()=>{
    // listSerialPorts()
    try {
        let ports = await serialport.SerialPort.list();
        console.log(ports); // 打印串口列表
        oports.value=ports
    } catch (error) {
        console.log(error);
    }
    // https://blog.csdn.net/Naisu_kun/article/details/125146766


})

</script>