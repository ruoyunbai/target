"use strict";const i=require("electron"),t=require("path"),o=require("electron").ipcMain,r=require("electron").dialog,d=require("fs");let a="";o.on("open-save-chart-dialog",async function(e){let n=await r.showSaveDialog({title:"保存数据",defaultPath:"/",filters:[{name:"text",extensions:["txt"]},{name:"excel",extensions:["csv"]}]});e.sender.send("save-finished",n),a=n.filePath});o.on("save-message",function(e,n){let l=a;d.writeFile(l,n,{encoding:"utf8",flag:"a"},s=>{s?e.sender.send("save-reply","写入失败"+s):e.sender.send("save-reply","写入成功")})});const c=()=>{const e=new i.BrowserWindow({webPreferences:{contextIsolation:!1,nodeIntegration:!0}});process.env.NODE_ENV,e.setMenu(null),process.env.NODE_ENV==="development"?e.loadURL(process.env.VITE_DEV_SERVER_URL):e.loadFile(t.join(__dirname,"../dist/index.html")),e.setPosition(0,0);const n=new i.BrowserWindow({width:600,height:600,webPreferences:{preload:t.join(__dirname,"preload.js"),nodeIntegration:!0,contextIsolation:!1}});n.setPosition(780,0),process.env.NODE_ENV==="development"?n.loadFile("public/mqtt/index.html"):n.loadFile(t.join(__dirname,"../dist/mqtt/index.html"))};i.app.whenReady().then(c);
