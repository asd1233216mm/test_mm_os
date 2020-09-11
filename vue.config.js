// vue.config.js
module.exports = {
/******************下面是我自己的代码******************
*******主要是配置路径别名或其他的loader的，不用添加*******/
    configureWebpack: {
        resolve: {
            alias: {//路径别名
                'assets': '@/assets',
                'common': '@/common',
                'network': '@/network',
                'components': '@/components',
                'views': '@/views',
            }
        },
    },
/***********************下面是需要添加的***********************/
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
          item
            .use('sass-resources-loader')
            .loader('sass-resources-loader')
            .options({
              // 全局变量文件路径，只有一个时可将数组省去
              resources: ['./src/assets/css/var.scss']
            })
            .end()
        })
      }
}