let os = require('os')
let fs = require('fs')

function getLocalAddress() {
  let ifaces = os.networkInterfaces()
  let ipAddress

  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {

      if ('IPv4' !== iface.family || iface.internal !== false) {
        return
      }
      ipAddress = iface.address
    })
  })

  return ipAddress
}

function getConfig() {
  let config

  try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
  } catch (e) {
    customLog("Couldn't find config.json.")
    process.exit()
  }

  return config
}

function customLog(log) {
  let date = new Date()
  let time = [date.getFullYear(), date.getMonth(), date.getDate()].join('/') + ' ' + date.toLocaleTimeString()

  console.log('[' + time + '] ' + log)
}


module.exports = {
  getLocalAddress,
  getConfig,
  customLog
}
