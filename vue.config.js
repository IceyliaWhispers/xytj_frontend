const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	devServer: {
		proxy: {
			'/api': {
				pathRewrite: {'^/api': ''},//路径重写
				target: 'http://127.0.0.1:4523/m1/2382127-0-default', // 代理的目标地址
				changeOrigin: true, // 是否开启跨域

				ws:true,
				changeOrigin: true
			},
		},
		port: 8081,
	},
	publicPath: './',
	
})


