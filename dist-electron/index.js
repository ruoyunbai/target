"use strict";const t=require("electron"),l=require("path"),i=require("electron").ipcMain,r=require("electron").dialog,c=require("fs");let o="";i.on("open-save-chart-dialog",async function(e){let n=await r.showSaveDialog({title:"保存数据",defaultPath:"/",filters:[{name:"text",extensions:["txt"]},{name:"excel",extensions:["csv"]}]});e.sender.send("save-finished",n),o=n.filePath});i.on("save-message",function(e,n){let a=o;c.writeFile(a,n,{encoding:"utf8",flag:"a"},s=>{s?e.sender.send("save-reply","写入失败"+s):e.sender.send("save-reply","写入成功")})});const d=()=>{const e=new t.BrowserWindow({webPreferences:{contextIsolation:!1,nodeIntegration:!0}});e.webContents.openDevTools(),e.setMenu(null),process.env.NODE_ENV==="development"?e.loadURL(process.env.VITE_DEV_SERVER_URL):e.loadFile(l.join(__dirname,"../dist/index.html")),e.setPosition(0,0)};t.app.whenReady().then(d);
