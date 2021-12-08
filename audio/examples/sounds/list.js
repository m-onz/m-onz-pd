var fs = require('fs')
var dir = []

var folder = process.argv.slice(2)

fs.readdirSync('./'+folder).forEach(function (path) {
  dir.push(process.cwd()+'/'+path+';')
})

console.log(dir.join('\n'))
