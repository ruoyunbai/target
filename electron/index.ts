import { app,BrowserView, BrowserWindow } from "electron";
import path from "path";
// 1. 引入对话框与IPC通信模块
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const fs = require('fs')
let filePath = ""
ipc.on('open-save-chart-dialog', async function (event) {
  let filename = await dialog.showSaveDialog({
    title: '保存数据',
    defaultPath: '/',
    filters: [
      {
        name: 'text',
        extensions: ['txt']
      },
      {
        name: 'excel',
        extensions: ['csv']
      }
    ]
  });

  // 通知渲染进程，将获取到的文件路径传给Vue组件中响应函数
  event.sender.send('save-finished', filename);
  filePath = filename.filePath

})
// https://www.cnblogs.com/wsm777/p/13631547.html
ipc.on('save-message', function (event, arg) {
  // arg是从渲染进程返回来的数据
  // fs.
  // let fileName = path.join(__dirname, "../renderer/data/data.json")
  let fileName=filePath
  // fs.access(fileName, fs.constants.F_OK, err => {
  //   if (err) {
  //     event.sender.send('save-reply', "创建失败" + err);
  //   } else {
      fs.writeFile(fileName, arg, {encoding: 'utf8', flag: 'a'}, (err) => {
        if (err) {

          event.sender.send('save-reply', "写入失败" + err);
        } else {
          event.sender.send('save-reply', "写入成功");
        }
      }
      )
  //   }
  //   // 通过event.sender.send给渲染进程传递数据

  // }
  // )
  // 2.定义IPC主进程响应函数
})
const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      // 允许渲染进程使用node
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.webContents.openDevTools()
  win.setMenu(null);
  // app.isPackaged 字段存在bug，即使正常打包后，仍然为false，所以不能用来判断项目是否经过打包
  if (process.env.NODE_ENV === 'development') {
    // 开发环境
    // process.env.VITE_DEV_SERVER_URL获取开发服务器的url
    // vite版本不同，VITE_DEV_SERVER_URL字段也有所变化，打印process.env查找具体的名称
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // 生产环境
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  win.setPosition(0,0)
  // const winMqtt = new BrowserWindow({
  //   width: 600,
  //   height: 600,
  //   webPreferences:{
  //     preload:path.join(__dirname,'preload.js'),
  //     nodeIntegration: true,//设置开启nodejs环境
  //     // enableRemoteModule: true, //enableRemoteModule保证renderer.js可以可以正常require('electron').remote
  //     contextIsolation:false
  //   }
  // })
  // winMqtt.setPosition(780,0)
  // // winMqtt.webContents.openDevTools()
  // if (process.env.NODE_ENV === 'development') {
  //   // 开发环境
  // winMqtt.loadFile('public/mqtt/index.html')
  // } else {
  //   // 生产环境
  //   winMqtt.loadFile(path.join(__dirname, "../dist/mqtt/index.html"))

  // }
};

app.whenReady().then(createWindow)