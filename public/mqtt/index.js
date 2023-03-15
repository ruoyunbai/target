const ipcRenderer = window.require('electron').ipcRenderer;
const mqtt = window.require("mqtt");

window.onload = function(){
  //对应html控件
  //服务器部分
  var ip = this.document.querySelector('#ipOftheServe')
  var port = this.document.querySelector('#portOftheServe')
  var user = this.document.querySelector('#userOflocal')
  var password = this.document.querySelector('#passwordOfuser')
  var state = this.document.querySelector('#stateOfconnect')
  //发消息部分
  var QoS = this.document.querySelector('#qosType')
  var topicPublish = this.document.querySelector('#topicpublish')
  var message = this.document.querySelector('#messagePub')
  //订阅及展示部分
  var topicTarget = this.document.querySelector('#topicTarget')
  var logMessage = this.document.querySelector('#log')

  //速度部分
  var vtime = 0.0

  var distance = this.document.querySelector('#Distance') 
  var v = this.document.querySelector('#vTemp')

  var typecntV = 0
  var nameV = this.document.querySelector('#classnameV')
  var datatypeV = this.document.querySelector('#DataclassV')
  var vlist = this.document.querySelector('#Vlist')
  var vavg = this.document.querySelector('#AverageV')
 

  //压力部分
  var p35 = 0
  var p50 = 0
  var p100 = 0

  var sum35 = this.document.querySelector("#s35KP")
  var sum50 = this.document.querySelector("#s50KP")
  var sum100 = this.document.querySelector("#s100KP")

  var get35 = this.document.querySelector("#rec35KP")
  var get50 = this.document.querySelector("#rec50KP")
  var get100 = this.document.querySelector("#rec100KP")

  var rate35 = this.document.querySelector("#rate35KP")
  var rate50 = this.document.querySelector("#rate50KP")
  var rate100 = this.document.querySelector("#rate100KP")

  var typecntP = 0

  var synthesisP = this.document.querySelector('#synthesisP')
  var plist = this.document.querySelector('#Plist')
  var nameP = this.document.querySelector('#classnameP')
  var datatypeP = this.document.querySelector('#DataclassP')
  var pavg = this.document.querySelector('#AverageP')


  //按钮对应事件
  //服务器部分
  var btn1 = this.document.querySelector('#ConnectServer')
  var btn2 = this.document.querySelector('#DisconnectServer')
  var btn3 = this.document.querySelector('#Publish')
  var btn4 = this.document.querySelector('#Subscribe')
  var btn5 = this.document.querySelector('#Unsubscribe')
  
  //计算功能部分
  var btnV1 = this.document.querySelector('#ComputeV')
  var btnV2 = this.document.querySelector('#NewclassV')

  var btnP1 = this.document.querySelector('#ComputeP')
  var btnP2 = this.document.querySelector('#NewclassP')

  //保存数据
  var btnSave = this.document.querySelector('#save')

  //切换功能模块
  var pageswitch = this.document.querySelector('#Pageswitch')
  var page1 = this.document.querySelector('#Velocity')
  var page2 = this.document.querySelector('#Pressure')

  //速度数据条数
  var vcnt =0;
  //压力数据条数
  var pcnt = 0;

  //服务器
  var client=null

  //切换页面
  page1.style.display = 'block'
  page2.style.display= 'none'

  //服务器默认参数设置
  const options = {
    keepalive: 30,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
  }

  pageswitch.onclick = function(){
    //ipcRenderer.send('test','yes') //测试

    if(pageswitch.value == 0){
      page1.style.display = 'block'
      page2.style.display= 'none'
    }
    else{
      page1.style.display = 'none'
      page2.style.display= 'block'
    }

  }
  btn1.onclick = function(){//连接服务器
    const connectUrl = `mqtt://${ip.value}:${port.value}`
    options.clientId = `mqtt_${Math.random().toString(16).slice(3)}`
    options.username = user.value
    options.password = password.value
    ipcRenderer.send('connecting', 'connecting mqtt client')
    client = mqtt.connect(connectUrl, options)
    logMessage.innerHTML = "hello"
    client.on('error', (err) => {//监控错误
      ipcRenderer.send('errConnect', err)
      client.end()
    })

    client.on('reconnect', () => {//监控重连
      ipcRenderer.send('ReConnect', 'Reconnect mqtt client')
    })

    client.on('connect', () => {//监控连接
      ipcRenderer.send('Connected', 'Connected success!')
      state.innerHTML='Connected'
    })

    /*
    client.on('message', (topic, message) => {
      const msg = document.createElement('div')
      msg.className = 'message-body'
      msg.setAttribute('class', 'message-body')
      msg.innerText = `${message.toString()}\nOn topic: ${topic}`
      document.getElementById('log').appendChild(msg)
    })
    */

    client.on('message', (topic,message) => {
      logMessage.append('\n'+`${message.toString()}\nOn topic: ${topic}`) 
      if(message.toString()=='a'){
        p35 =p35+1
        get35.value = p35
      }
      else if (message.toString()=='b'){
        p50=p50+1
        get50.value = p50
      }
      else if (message.toString()=='c'){
        p100=p100+1
        get100.value = p100
      }
      else if(!isNaN(Number(message.toString()))){
        vtime = message
      }
    })
    
  }
  btn2.onclick = function(){//断开连接
    if (client.connected) {
      client.end
      state.innerHTML='Disonnected'
      client.on('close', () => {
        connectBtn.innerText = 'Connect'
        ipcRenderer.send('Disonnect', 'Disonnect success')
      })
    }
  }
  btn3.onclick = function(){//对目标主题发送消息
    if (client.connected) {
      var mes = '{\n  "msg": "' + message.value + '"\n}'
      client.publish(topicPublish.value, mes, {
        qos: parseInt(QoS.value, 10),
        retain: false
        
      })
      ipcRenderer.send('Send','Send ok')
    }
  }
  btn4.onclick = function(){//订阅主题
    if(client.connected){
      client.subscribe(topicTarget.value, { qos: parseInt(QoS.value, 10) }, (error, res) => {
        if (error) {
          ipcRenderer.send('Suberror', error)
          log.value = 'Subscribe error'
        } else {
          ipcRenderer.send('Subsuccess', res)
        }
     })
    }
  }
  btn5.onclick = function(){//取消主题
    if (client.connected) {
      client.unsubscribe(topicTarget.value, error => {
        if (error) {
          log.value = error
        } else {
          log.value = "Unsubscribed "+ topicTarget.value
        }
      })
    }
  }

  btnV1.onclick = function(){//计算速度
      if(vtime==0){
        //无效计算
        v.innerHTML = "NoTimeReceive"
      }
      else{
        //有效计算
        //显示当次速度
        var x = (Number(distance.value) * 1000000.0) / (Number(vtime))
        v.innerHTML = x
        

        //加入数据表中
        vcnt+=1
        var tp=vlist.insertRow(vcnt)
        tp.innerHTML='<td>'+vcnt+'</td><td>'+datatypeV.options[datatypeV.selectedIndex].text+'</td><td>'+vtime+'</td><td>'+distance.value+'</td><td>'+x.toString()+'</td>' 

        //计算平均速度
        var numcnt=0
        var vsum = 0.0
        for(var i=1;i<=vcnt;i++){
          //ipcRenderer.send('test',vlist.rows[i].cells[4].innerHTML) //测试
          if(vlist.rows[i].cells[1].innerHTML==datatypeV.options[datatypeV.selectedIndex].text){
            numcnt += 1
            vsum += Number(vlist.rows[i].cells[4].innerHTML)
          }
        }
        if(numcnt!=0){
          vavg.innerHTML = vsum/numcnt
        }
        vtime = 0
      }
  }

  btnV2.onclick = function(){//新建速度数据类选项
     //去重
     var flag = 0
     for(var i=0;i<typecntV;i++){
      if(nameV.value == datatypeV.options[i].text){
        flag =1
        break
      }
     }
    if(flag==1){
        ipcRenderer.send('test','repeat')
    }
    else{
      datatypeV.options.add(new Option(nameV.value,typecntV))
      typecntV=typecntV+1
    }
  }

  btnP1.onclick = function(){//计算压力
    if(sum35.value == 0 || sum50.value == 0 || sum100.value == 0){
      synthesisP.innerHTML ="RequireDataInput"
    }
    else{
      //计算当次达标率
      var tp35 = Number(get35.value) / Number(sum35.value)
      rate35.innerHTML = tp35.toString()
      ipcRenderer.send('test','11')
      var tp50 = Number(get50.value) /Number(sum50.value)
      rate50.innerHTML = tp50.toString()
      ipcRenderer.send('test','12')
      var tp100 = Number(get100.value) / Number(sum100.value)
      rate100.innerHTML = tp100.toString()
      ipcRenderer.send('test','13')
            
      //计算综合达标率
      var total = Number(sum35.value) + Number(sum50.value) + Number(sum100.value)
      var rate = Number(rate35.innerHTML) * (sum35.value/total) + Number(rate50.innerHTML)*(sum50.value/total) + Number(rate100.innerHTML)*(sum100.value/total)
      synthesisP.innerHTML = rate

      p35=0
      p50=0
      p100=0

      ///加入数据表中
      pcnt+=1
      var tp=plist.insertRow(pcnt)
      tp.innerHTML='<td>'+pcnt+'</td><td>'+datatypeP.options[datatypeP.selectedIndex].text+'</td><td>'+rate35.innerHTML+'</td><td>'+rate50.innerHTML+'</td><td>'+rate100.innerHTML+'</td><td>'+rate+'</td>' 
      // ipcRenderer.send('test','??')//测试

      //计算平均速度
      var numcnt=0
      var psum = 0.0
      for(var i=1;i<=pcnt;i++){
        if(plist.rows[i].cells[1].innerHTML==datatypeP.options[datatypeP.selectedIndex].text){
          numcnt += 1
          psum += Number(plist.rows[i].cells[5].innerHTML)
        }
      }
      if(numcnt!=0){
        pavg.innerHTML = psum / numcnt
      }
    }
  }
  btnP2.onclick = function(){//新建压力数据类选项
    //去重
     var flag = 0
     for(var i=0;i<typecntP;i++){
      if(nameP.value == datatypeP.options[i].text){
        flag =1
        break
      }
     }
    if(flag==1){
        ipcRenderer.send('test','repeat')
    }
    else{
      datatypeP.options.add(new Option(nameP.value,typecntP))
      typecntP=typecntP+1
    }
  }

  btnSave.onclick = function(){//保存

  }

}
