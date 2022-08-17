/**
 * key => apiName
 * target => 开发环境地址 及 测试环境地址
 * productionTarget => 生产环境地址
 */
const proxyConfig = [
  {
    key: 'api', // 图书服务
    target: process.env.VUE_APP_API_TARGET,
    productionTarget: process.env.VUE_APP_API_PRODUCTION_TARGET
  }
]

module.exports = proxyConfig
