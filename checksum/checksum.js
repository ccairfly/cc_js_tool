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
checksum = checksum.toString(16).padStart(4,"0")
console.log("bigdata: " + checksum)
var small = checksum.split("")
console.log(small);
//大小端转换
var tem1 = small[0]
var tem2 = small[1]
small[0] = small[2]
small[1] = small[3]
small[2] = tem1
small[3] = tem2
small = small.join('')
console.log('smalldata: ' + small)