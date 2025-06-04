const { ipcMain } = require('electron')
// 拼多多详情页
// https://detail.1688.com/offer/682151277409.html
ipcMain.handle(
    'ev:send-desktop-capturer_source',
    async (_event, _args) => {
        console.log('222')
        return { cc: 33 }
    }
);

ipcMain.handle('post-message', async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('支付宝到账100111万元');
        }, 2000);
    });
})

