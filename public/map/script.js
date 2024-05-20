const canvas = document.getElementsByTagName("canvas")[0]
const ctx = canvas.getContext("2d")

canvas.height = 600
canvas.width = 600

let bg = new Image()
bg.src = "../pillier.png"

socket.emit("pylons.get", (pt) => {
    ptx = pt
    console.log(pt);
    document.getElementById("load").classList.add("hidden")
})
// socket.emit("")

let ptx = {}
let pts = []


function drawPoint(x, y, pointSize, color = "red") {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, pointSize, 0, Math.PI * 2)
    ctx.fill()
}
draw()

function draw() {
    requestAnimationFrame(draw)
    ctx.drawImage(bg, 0, 0)
    
    for (const id in ptx) {
        let pt = ptx[id]
        drawPoint(pt.pos.x * 10, pt.pos.y * 10, 10)
    }
}
draw()
// socket.emit("pylons.get", (pt) => {
//     ptx = pt
//     console.log(pt);
// })
// for (const id in ptx) {
//     let pt = ptx[id]
//     drawPoint(pt.pos.x * 10, pt.pos.y * 10, 10)
// }