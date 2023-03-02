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
                    <el-checkbox v-model="ifDraw" label="绘制图" size="small" />
                    <el-checkbox v-model="ifRecAutoLine" label="自动换行" size="small" />
                    <el-checkbox v-model="ifAutoSave" @change="handleSave()" label="自动保存" size="small" />
                </div>
            </el-card>
            <el-card class="box-card">
                <template #header>
                    <div>
                        <span>发送设置</span>
                    </div>
                </template>
                <!-- <div class="mb-2 flex items-center text-sm">
                    <el-radio-group v-model="modeSend" class="ml-4">
                        <el-radio label="ascii" size="small">ASC II</el-radio>
                        <el-radio label="utf8" size="small">UTF8</el-radio>
                        <el-radio label="hex" size="small">HEX</el-radio>
                        <el-radio label="binary" size="small">BIN</el-radio>
                    </el-radio-group>
                </div> -->
                <el-divider />
                <el-checkbox v-model="ifSendAutoLine" label="自动换行" size="small" />
            </el-card>
        </el-col>
        <el-col :span="16">
            <div class="grid-content ep-bg-purple-light" />
            <el-card class="box-card">

                <el-input style="white-space: pre-line;" v-model="content" :rows="10" type="textarea"
                    placeholder="接收到的内容" />
            </el-card>

            <el-input v-model="sendStr" placeholder="输入发送的内容(内容为空时将发送换行符)" @keyup.enter="handleSend()"
                class="input-with-select">


                <template #append>
                    <el-tooltip class="box-item" effect="dark" content="回车或者点击图标发送" placement="bottom">
                        <div>
                            <el-button type="success" round v-on:click="handleSend()" :icon="Right" />
                        </div>
                    </el-tooltip>

                </template>
            </el-input>
            <!-- <el-card class="box-card"> -->
                <div id="mychartdom"  style="width:500px; height:500px">
                </div>
            <!-- </el-card> -->
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref, reactive, Ref, onBeforeMount } from 'vue'
import { Right } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import * as echarts from 'echarts';



const ipc = require('electron').ipcRenderer;

const ifDraw=ref(true)
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
const handleSave = () => {
    if (ifAutoSave.value) {
        handleSaveData()
    }
}
const handleSaveData = () => {
    // 向IPC通道发送信号，此时主线程收到信号立即执行相对应的响应函数         
    ipc.send('open-save-chart-dialog');
}
let sp: any

const handleSend = () => {
    if (sendStr.value != "") {
        sp.write(sendStr.value)
        if (ifSendAutoLine.value) {
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
    let strNew = list.map((item: any) => {
        let i: string = item.charCodeAt().toString(2);
        while (i.length < 8) {
            i = "0" + i
        }
        return i
    }).join(' ');
    return strNew

}
function strTokPa(str: string):DataItem {
  
    let strNew =str
    while (strNew.length < 8) {
        strNew = "0" + strNew
    }
 
    let kPa:number=0 
    for(let i=0;i<strNew.length;i++){
        if(strNew[i]=="1")
        kPa=i+1
    }
    now = new Date(+now + oneDay);
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
           kPa
        ]
    };


}
const handleClick = () => {
    if (buttonType.value == "default") {
        sp = new serialport.SerialPort({ path: value.value, baudRate: parseInt(baud.value) }, (err: any) => {
            if (err) {
                // ElMessage('端口打开失败！');
                ElNotification({
                    title: 'Error',
                    message: '端口打开失败！',
                    type: 'error',
                    offset: 100,
                })
                console.log(err)
                return;
            } else {
                ElNotification({
                    title: 'Success',
                    type: 'success',
                    message: '端口打开成功！',
                    offset: 100,
                })
                // ElMessage('端口打开成功！');
                buttonType.value = "success"
                buttonContent.value = "关闭"
            }
        });

        // 以 paused mode 监听收到的数据，需要主动读取数据
        sp.on('readable', () => {
            let str = sp.read()
            let parseStr;
            if(ifDraw.value){
                    // data.shift();
                data.push(strTokPa(str.toString("ascii")));
            

                 myChart.setOption<echarts.EChartsOption>({
                     series: [
                    {
                        data: data
                    }
                ]
                });
            }
            if (str != null) {
                if (modeRec.value != "binary")
                    parseStr = str.toString(modeRec.value)
                else {
                    parseStr = strToBinary(str.toString("utf8"))
                }
                content.value += parseStr
                // ipcRenderer.send("asynchronous-message", parseStr+"\n");
                if (ifRecAutoLine.value) content.value += "\n"

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
onBeforeMount(() => {

    ipc.on('save-finished', function (event: any, filename: any) {
        // 当filename等于null的时候表示用户点击了取消按钮
        // 当用户点击保存按钮的时候filename的值是对应文件的绝对路径
        console.log(filename)
        //  ipcRenderer.send("asynchronous-message", "传递回去ping");
    })
})



interface DataItem {
    name: string;
    value: [string, number];
}

function randomData(): DataItem {
    now = new Date(+now + oneDay);
    valueChart = Math.random() * 8;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(valueChart)
        ]
    };
}

let data: DataItem[] = [];
let now = new Date(1997, 9, 3);
let oneDay = 24 * 3600 * 1000;
let valueChart = Math.random() * 8;
// for (var i = 0; i < 3; i++) {
//     data.push(randomData());
// }

const option= {
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    title: {
        text: '冲击波压强值'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
            params = params[0];
            var date = new Date(params.name);
            return (
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear() +
                ' : ' +
                params.value[1]
            );
        },
        axisPointer: {
            animation:true
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '10%'],
        splitLine: {
            show: true
        }
    },
    series: [
        {
            name: 'Fake Data',
            type: 'line',
            showSymbol: false,
            data: data
        }
    ]
};






var myChart: echarts.ECharts
onMounted(async () => {
    // setInterval(function () {
    //     for (var i = 0; i < 1; i++) {
    //         // data.shift();
    //         data.push(randomData());
    //     }

    //     myChart.setOption<echarts.EChartsOption>({
    //         series: [
    //             {
    //                 data: data
    //             }
    //         ]
    //     });
    // }, 1000);
    // 基于准备好的dom，初始化echarts实例
    let a = document.getElementById('mychartdom')
    if (a != null){
        myChart = echarts.init(a);
        myChart.setOption(option)
        console.log("chart inited!")
    }
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