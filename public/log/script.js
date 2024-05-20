const a =  document.getElementById("root")

socket.on("connect", () => {
    document.getElementById("load").classList.add("hidden")
})

socket.emit("logs.get")
socket.on("log.post", (log, i) => {
    if (!i) {
        return
    }
    a.innerHTML += `<span class="log">${log}<span>`
})