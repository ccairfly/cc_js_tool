const fs = require('fs')

fs.readFile('./programmer2300.bin',(err,data)=>{
    // console.log(data.toString('hex'));
    fs.writeFile('./ramrun_out.txt',data.toString('hex').toUpperCase(),()=>{
        console.log('write ok');
    })
})