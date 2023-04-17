<template>
    <el-row>
        <el-col :span="5">
            <!-- <div class="grid-content ep-bg-purple-dark" /> -->
            <el-select v-model="value"  :disabled="!portsLoaded" class="m-4" placeholder="选择串口"
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
            <div class="parent">
            <el-button :type="buttonType" v-on:click="handleClick()">{{ buttonContent }}</el-button>
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
                <!-- <el-divider /> -->
                <el-checkbox v-model="ifSendAutoLine" label="自动换行" size="small" />
            </el-card>
            <div  class="bottom">
            <el-card class="box-card">
                <template #header>
                    <div>
                        <span>接收设置</span>
                    </div>
                </template>
                <!-- <div class="mb-2 flex items-center text-sm">
                    <el-text class="mx-1" type="success">编码</el-text>
                    <div></div>
                    <el-radio-group v-model="modeRec" class="ml-4">
                        <el-radio label="ascii" size="small">ASC II</el-radio>
                        <el-radio label="utf8" size="small">UTF8</el-radio>
                        <el-radio label="hex" size="small">HEX</el-radio>
                        <el-radio label="binary" size="small">BIN</el-radio>
                    </el-radio-group>
                </div> -->
                <!-- <el-divider /> -->
                <div>
                    <el-text class="mx-1" type="success">功能选择</el-text>
                    <div></div>
                    <el-radio-group v-model="calcMode" class="ml-4">
                        <el-radio-button label="speed" size="small">计算速度</el-radio-button>
                        <el-radio-button label="press" size="small">计算压力</el-radio-button>
                        <el-radio-button label="pic" size="small">绘制图</el-radio-button>
                    </el-radio-group>
                    <!-- <el-checkbox v-model="ifSpeed" label="计算速度" size="small" />
                    <el-checkbox v-model="ifPressure" label="计算压力" size="small" />
                    
                    <el-checkbox v-model="ifDraw" label="绘制图" size="small" /> -->
                    <el-divider></el-divider>
                    <el-checkbox v-model="ifRecAutoLine" label="自动换行" size="small" />
                    <el-checkbox v-model="ifAutoSave" @change="handleSave()" label="自动保存" size="small" />
                </div>
            </el-card>
           </div>
           </div>
        </el-col>
        <el-col :span="19">
            <!-- <div class="grid-content ep-bg-purple-light" /> -->
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
            <transition-group name="el-fade-in-linear">
                <!-- <el-card class="box-card"> -->
                <div id="mychartdom" v-show="ifDraw" style="width:500px; height:500px">
                </div>
                <!-- </el-card> -->
                <el-card v-if="ifSpeed" class="box-card">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="输入距离">
                                <el-input v-model="distance" placeholder="距离" />
                            </el-form-item></el-col>
                        <el-col :span="2">(m)</el-col>
                    </el-row>
                    <el-row><el-col :span="16">
                            <el-form-item label="选择类">
                                <el-select @change="handleSpeedClassChange()" v-model="speedClass" filterable allow-create
                                    :reserve-keyword="false" placeholder="">

                                    <el-option v-for="item in speedClasses" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col></el-row>
                    <el-row><el-col :span="16">
                            <el-form-item label="当前速度">
                                {{ speedData.currentSpeed }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-row><el-col :span="16">
                            <el-form-item label="选择类">

                            </el-form-item>
                        </el-col>
                    </el-row> -->
                    <el-row><el-col :span="16">
                            <el-form-item label="历史数据   ">
                                <el-checkbox v-model="ifSpeedScroll" label="自动滚动" size="small" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row><el-col :span="24">
                            <!-- <el-form-item label="历史数据"> -->
                            <el-table ref="speedTable" :data="speedData.data" height="250" style="width: 100%">
                                <el-table-column prop="id" label="序号" />
                                <el-table-column prop="type" label="类型" />
                                <el-table-column prop="distance" label="距离" />
                                <el-table-column prop="time" label="时间" />
                                <el-table-column prop="speed" label="速度" />
                            </el-table>
                            <!-- </el-form-item> -->
                        </el-col>
                    </el-row>
                </el-card>
                <el-card v-if="ifPressure" class="box-card">
                    <el-row><el-col :span="16">
                            <el-form-item label="选择类">
                                <el-select @change="handleSpeedClassChange()" v-model="speedClass" filterable allow-create
                                    :reserve-keyword="false" placeholder="">

                                    <el-option v-for="item in speedClasses" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col></el-row>
                    <el-divider />
                    <el-row><el-col :span="16">
                            <el-form-item label="传感器数目">

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row><el-col :span="24">
                            <el-row>
                                <el-col :span="4">
                                    <div  class="grid-content ep-bg-purple">传感器类型</div>
                                </el-col>
                                <el-col :span="8">
                                    <div  class="grid-content ep-bg-purple">传感器总数</div>
                                </el-col>
                                <el-col :span="8">
                                    <div  class="grid-content ep-bg-purple">已接收传感器总数
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="grid-content ep-bg-purple">达标率</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">
                                    <div class="simpleUnit">35KP</div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="simpleUnit"> <el-input-number v-model="pressData.cnt35" size="small" />
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="simpleUnit">{{ pressData.ok35 }}</div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="simpleUnit">{{ pressData.ok35 / pressData.cnt35 * 100 }}%</div>
                                </el-col>
                            </el-row>
                            <div style="height:1px"></div>

                            <el-row>
                                <el-col :span="4">
                                    <div class="simpleUnit">50KP</div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="simpleUnit"> <el-input-number v-model="pressData.cnt50" size="small" />
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="simpleUnit">{{ pressData.ok100 }}</div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="simpleUnit">{{ pressData.ok50 / pressData.cnt50 * 100 }}%</div>
                                </el-col>
                            </el-row>
                            <div style="height:1px"></div>
                            <el-row>
                                <el-col :span="4">
                                    <div class="simpleUnit">100KP</div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="simpleUnit"> <el-input-number v-model="pressData.cnt100" size="small" />
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="simpleUnit">{{ pressData.ok100 }}</div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="simpleUnit">{{ pressData.ok100 / pressData.cnt100 * 100 }}%</div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <div style="height:15px"></div>

                    <!-- <el-row><el-col :span="16">
                           
                        </el-col>
                    </el-row> -->
                    <el-divider />
                    <el-row><el-col :span="24">
                            <el-form-item label="历史数据   ">
                                <el-checkbox v-model="ifPressScroll" label="自动滚动" size="small" />

                            </el-form-item>
                            <!-- <el-form-item label="历史数据"> -->
                            <el-table :data="pressData.data" style="width: 100%">
                                <el-table-column prop="id" label="序号" />
                                <el-table-column prop="type" label="类型" />
                                <el-table-column prop="per35" label="35达标率" />
                                <el-table-column prop="per50" label="50达标率" />
                                <el-table-column prop="per100" label="100达标率" />
                                <el-table-column prop="perAll" label="综合达标率" />

                            </el-table>
                            <!-- </el-form-item> -->
                        </el-col>
                    </el-row>
                </el-card>
            </transition-group>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ElMessage, ElTable } from 'element-plus';
