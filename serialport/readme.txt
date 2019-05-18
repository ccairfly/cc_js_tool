####使用方法:
使用前确保已经安装node开发环境,若没有安装请安装node
安装node结束之后默认安装了npm
配置config的COM口 号码
输入命令node serialport_test.js

1.安装串口工具,目录下有package-lock.json的话 直接npm i 否则npm install serialport -save

2.引包:const SerialPort = require("serialport");

3.遍历COM口:
SerialPort.list(function (err, ports) {
  ports.forEach((port)=>{
    console.log(port.comName);
    // portNow = port.comName
  });
});

4.实例化串口
var serialPortNow = new SerialPort(portNow,{
    baudRate: 921600
})

5.接收数据处理:
serialPortNow.on("data",(data)=>{
...
})

6.发送数据:
这里使用buff发送:
var buf = Buffer.from(sendcmd,'ascii')
serialPortNow.write(buf)

BES2300Z立体声SDK示例:
1.握手:
耳机开机发送握手信号: BE 50 00 03 00 00 01
工具接收到握手信号,发起握手:BE 50 00 01 01 EF
握手成功耳机返回:BE 50 00 03 02 00 01 EB

2.设置耳机bootmode:
设置进入信令模式和非信令模式:
BE 00 01 05 E1 30 02 30 00 F8	//signal test enter ok	
BE 00 01 05 E1 30 02 50 00 D8	//nosignal test enter ok	
设置成功返回:BE 00 01 01 00 3F

3.重启耳机:BE 00 02 01 F3 4B	//boot from flash
