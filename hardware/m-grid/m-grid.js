// m-grid: rubbish arduinome driver

console.log('m-grid : rubbish arduinome driver v1')

var receiver_patch = `
#N canvas 771 456 535 468 10;
#X obj 12 125 netreceive -u -b;
#X obj 12 148 oscparse;
#X obj 12 170 list trim;
#X floatatom 81 348 5 0 0 0 - - -;
#X obj 44 249 print;
#X text 74 77 m-grid;
#X obj 12 326 unpack s s f;
#X msg 11 101 listen 9999;
#X obj 12 77 loadbang;
#X obj 45 226 spigot;
#X obj 78 206 tgl 15 0 empty empty empty 17 7 0 10 -262144 -1 -1 0
1;
#X obj 13 23 inlet;
#X obj 13 46 route debug listen;
#X obj 81 370 outlet;
#X obj 150 336 bng 15 250 50 0 empty empty empty 17 7 0 10 -262144
-1 -1;
#X connect 0 0 1 0;
#X connect 1 0 2 0;
#X connect 2 0 6 0;
#X connect 2 0 9 0;
#X connect 3 0 13 0;
#X connect 6 2 3 0;
#X connect 6 2 14 0;
#X connect 7 0 0 0;
#X connect 8 0 7 0;
#X connect 9 0 4 0;
#X connect 10 0 9 1;
#X connect 11 0 12 0;
#X connect 12 0 10 0;
#X connect 12 1 7 0;
`

var osc = require('osc')
var SerialPort = require('serialport')

var remote_OSC_port = 8888;

try {
  var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 8888,
    metadata: true
  })
  udpPort.open()
  // todo: check for 40h string in serial device name
  var port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 57600
  })
} catch(e) {
  throw Error(e)
}

var noteOn = false;

function mapKey (key) {
  var map = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    16: 8,
    17: 9,
    18: 10,
    19: 11,
    20: 12,
    21: 13,
    22: 14,
    23: 15,
    32: 16,
    33: 17,
    34: 18,
    35: 19,
    36: 20,
    37: 21,
    38: 22,
    39: 23,
    48: 24,
    49: 25,
    50: 26,
    51: 27,
    52: 28,
    53: 29,
    54: 30,
    55: 31,
    64: 32,
    65: 33,
    66: 34,
    67: 35,
    68: 36,
    69: 37,
    70: 38,
    71: 39,
    80: 40,
    81: 41,
    82: 42,
    83: 43,
    84: 44,
    85: 45,
    86: 46,
    87: 47,
    88: 48,
    96: 49,
    97: 50,
    98: 51,
    99: 52,
    100: 53,
    101: 54,
    102: 55,
    103: 56,
    112: 57,
    113: 58,
    114: 59,
    115: 60,
    116: 61,
    117: 62,
    118: 63,
    119: 64
  }
  return map[key]
}

port.on('data', function (data) {
  var b = Buffer.from('400'+String(data[0]), 'hex')
  port.write(b)
  if (data.length !== 2 || data[0] === 0) return;
  var key = mapKey(parseInt(data[1]))
  noteOn = parseInt(data[0]) || 0
  var b = Buffer.from('400'+String(data[0]), 'hex')
  port.write(b)
  // todo... light up the correct LED (not all of them!)
  udpPort.send({
        address: '/key/'+key,
        args: [{ type: 'i', value: key }]
    }, '127.0.0.1', 9999)
})

port.on('error', console.log)

console.log('m-grid.pd _____')
console.log(receiver_patch)