import { onMounted, ref, reactive, Ref, onBeforeMount, watch, computed } from 'vue'
import { Right } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import * as echarts from 'echarts';
import { forEach } from 'lodash';
import internal from 'stream';
const calcMode = ref()
const distance = ref()
const ifSpeedScroll = ref(true)
const ifPressScroll = ref(true)
const ipc = require('electron').ipcRenderer;
const ifSpeed = ref(false)
const ifPressure = ref(false)
const ifDraw = ref(false)
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
const speedClass = ref("default")
const speedClasses = reactive([
    {
        value: "default",
        label: "默认",
    }
])
const speedTable = ref<InstanceType<typeof ElTable>>()
// const speedTable=ref()
type speeddata = {
    id: number,
    currentSpeed: number,
    data: speeddataitem[]
}
type speeddataitem = {
    id: number,
    type: string,
    distance: number,
    time: number,
    speed: number
}
const speedData: speeddata = reactive({
    id: 0,
    currentSpeed: 0,
    data: []
})
type pressdata = {
    id: number,
    cnt35: number,
    ok35: number,
    cnt50: number,
    ok50: number,
    cnt100: number,
    ok100: number,
    data: pressdataitem[]
}
type pressdataitem = {
    id: number,
    type: string,
    per35: number,
    per50: number,
    per100: number,
    perAll: number
}
const pressData: pressdata = reactive({
    id: 0,
    cnt35: 0,
    ok35: 0,
    cnt50: 0,
    ok50: 0,
    cnt100: 0,
    ok100: 0,
    data: []
})
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
// computed()
watch(
    calcMode,
    (value, oldValue) => {
        console.log(value, oldValue)
        if (calcMode.value == "speed") {
            ifSpeed.value = true
            ifDraw.value = false
            ifPressure.value = false
        }
        if (calcMode.value == "press") {
            ifSpeed.value = false
            ifDraw.value = false
            ifPressure.value = true
        }
        if (calcMode.value == "pic") {
            ifSpeed.value = false
            ifDraw.value = true
            ifPressure.value = false
        }
    }
)
const handleSpeedClassChange = () => {
    // console.log(speedClass.value)
    let exist = false
    speedClasses.forEach((item) => {
        if (item.value == speedClass.value) {
            exist = true
        }
    })
    if (!exist) {
        speedClasses.push({
            label: speedClass.value,
            value: speedClass.value

        })
    }
}
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
function strTokPa(str: string): DataItem {

    let strNew = str
    while (strNew.length < 8) {
        strNew = "0" + strNew
    }

    let kPa: number = 0
    for (let i = 0; i < strNew.length; i++) {
        if (strNew[i] == "1")
            kPa = i + 1
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

            if (ifSpeed.value) {
                let time = Number(str.toString("ascii"))
                speedData.id++
                speedData.data.push({
                    id: speedData.id,
                    type: speedClass.value,
                    distance: distance.value,
                    time: time,
                    speed: (distance.value * 1000) / time,
                })
                speedData.currentSpeed = (distance.value * 1000) / time
                if (speedTable.value != null && ifSpeedScroll.value) {
                    // speedTable.value.scrollTo
                    speedTable.value.scrollTo({
                        left: 0,
                        top:100 * speedData.id,
                        behavior: 'smooth'
                    })
                }
            }
            //TODO pressure没写 
            if (ifDraw.value) {
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
            if (ifAutoSave.value) {
                saveOnce(str.toString("ascii"))
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
        let data = ""
        ipc.send("save-message", data);
        saveBefore()

        //  
    })
    ipc.on('save-reply', function (event: any, filename: any) {

        console.log(filename)

        //  
    })
})

