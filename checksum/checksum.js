const path = require('path')
const fs = require('fs')

//获取数据
const data = fs.readFileSync('data.txt').toString()
//分割数据
var dataArr = data.split(" ")

var dataArr2 = []
dataArr.forEach((item,idx) => {
    dataArr2[idx] = parseInt(item,16)
});

var checksum = 0 

dataArr2.forEach(item=>{
    checksum += item
})
// console.log(dataArr);
// console.log(dataArr2);
console.log("res:"+checksum.toString(16));

