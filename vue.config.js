const path = require('path')
const webpack = require('webpack')
const NODE_ENV = process.env.NODE_ENV || 'development'
const BuildVersionWebpackPlugin = require('build-version-webpack-plugin')
console.log('NODE_ENV', NODE_ENV)
const { vueAlias, webpackAlias } = require('./build/alias') // 文件别名配置
validProductionApi() // check develop environment has API
const circularCheck = require('./build/circular-check')
const devServer = require('./build/dev-server') // 开发环境服务配置
const { svgIconRule } = require('./build/svg-icon')
console.log(webpackAlias)
const staticGzip = require('./build/static_gzip') // 生成静态gzip文件
console.log(devServer)
console.log(vueAlias)
const { publicPath = '/', outputDir = 'dist', assetsDir } = getParamsFromCommand(process.argv)
module.exports = {
  publicPath,
  assetsDir, // 智能平台的需要使用public
  outputDir,
  lintOnSave: false,
  productionSourceMap: false,
  devServer, // 开发服务配置
  // css: {
  //   extract: true
  // },
  pluginOptions: {
    // 全局注入less变量
    // 'style-resources-loader': {
    //   preProcessor: 'less',
    //   patterns: [
    //     path.resolve(__dirname, 'sub_modules/components/styles/variate.less'),
    //     path.resolve(__dirname, 'src/style/variate.less')
    //   ]
    // }
  },
  chainWebpack: config => {
    vueAlias(config.resolve.alias) // 文件别名配置
    svgIconRule(config, '../src/assets/svg-icon')
    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_PLATFORM_NAME
      return args
    })
    return config
  },
  configureWebpack: config => {
    circularCheck(config.plugins) // 检查循环依赖
    if (NODE_ENV !== 'development') {
      staticGzip(config.plugins) // 静态gzip压缩
      config.plugins.push(new BuildVersionWebpackPlugin()) // 打包git信息
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true // 清除console
    }
  }
}
/**
 * 获取打包时输入的参数
 * @param argv {Array<String>}
 * @return 参数对象 {Object}
 */
function getParamsFromCommand(argv) {
  const item = {}
  if (NODE_ENV !== 'development') {
    let arr = []
    argv.map((v, k) => {
      if (k > 2) {
        arr = v.replace('--', '').split('=')
        item[arr[0]] = arr[1]
      }
    })
  }
  console.log(item)
  return item
}

/**
 * production打包时检查proxy是否配置生产环境地址
 */
function validProductionApi() {
  if (NODE_ENV === 'production') {
    const proxyConfig = require(path.resolve(__dirname, 'config/proxy-config'))
    proxyConfig.forEach(config => {
      if (!config.productionTarget) {
        console.error(`error:${config.key}生产环境地址未配置`)
        require('process').exit(1)
      }
    })
  }
}
