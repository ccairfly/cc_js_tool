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