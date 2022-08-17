const path = require('path')
const webpack = require('webpack')
const NODE_ENV = process.env.NODE_ENV || 'development'
const BuildVersionWebpackPlugin = require('build-version-webpack-plugin')
console.log('NODE_ENV', NODE_ENV)
const { vueAlias, webpackAlias } = require('./build/alias') // 文件别名配置
