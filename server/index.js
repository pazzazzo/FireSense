const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const pm2 = require('@pm2/io')
const Log = require('./Log');
const net = require("net")
const { v4 } = require('uuid');
const mysql = require('mysql2');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const con = mysql.createConnection({
  host: "localhost",
  user: "firesense",
  password: "ungroscaca",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const realtimeUser = pm2.metric({
  name: 'Realtime user',
})

const port = {
  "TCP": 9000,
  "web": 8080,
}

let log = new Log(io)
let pylonStreamsIds = new Map()

app.get('/', (req, res) => {
  res.send("ok")
  log.add("ex");
});

let users = {
  "bdx_casern": {
    "name": "Caserne de Bordeaux",
    "online": false,
    "admin": false,
  },
  "admin": {
    "name": "Administrateur",
    "online": true,
    "admin": true,
  },
  "prf": {
    "name": "Le prof",
    "online": false,
    "admin": true,
  },
  "tmr": {
    "name": "Un gros caca boudin",
    "online": false,
    "admin": false,
  },
  "tmre": {
    "name": "La grosse mère de lolo la pute",
    "online": false,
    "admin": false,
  }
}

let pylons = {
  "firesense-8320d7da-b848-4406-b43d-38f624d3abc6": {
    pos: {
      x: 10,
      y: 10
    },
    mq2: [
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
    ],
  },
  "firesense-d7831e13-dfb5-46bf-b44e-91b164a23aaf": {
    pos: {
      x: 10,
      y: 50
    },
    mq2: [
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
    ],
  },
  "firesense-5caba5e7-f9e6-4442-b9f4-140df27939e0": {
    pos: {
      x: 50,
      y: 50
    },
    mq2: [
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
    ],
  },
  "firesense-5c0193d6-fd3d-4139-ab3c-03ce283cfda7": {
    pos: {
      x: 50,
      y: 10
    },
    mq2: [
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
      {
        "sensibility": 0.5,
        "value": 0.30
      },
    ],
  }
}
function rdm(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// for (let i = 0; i < 100; i++) {
//   pylons["firesense-" + v4()] = {
//     pos: {
//       x: rdm(0, 60),
//       y: rdm(0, 60)
//     },
//     mq2: [
//       {
//         "sensibility": 0.5,
//         "value": 0.30
//       }
//     ],
//   }
// }

io.on('connection', (socket) => {
  log.add('a user connected');
  // socket.emit("loc.change", "https://www.youtube.com/watch?v=HVQSbgG69Sc")
  // socket.emit("loc.change", "https://pazzazzo.github.io")
  realtimeUser.set(io.sockets.sockets.length)

  socket.on("users.get", () => {
    socket.emit("users.update", users)
  })
  socket.on("user.delete", (id, callback) => {
    if (id === "tmr" || id === "tmre") {
      return callback(false)
    }
    log.add(`delete user: ${id}`);
    delete users[id]
    callback(true)
    socket.emit("users.update", users)
  })
  socket.on("user.admin.change", (id, callback) => {
    users[id].admin = !users[id].admin
    
    log.add(`change admin: ${id}`);
    callback(true)
    socket.emit("users.update", users)
  })
  socket.on("logs.get", () => {
    log.history.forEach((el, i) => {
      socket.emit("log.post", el, i)
    })
  })

  socket.on("pylons.get", (cb) => {
    cb && cb(pylons)
  })
  socket.on("pylon.get", (id, cb) => {
    if (pylons.hasOwnProperty(id)) {
      cb && cb(pylons[id])
    } else {
      cb && cb(null, new Error(`The pylon with id "${id}" does not exist.`))
    }
  })
  socket.on("pylon.stream", (id, cb) => {
    if (pylons.hasOwnProperty(id)) {
      let streamId = v4()
      cb && cb(pylons[id], streamId)
      let intervalId = setInterval(() => {
        socket.emit(`pylon.stream.${streamId}`, pylons[id])
      }, 500);
      pylonStreamsIds.set(streamId, intervalId)
    } else {
      cb && cb(null, new Error(`The pylon with id "${id}" does not exist.`))
    }
  })
  socket.on("pylon.unstream", (id, cb) => {
    if (pylonStreamsIds.has(id)) {
      clearInterval(pylonStreamsIds.get(id))
      cb && cb({ sucess: true })
    } else {
      cb && cb({ sucess: false, error: new Error(`The pylon stream with id "${id}" does not exist.`) })
    }
  })
  socket.on("pylon.pos.update", (id, pos, cb) => {
    if (pylons.hasOwnProperty(id)) {
      pylons[id].pos = pos
      cb && cb(true)
    } else {
      cb && cb(false)
    }
  })

  socket.on("mq2.sensibility.set", (pylonId, captorId, sensibility, cb) => {
    if (!captorId || !Number.isInteger(captorId) || Number.isNaN(captorId) || captorId < 0 || captorId > 4) {
      return cb(false, new Error(`The ID of captor is incorrect. Must be an integer between 0 and 4.`))
    }
    if (!sensibility || !Number.isInteger(sensibility) || Number.isNaN(sensibility) || sensibility < 0 || sensibility > 2) {
      return cb(false, new Error(`The sensibility of captor is incorrect. Must be an float between 0 and 2.`))
    }
    if (pylons.hasOwnProperty(pylonId)) {
      let pylon = pylons[pylonId]
      pylon.mq2[captorId] = sensibility
      return cb(true)
    } else {
      return cb(false, new Error(`The pylon with id "${pylonId}" does not exist.`))
    }
  })

  socket.on("disconnect", (r) => {
    log.add(`a user disconnected (${r})`);
    realtimeUser.set(io.sockets.sockets.length)
  })
});

server.listen(port.web, () => {
  log.add('listening *' + port.web);
});

const netServer = net.createServer((socket) => {
  log.add("new TCP client");
  socket.write("coucou arthur\r\n")
  socket.on('data', data => {
    console.log('Données reçues de l\'ESP8266 :', data.toString());
  });

  socket.on('end', () => {
    console.log('ESP8266 déconnecté.');
  });

  socket.on('error', err => {
    console.error('Erreur de socket :', err);
  });
  socket.on("connect", () => {
    log.add("a")
  })
})

netServer.listen(port.TCP, "0.0.0.0", () => {
  log.add('listening *' + port.TCP)
})