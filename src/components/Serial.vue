<template>
    
<el-select v-model="value"   style="width: 300px" :disabled="!portsLoaded" class="m-4" placeholder="选择串口" size="large">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
</el-select>
<div>
</div>
<el-tooltip
        class="box-item"
        effect="dark"
        content="若自定义波特率需要输入后单击右侧选项选中"
        placement="top-start"
>
    
      
<el-select
    v-model="baud"
    filterable
    allow-create
    :reserve-keyword="false"
    placeholder="输入或选择波特率"
  >
  <!-- TODO 输入添加到bauds中 ,出现下拉框时来一个toolkit-->
    <el-option
      v-for="item in bauds"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</el-tooltip>
<div></div>
<el-button :type="buttonType" v-on:click="handleClick()">启动</el-button>

<el-card class="box-card">
<p style="white-space: pre-line;">
    {{ content }}
</p>
</el-card>

</template>

<script setup lang="ts">
import {onMounted,ref,reactive,Ref} from 'vue'
const oports=ref()
// import {SerialPort} from "serialport"
const buttonType=ref("default")
const serialport= require('serialport')
const content:Ref<string>=ref('接受内容:\n')
const value = ref('')
const baud = ref('')
const portsLoaded=ref(false)

const options:any =reactive([
  
])
const bauds=[
    {
        value:"9600",
        label:"9600"
    },
    {
        value:"115200",
        label:"115200"
    },
]
const handleClick=()=>{
    if(buttonType.value=="default"){
        const sp = new serialport.SerialPort({ path: value.value, baudRate: parseInt(baud.value) });

// 以 paused mode 监听收到的数据，需要主动读取数据
    sp.on('readable', () => {
        let str=sp.read()
        if(str!=null){
        content.value+=str.toString('utf8')   
        console.log(str.toString('utf8')); }// 使用read方法读取数据，可以指定读取字节数
    });
    }
}
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