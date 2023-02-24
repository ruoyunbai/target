<template>
    <el-row>
        <el-col :span="8" >
            <div class="grid-content ep-bg-purple-dark" />
            <el-select v-model="value" style="width:248px" :disabled="!portsLoaded" class="m-4" placeholder="选择串口"
                size="large">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div>
            </div>
            <el-tooltip class="box-item" effect="dark" content="若自定义波特率需要输入后单击右侧选项选中" placement="top-start">


                <el-select v-model="baud" filterable allow-create :reserve-keyword="false" placeholder="输入或选择波特率">
                    <!-- TODO 输入添加到bauds中 ,出现下拉框时来一个toolkit-->
                    <el-option v-for="item in bauds" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-tooltip>
            <div></div>
            <el-button :type="buttonType"  v-on:click="handleClick()">{{ buttonContent }}</el-button>
            <el-card class="box-card">
    <template #header>
      <div >
        <span>接收设置</span>
      </div>
    </template>
    <div class="mb-2 flex items-center text-sm">
    <el-radio-group v-model="modeRec" class="ml-4">
      <el-radio label="1" size="large">Option 1</el-radio>
      <el-radio label="2" size="large">Option 2</el-radio>
      <el-radio label="2" size="large">Option 3</el-radio>
    </el-radio-group>
    <el-divider />
  </div>
  </el-card>
  <el-card class="box-card">
    <template #header>
      <div >
        <span>发送设置</span>
      </div>
    </template>
   
  </el-card>
        </el-col>
        <el-col :span="16">
            <div class="grid-content ep-bg-purple-light" />
            <el-card class="box-card">

                <el-input style="white-space: pre-line;" v-model="content" :rows="10" type="textarea"
                    placeholder="接收到的内容" />
            </el-card>
            <el-input v-model="sendStr" placeholder="输入发送的内容" class="input-with-select" @keyup.enter="handleSend()">

                <template #append>
                    <div>
                        <el-button type="success" round v-on:click="handleSend()" :icon="Right" />
                    </div>
                </template>
            </el-input>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref, reactive, Ref } from 'vue'
import { Right } from '@element-plus/icons-vue'
const sendStr = ref("")
const oports = ref()
const modeRec=ref()
// import {SerialPort} from "serialport"
const buttonType = ref("default")
const serialport = require('serialport')
const content: Ref<string> = ref('')
const value = ref('')
const baud = ref('')
const portsLoaded = ref(false)
const buttonContent = ref("启动")
const options: any = reactive([

])
const bauds = [
    {
        value: "9600",
        label: "9600"
    },

    {
        value: "19200",
        label: "19200"
    },
    {
        value: "38400",
        label: "38400"
    },
    {
        value: "57600",
        label: "57600"
    },
    {
        value: "115200",
        label: "115200"
    },
]
let sp: any
const handleSend = () => {
    // if(sendStr.value!="")
    sp.write(sendStr.value + "\n")
    sendStr.value = ""
    // else
    // sp.write("\n")
}
const handleClick = () => {
    if (buttonType.value == "default") {
        sp = new serialport.SerialPort({ path: value.value, baudRate: parseInt(baud.value) }, (err: any) => {
            if (err) {
                ElMessage('端口打开失败！');
                return;
            }
            ElMessage('端口打开成功！');
            buttonType.value = "success"
            buttonContent.value = "关闭"
        });

        // 以 paused mode 监听收到的数据，需要主动读取数据
        sp.on('readable', () => {
            let str = sp.read()
            if (str != null) {
                content.value += str.toString('utf8')
                const textarea = document.getElementsByClassName('el-textarea__inner')[0];
                textarea.scrollTop = textarea.scrollHeight;

                console.log(str.toString('utf8'));
            }// 使用read方法读取数据，可以指定读取字节数
        });
    } else {

        sp.close((err: any) => {
            if (err) {

            } else {
                buttonType.value = "default"
                buttonContent.value = "启动"
                ElMessage('端口关闭成功！');
            }
        })
    }
}
onMounted(async () => {
    // listSerialPorts()
    try {
        let ports = await serialport.SerialPort.list();
        console.log(ports); // 打印串口列表
        ports.forEach((port: any) => {
            options.push({
                value: port.path,
                label: port.friendlyName
            })

        });
        portsLoaded.value = true
        oports.value = ports
    } catch (error) {
        console.log(error);
    }
    // https://blog.csdn.net/Naisu_kun/article/details/125146766


})

</script>