let http = require('http')
let fs = require('fs')

let utils = require('./lib/utils.js')

let config = utils.getConfig()
let host = utils.getLocalAddress()
let port = config.port

utils.customLog("HTTP Server Starting...")
utils.customLog("Listening on http://" + host + ":" + port)

http.createServer((req, res) => {
  let Response = {
    "200": (data) => {
      utils.customLog('200 OK')

      res.writeHead(200, {'Content-Type': 'application/xml'})
      res.write(data, 'binary')
      res.end()
    },
    "403": () => {
      utils.customLog('403 Forbidden')

      res.writeHead(403, {'Content-Type': 'text/plain'})
      res.write('404 Forbidden\n')
      res.end()
    },
    "404": () => {
      utils.customLog('404 Not Found')

      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.write('404 Not Found\n')
      res.end()
    },
    "500": (err) => {
      utils.customLog('500 Internal Error')
      utils.customLog(err)

      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.write(err + '\n')
      res.end()
    }
  }

  utils.customLog("========== Request start ==========")

  let date = new Date()

  let ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
  utils.customLog("IP Addr: " + ip)
  utils.customLog("Request URL: " + req.url)

  if (req.url === config.route) {
    if (req.method === 'GET') {
      fs.readFile(config.filepath, 'binary', (err, file) => {
        if (err) {
          Response["500"](err)
          return
        }
        Response["200"](file)
      })
    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        utils.customLog('Request Body: ' + data)
      })

      req.on('error', (err) => {
        Response["500"](err)
        return
      })

      Response["200"]('OK')
    }
  } else {
    Response["404"]()
  }

  utils.customLog("========== Request end ==========")
}).listen(port, host)
