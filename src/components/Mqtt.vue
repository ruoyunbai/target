<template>
<div id = 'server'>
<table>
  <tr>
    <td>
      Ip:
    </td>
    <td>
      <input id='ipOftheServe' rows="1" cols="40" placeholder="请输入目标ip" v-model="ipOftheServe">
    </td>
  </tr>
  <tr>
    <td>
      Port:
    </td>
    <td>
      <input id='portOftheServe' rows="1" cols="40" placeholder="请输入目标端口" v-model="portOftheServe">

    </td>

  </tr>
  <tr>
    <td>
      User:
    </td>
    <td>
      <input id='userOflocal' rows="1" cols="40" placeholder="请输入用户id" v-model="userOflocal">

    </td>
  </tr>
  <tr>
    <td>
      Password:
    </td>
    <td>
      <input id='passwordOfuser' type="password" rows="1" cols="40" placeholder="请输入用户密码" v-model="passwordOfuser">

    </td>
  </tr>
  <tr>
    <td>
      State:</td>
    <td>
      <div id='stateOfconnect' >{{state}}
      </div>
    </td>
  </tr>
</table>

<button id="ConnectServer" v-bind="ConnectServer" @click="ConnectServer_fun()">Connect
</button>
<button id="DisconnectServer" v-bind="DisconnectServer">Disconnect
</button>
<table>
  <tr>
    <td>
      Topic:
    </td>
    <td>
      <input id='topicpublish' rows="1" cols="40" v-model="topicpublish">

    </td>
  </tr>
  <tr>
    <td>
      QoS:
    </td>
    <td>
      <select id="qosType">
        <option>
          0
        </option>
        <option>
          1
        </option>
        <option>
          2
        </option>
      </select>
    </td>
  </tr>
  <tr>
    <td>
      Message:
    </td>
    <td>
      <input id='messagePub' rows="1" cols="40">

    </td>
  </tr>
</table>
<button id="Publish">Publish</button>
<table>
  <tr>

    <td>
      Topic:
    </td>
    <td>
      <input id='topicTarget' rows="1" cols="40">

    </td>
  </tr>

</table>

<button id="Subscribe">Subscribe
</button>
<button id="Unsubscribe">Unsubscribe
</button>

<table>
  <tr>
    <td>
      Log:
    </td>
    <td>
      <textarea id='log' rows="10" cols="40">
    </textarea>
    </td>
  </tr>
</table>
</div>
<div>
  请选择计算内容
</div>
<select id="Pageswitch" v-model="PageSwitch" @change="ChooseComputeType()">
  <option value =1>
    Velocity
  </option>
  <option value =2>
    Pressure
  </option>
</select>

<div id="Velocity" v-show="show1">
<table>
  <tr>
    <td>
      当前计算距离:
    </td>
    <td>
      <input id='Distance' rows="1" cols="40">

    </td>
    <td>
      <button id="ComputeV">计算速度
      </button>
    </td>
  </tr>
  <tr>
    <td>计算速度:
    </td>
    <td>
      <div id = 'vTemp'>0.0</div>
    </td>
    <td>
    </td>
  </tr>
  <tr>
    <td>
      当前计算类型:
    </td>
    <td>
      <select id='DataclassV' rows="1" cols="40">
      </select>
    </td>
    <td></td>
    </tr> 
    <tr>
      <td>
      <input id='classnameV' rows="1" cols="40">

      </td>
    <td>
      <button id="NewclassV">新建数据类
      </button>
    </td>
    <td>
    </td>
  </tr>
</table>

<table border ="2" id="Vlist" > 
  <caption>历史速度记录</caption>
  <thead>
  <tr>
    <td>序号
    </td>
    <td>类型
    </td>
    <td>时间
    </td>
    <td>距离
    </td>
    <td>速度
    </td>
  </tr>
</thead>
<tbody>
</tbody>
</table>
<br>
<table>
  <tr>
    <td>
        当前类型的历史平均速度: 
    </td>
    <td>
      <div id='AverageV' >0.0
      </div>
    </td>
  </tr>
</table>  
</div>

