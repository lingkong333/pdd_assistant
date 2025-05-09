"use strict";
const { httpClient } = require("../http");
const getALiShopWebData = async (url) => {
  const response = await httpClient.get(url);
  if (response.success) {
    console.log(response.data);
    return response.data;
  }
};
const { ipcMain } = require("electron");
ipcMain.handle(
  "ev:send-desktop-capturer_source",
  async (_event, _args) => {
    console.log("222");
    return { cc: 33 };
  }
);
ipcMain.handle("post-message", async () => {
  const msg = await getALiShopWebData("https://detail.1688.com/offer/751949876973.html");
  console.log(msg);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("支付宝到账100万元");
    }, 2e3);
  });
});
const { app, BrowserWindow } = require("electron");
const { join } = require("path");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "love",
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: true,
      // 引入预加载脚本
      preload: join(__dirname, "preload.js")
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../dist/index.html"));
  }
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
