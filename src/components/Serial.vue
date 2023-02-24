<template>
    <el-row>
        <el-col :span="8">
            <div class="grid-content ep-bg-purple-dark" />
            <el-select v-model="value" style="width:248px" :disabled="!portsLoaded" class="m-4" placeholder="选择串口"
                size="large">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div>
            </div>
            <el-tooltip class="box-item" :enterable="false" effect="dark" content="若自定义波特率需要输入后单击右侧选项选中" placement="bottom">


                <el-select v-model="baud" filterable allow-create :reserve-keyword="false" placeholder="输入或选择波特率">
                    <!-- TODO 输入添加到bauds中 ,出现下拉框时来一个toolkit-->
                    <el-option v-for="item in bauds" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-tooltip>
            <div></div>
            <el-button :type="buttonType" v-on:click="handleClick()">{{ buttonContent }}</el-button>
            <el-card class="box-card">
                <template #header>
                    <div>
                        <span>接收设置</span>
                    </div>
                </template>
                <div class="mb-2 flex items-center text-sm">
                    <el-radio-group v-model="modeRec" class="ml-4">
                        <el-radio label="ascii" size="small">ASC II</el-radio>
                        <el-radio label="utf8" size="small">UTF8</el-radio>
                        <el-radio label="hex" size="small">HEX</el-radio>
                        <el-radio label="binary" size="small">BIN</el-radio>
                    </el-radio-group>
                </div>
                <el-divider />
                <div>

                    <el-checkbox v-model="ifRecAutoLine" label="自动换行" size="small" />
                    <el-checkbox v-model="ifAutoSave" label="自动保存" size="small" />
                </div>
            </el-card>
            <el-card class="box-card">
                <template #header>
                    <div>
                        <span>发送设置</span>
                    </div>
                </template>
                <div class="mb-2 flex items-center text-sm">
                    <el-radio-group v-model="modeSend" class="ml-4">
                        <el-radio label="ascii" size="small">ASC II</el-radio>
                        <el-radio label="utf8" size="small">UTF8</el-radio>
                        <el-radio label="hex" size="small">HEX</el-radio>
                        <el-radio label="binary" size="small">BIN</el-radio>
                    </el-radio-group>
                </div>
                <el-divider/>
                <el-checkbox v-model="ifSendAutoLine" label="自动换行" size="small" />
            </el-card>
        </el-col>
        <el-col :span="16">
            <div class="grid-content ep-bg-purple-light" />
            <el-card class="box-card">

                <el-input style="white-space: pre-line;" v-model="content" :rows="10" type="textarea"
                    placeholder="接收到的内容" />
            </el-card>
           
                <el-input v-model="sendStr" placeholder="输入发送的内容(内容为空时将发送换行符)"   @keyup.enter="handleSend()" class="input-with-select">
          

                <template #append>
                    <el-tooltip class="box-item" effect="dark" content="回车或者点击图标发送" placement="bottom">
                    <div>
                        <el-button type="success" round v-on:click="handleSend()" :icon="Right" />
                    </div>
        </el-tooltip>

                </template>
            </el-input>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref, reactive, Ref } from 'vue'
import { Right } from '@element-plus/icons-vue'
const ifRecAutoLine = ref(true)
const ifSendAutoLine = ref(false)
const ifAutoSave = ref(false)
const sendStr = ref("")
const oports = ref()
const modeRec = ref("ascii")
const modeSend = ref("ascii")
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
    if(sendStr.value!=""){
        sp.write(sendStr.value)
        if(ifSendAutoLine){
            sp.write("\n")
        }
        sendStr.value = ""
    }
    else
    sp.write("\n")
}
//TODO不到八位则行首增加0
function strToBinary(str: string) {
    let list = str.split('');
    return list.map((item: { charCodeAt: () => { (): any; new(): any; toString: { (arg0: number): any; new(): any; }; }; }) => {
        return item.charCodeAt().toString(2);
    }).join(' ');
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
                if(modeRec.value!="binary")
                    content.value += str.toString(modeRec.value)
                else{
                    content.value +=  strToBinary(str.toString("utf8"))
                }
                if(ifRecAutoLine)content.value+="\n"

                const textarea = document.getElementsByClassName('el-textarea__inner')[0];
                textarea.scrollTop = textarea.scrollHeight;

                console.log(str);
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