<div id="Pressure" v-show="show2">
  <table border ="2">
    <caption>各传感器数目</caption>
    <tr>
      <td>
        传感器类型
      </td>
      <td>
        传感器总数(手动填写)
      </td>
      <td>
        已接受传感器数目
      </td>
      <td>
        达标率
      </td>
    </tr>

    <tr>
      <td>
        35KP
      </td>
      <td>
        <input id='s35KP' rows="1" cols="10">

      </td>
      <td>
        <input id='rec35KP' rows="1" cols="10">

      </td>
      <td>
        <div  id = 'rate35KP'>0.0
        </div>
      </td>
    </tr>

    <tr>
      <td>
        50KP
      </td>
      <td>
        <input id= 's50KP' rows="1" cols="10">

      </td>
      <td>
        <input id='rec50KP' rows="1" cols="10">

      </td>
      <td>
        <div  id = 'rate50KP'>0.0
        </div>
      </td>
    </tr>

    <tr>
      <td>
        100KP
      </td>
      <td>
        <input id='s100KP' rows="1" cols="10">

      </td>
      <td>
        <input id='rec100KP' rows="1" cols="10">

      </td>
      <td>
        <div  id = 'rate100KP'>
          0.0
        </div>
      </td>
    </tr>
  </table>
  <table>
    <tr>
      <td>
        <button id = "ComputeP">计算达标率            
        </button>
      </td>
      <td>
        综合达标率:
      </td>
      <td>
        <div id = "synthesisP">0.0
        </div>
      </td>
    </tr>
    </table>
    <table>
    <tr>
      <td>
        当前计算类型:
      </td>
      <td>
        <select id='DataclassP' rows="1" cols="40">
        </select>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <input id='classnameP' rows="1" cols="40">

      </td> 
      <td>
        <button id="NewclassP">新建数据类
        </button>
      </td>
      <td></td>
    </tr>
</table>


  <table border ="2" id="Plist" > 
    <caption>历史速度记录</caption>
    <thead>
    <tr>
      <td>序号
      </td>
      <td>类型
      </td>
      <td>35达标率
      </td>
      <td>50达标率
      </td>
      <td>100达标率
      </td>
      <td>综合达标率
      </td>
    </tr>
  </thead>
  <tbody>
  </tbody>
  </table>
  <br>
  <table>
    <tr>
      <td>
        当前类型的历史平均达标率: 
      </td>
      <td>
        <div id='AverageP' >0.0
        </div>
      </td>
    </tr>
  </table>  
</div>
<br>
<div>计算完请点击以下按钮来保存当前实验数据</div>
<button id = 'save'>保存数据</button>
</template>


<script setup lang='ts'>
import { ref } from 'vue'
import mqtt from 'mqtt'
//连接参数
const ipOftheServe = ref()
const portOftheServe = ref()
const userOflocal = ref()
const passwordOfuser = ref()
var state = ref("DisConnected")
//链接按钮
const ConnectServer = ref()
const DisconnectServer = ref()
//发送话题按钮
const topicpublish = ref()
//功能下拉框
const PageSwitch = ref()
//功能模块展示选项
const show1 = ref(false)
const show2 = ref(false)

//服务器默认参数配置
const connection = {
        protocol: "ws",
        host: "broker.emqx.io",
        // ws: 8083; wss: 8084
        port: 8083,
        endpoint: "/mqtt",
        clean: true,
        connectTimeout: 30 * 1000, // ms
        reconnectPeriod: 4000, // ms
        clientId: "emqx_vue_" + Math.random().toString(16).substring(2, 8),
        username: "emqx_test",
        password: "emqx_test",
      }
// const subscription={
//         topic: "topic/mqttx",
//         qos: 0,
//       }
// const publish= {
//         topic: "topic/browser",
//         qos: 0,
//         payload: '{ "msg": "Hello, I am browser." }',
//       }
// var receiveNews = ""
// const qosList= [0, 1, 2]
let client = ref({
  connected: false,
} as mqtt.MqttClient);
// var subscribeSuccess= false
let connecting= false
// var retryTimes= 0

//连接mqtt服务器
function ConnectServer_fun (){
    connecting = true;
    connection.username = userOflocal.value
    connection.password = passwordOfuser.value
    const { protocol, host, port, endpoint, ...options } = connection;
    const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
    state.value = 'hello1'
    // client.value = mqtt.connect(connectUrl, options);
    // state.value = 'hello2'
    // //建立连接
    // if (client.value.on) {
    //   client.value.on("connect", () => {
    //     console.log("connection successful");
    //   });
    //   // client.value.on("reconnect", null);
    //   client.value.on("error", (error) => {
    //     console.log("connection error:", error);
    //   });
    //   client.value.on("message", (topic: string, message) => {
    //     console.log(`received message: ${message} from topic: ${topic}`);
    //   });
    // }
    // if (client.value.on) {
    //       client.value.on("connect", () => {
    //       connecting = false;
    //       console.log("Connection succeeded!");
    //       state.value = "Connected"
    //       });
    //       // client.value.on("reconnect", handleOnReConnect);
    //       client.value.on("error", (error) => {
    //         console.log("Connection failed", error);
    //       });
    //       // client.value.on("message", (topic, message) => {
    //       //   this.receiveNews = this.receiveNews.concat(message);
    //       //   console.log(`Received message ${message} from topic ${topic}`);
    //       // });
    //     }
}

//切换计算功能
function ChooseComputeType() {
    if(PageSwitch.value == 1){
      show1.value = true
      show2.value = false
    }
    else if (PageSwitch.value == 2){
      show1.value = false
      show2.value = true
    }
    else {
      show1.value = false
      show2.value = false
    }
}
</script>


<style scoped>
</style>