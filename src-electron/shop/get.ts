const { ipcMain } = require('electron')
import { getALiShopWebData } from '../webData/get'

ipcMain.handle(
    'ev:send-desktop-capturer_source',
    async (_event, _args) => {
        console.log('222')
        return { cc: 33 }
    }
);

ipcMain.handle('post-message', async () => {
    const msg = await getALiShopWebData('https://detail.1688.com/offer/751949876973.html')
    console.log(msg)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('支付宝到账100万元');
        }, 2000);
    });
})
// x是成本价
// y是利润
// 4是固定成本
// x + 4 + y/5.8 = y
// x + 4 = 24y/29
// 19.9
// 