function saveData(str: string) {
    ipc.send("save-message", str);
}
const saveOnce = (str: string) => {
    if (ifSpeed) {
        saveData(speedDataToStr(speedData.data[speedData.data.length-1]))
    } else {
        if (ifPressure) {
            // saveData()
        } else {
            saveData(str + "\n")
        }
    }
}
const saveBefore=()=>{
    if (ifSpeed) {
        let str=""
        speedData.data.forEach((s)=>{
            str+=speedDataToStr(s)
        })
        saveData(str)
    } else {
        if (ifPressure) {
            // saveData()
        } else {
          
        }
    }
}
const speedDataToStr = (d: speeddataitem) => {
    console.log(d)
    return d.id + "," + d.type + "," +
        d.distance + "," +
        d.time + "," +
        d.speed + "\n"

}
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

const option = {
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
            animation: true
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
    if (a != null) {
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
<style>/* .el-row {
  margin-bottom: 20px;
} */
.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    text-align: center;
    line-height: 36px;
    border-radius: 4px;
    min-height: 36px;
}

.simpleUnit {
    /* border: solid 1px rgb(177, 244, 205);
     */
     text-align: center;
    
}
.parent {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bottom {
  /* margin-top: auto; */
  /* margin-bottom: 100px; */
}


/* 整个布局的配色 */
.el-row {
  /* background-color: #f7f7f7; */
  /* border: 1px solid #ddd; */
  /* box-shadow: 0 0 5px rgba(0,0,0,0.3); */
  /* border-radius: 5px; */
  padding-top: 2px;
  /* margin-bottom: 10px; */
}

/* 下拉框的配色 */
.el-select,
.el-input {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  border-radius: 4px;
}

/* 单选框、复选框和开关的配色 */
.el-radio,
.el-checkbox,
.el-switch {
  border-color: #d9d9d9;
}

/* 按钮的配色 */
.el-button {
  background-color: #555;
  border-color: #555;
  color: #fff;
}

.el-button:hover {
  background-color: #333;
  border-color: #333;
}

/* 卡片的配色 */
.el-card {
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  border-radius: 5px;
  margin-bottom: 20px;
}

/* 头部文字的配色 */
.el-card__header {
  background-color: #f5f5f5;
  border-radius: 5px 5px 0 0;
  padding: 10px 20px;
}

/* 分割线的配色 */
.el-divider {
  background-color: #ddd;
}

/* 提示框的配色 */
.el-tooltip {
  background-color: #333;
  color: #fff;
}






body {
  background-color: #f2f2f2;
}

/* 标题和文本颜色为深灰色 */
h1, p {
  color: #333333;
}

/* 选择框、按钮、卡片、分割线和工具提示的背景色为淡灰色 */
.el-select,
.el-card,
.el-divider,
.el-tooltip {
  background-color: #e6e6e6;
}

/* 选择框、按钮、卡片、分割线和工具提示的边框颜色为深灰色 */
.el-select,
.el-card,
.el-divider,
.el-tooltip {
  border-color: #666666;
}

/* 单选框、多选框和文本输入框的边框颜色为浅灰色 */
.el-radio,
.el-checkbox,
.el-input {
  border-color: #cccccc;
}

/* 单选框、多选框和文本输入框的背景色为淡灰色 */
.el-radio,
.el-checkbox,
.el-input {
  background-color: #e6e6e6;
}

/* 单选框、多选框和文本输入框的文本颜色为深灰色 */
.el-radio,
.el-checkbox,
.el-input {
  color: #333333;
}

/* 文本输入框的高度为50px */
.el-input {
  height: 50px;
}

/* 左侧栏的宽度为30% */
.el-col:first-child {
  width: 30%;
}

/* 右侧栏的宽度为70% */
.el-col:last-child {
  width: 70%;
}
</style>