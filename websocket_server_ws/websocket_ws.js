const ws = require('nodejs-websocket')
const SerialPort = require("serialport");

const PORT = 8001
var g_conn 
var serialPortNow
var portOpenSuccess = false

const handShakeRequest = 'be500003000001ed'
const handShakeSuccess = 'be500003020001eb'
const bootmodeSetSuccess = 'be000101003f'
const sendHandshake = [0xbe,0x50,0x00,0x01,0x01,0xef]
const sendSetBootmode = [0xbe,0x00,0x01,0x05,0xe1,0x30,0x02,0x30,0x00,0xf8] //signal test
const sendFlashReboot = [0xbe,0x00,0x02,0x01,0xf3,0x4b]

function serialportDataHandler(data)
{
    if(data.toString('hex') == handShakeRequest) {
        // console.log('opening') //收到开机握手请求,发送握手信号
        serialPortNow.write(Buffer.from(sendHandshake,'ascii'))
    } else if(data.toString('hex') == handShakeSuccess) {
        // console.log('syncSuccess')  //握手成功设置bootmode
        g_conn.send("[device sync success]");
        serialPortNow.write(Buffer.from(sendSetBootmode,'ascii'))
    } else if(data.toString('hex') == bootmodeSetSuccess) {
        //bootmode设置成功,重启进入testmode
        // console.log("enter signal test mode");
        g_conn.send("[enter signal test mode]");
        serialPortNow.write(Buffer.from(sendFlashReboot,'ascii'))
    }
}

function openSerialPort(port)
{
    //实例化串口
    serialPortNow = new SerialPort(port,{
        baudRate: 921600,
        isOpen: true
    })
    serialPortNow.on("data",serialportDataHandler)

    serialPortNow.on("open",err=>{
        if(!err) {
            g_conn.send("[serialport open success]");
            portOpenSuccess = true
        }
            
        else {
            portOpenSuccess = false
            console.log("serialport open fail");
        }
    })

    serialPortNow.on("error",(err)=>{
        console.log(err);
        portOpenSuccess = false
    })
}

var server = ws.createServer(function (conn) {
    console.log("New connection")
    g_conn = conn
	conn.on("text", function (str) {
		console.log("Received "+str)
		if(str == 'get serialport') {
            SerialPort.list((err,ports)=>{
                var portslist = []
                ports.forEach((item)=>{
                    portslist.push(item.comName)
                })
                conn.send('[get serialport]|' + portslist.toString())
                delete portslist
            })
        } else if(str.indexOf('open serialport') != -1) {
            var strArr = str.split("|")
            var portNow = strArr[1]
            openSerialPort(portNow)
        } else if(str.indexOf('close serialport') != -1) {
            serialPortNow.close(err=>{
                if(err) {
                    portOpenSuccess = false
                    console.log("port close" + err);
                } else {
                    conn.send('[serialport close success]')
                }
                    
            })
        }
	})
	conn.on("close", function (code, reason) {
        console.log("Connection closed")
        if(serialPortNow) {
            serialPortNow.close(err=>{
                if(err) {
                    portOpenSuccess = false
                    console.log("port close" + err);
                }
                    
            })
        }
    })
    conn.on("error", function (code, reason) {
        console.log("Connection closed and error")
        if(serialPortNow) {
            serialPortNow.close(err=>{
                if(err) {
                    portOpenSuccess = false
                    console.log("port close" + err);
                }
            })
        }
	})
}).listen(PORT,()=>{
    console.log('nodejs server open success , port:' + PORT);
})