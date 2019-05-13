const path = require('path')
const fs = require('fs')

//获取数据
const data = fs.readFileSync('jsondata.txt').toString()
var str_1 = data.replace(/\s*/g,"")

var dataArr = []
for(var i = 0; i < str_1.length; i++) {
    dataArr[i] = (str_1.charCodeAt(i)).toString(16)
}
dataArr = dataArr.join(' ');
console.log(dataArr);

fs.writeFile('outputData.txt',dataArr,()=>{
    console.log("write success");
})