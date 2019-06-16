1.使用nodejs-websocket来搭建后端websocket服务器
https://github.com/sitegui/nodejs-websocket
快速搭建项目 npm init -y
安装 npm i nodejs-websocket -S 项目依赖

2.开始使用:创建服务并监听
var server = ws.createServer(function (conn) {
	console.log("New connection")
	conn.on("text", function (str) {
		console.log("Received "+str)
		conn.sendText(str.toUpperCase()+"!!!")
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
}).listen(8001)
