const io = require("@pm2/io");

class Log {
    constructor(io) {
        this.history = []
        this.io = io
    }
    add(txt) {
        let now = new Date();
        let formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        let log = `[${formattedDate}] ${txt}`;
        console.log(txt);
        this.io.sockets.emit("log.post", log)
        this.history.push(log);
    }
}

module.exports = Log