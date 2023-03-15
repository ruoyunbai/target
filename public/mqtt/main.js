const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      preload:path.join(__dirname,'preload.js'),
      nodeIntegration: true,//设置开启nodejs环境
      enableRemoteModule: true, //enableRemoteModule保证renderer.js可以可以正常require('electron').remote
      contextIsolation:false
    }
  })

  win.loadFile('index.html')
}


app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();

}
})

app.disableHardwareAcceleration()

console.log('hello');

const { ipcMain } = require('electron')

ipcMain.on("connecting", (ev,data)=>{
  console.log(data);
})

ipcMain.on("errConnect",(ev,data)=>{
  console.log(data)
})
ipcMain.on("ReConnect",(ev,data)=>{
  console.log(data)
})
ipcMain.on("Connected",(ev,data)=>{
  console.log(data)
})
ipcMain.on("Disonnect",(ev,data)=>{
  console.log(data)
})
ipcMain.on("Suberror",(ev,data)=>{
  console.log(data)
})
ipcMain.on("Subsuccess",(ev,data)=>{
  console.log(data)
})
ipcMain.on("Send",(ev,data)=>{
  console.log(data)
})
ipcMain.on("test",(ev,data)=>{
  console.log(data)
})