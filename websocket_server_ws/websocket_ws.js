const ws = require('nodejs-websocket')
const SerialPort = require("serialport");

const PORT = 8001
var g_conn 
var serialPortNow

function openSerialPort(port)
{
    //实例化串口
    serialPortNow = new SerialPort(port,{
        baudRate: 921600,
        isOpen: true
    })
    serialPortNow.on("open",err=>{
        if(!err)
            g_conn.send("[serialport open success]");
        else
            console.log("serialport open fail");
            
    })

    serialPortNow.on("error",(err)=>{
        console.log(err);
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
        } else if(str.indexOf('open serialport')) {
            var strArr = str.split("|")
            var portNow = strArr[1]
            openSerialPort(portNow)
        }
	})
	conn.on("close", function (code, reason) {
        console.log("Connection closed")
        if(serialPortNow) {
            serialPortNow.close(err=>{
                if(err)
                    console.log("port close" + err);
            })
        }
    })
    conn.on("error", function (code, reason) {
        console.log("Connection closed and error")
        if(serialPortNow) {
            serialPortNow.close(err=>{
                if(err)
                    console.log("port close" + err);
            })
        }
	})
}).listen(PORT,()=>{
    console.log('nodejs server open success , port:' + PORT);
})