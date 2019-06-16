
module.exports = {
    lintOnSave : false,     //是否开启eslint检查
    //dev serve比较重要,开发使用,所有的webpack_devServer的设置都支持
    devServer : {
        open : true,
        port : 8055,
        hot : true,
        // 配置proxy以实现跨域
        // proxy : {
        //     '/api': {
        //         "target" : 'http://localhost:3335'
        //     }
        // },
    }
}