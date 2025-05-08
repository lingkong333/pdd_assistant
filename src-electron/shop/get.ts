const { ipcMain } = require('electron')

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
            resolve('支付宝到账100万元');
        }, 2000);
    });
})

