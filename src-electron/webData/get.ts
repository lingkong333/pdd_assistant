const { httpClient } = require('../http')

export const getALiShopWebData = async (url: string) => {
    const response = await httpClient.get(url)
    if (response.success) {
        console.log(response.data)
        return response.data
    }
    // return null
}

// module.exports = {
//     getALiShopWebData
// }