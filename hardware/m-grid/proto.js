// m-grid: rubbish arduinome driver

console.log('m-grid : rubbish arduinome driver v1')

var SerialPort = require('serialport')

var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 57600
})

port.on('data', function (data) {
  console.log(data)
    var b = Buffer.from([data[1], data[0]], 'hex')
    port.write(b)
  // todo... light up the correct LED (not all of them!)
})

