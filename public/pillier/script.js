let locationBTN = document.getElementById('location')
let sensor = document.getElementById('sensor')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
const errorPopup = document.getElementById("error-popup")
const popupTitle = document.getElementById("popup-title")
const popupDesc = document.getElementById("popup-desc")
const popupReload = document.getElementById("popup-reload")
let rangeInput = document.getElementById('myRange');
let valueDisplay = document.getElementById('value');
const captorCursor = document.getElementsByClassName("captor-cursor")
const captorCursorValue = document.getElementsByClassName("captor-cursor-value")
const captorPopup = document.getElementById("captor-popup")
const pylonsHTML = document.getElementById("pylons")
const setSensorBtn = document.getElementById("sensor")

captorPopup.addEventListener("click", (ME) => {
    if (ME.srcElement === captorPopup) {
        captorPopup.classList.add("hidden")
    };
})
setSensorBtn.addEventListener("click", () => {
    captorPopup.classList.remove("hidden")
})

socket.on("disconnect", (r) => {
    errorPopup.classList.remove("hidden")
    popupTitle.innerText = "Erreur: Déconnecté"
    popupDesc.innerText = r
    popupReload.classList.remove("hidden")
    console.log(r);
})

popupReload.addEventListener("click", () => {
    location.reload()
})

let bg = new Image()
bg.src = "../pillier.png"

let ptx_selected = {
    x: 0,
    y: 0,
    show: false,
    ptx: null,
    mousedown: false,
}

let actual = {}
let actualAction;

socket.emit("pylons.get", (pt) => {
    ptx = pt
    console.log(pt);
    pylonsHTML.innerHTML = ""
    showPylons()
    document.getElementById("load").classList.add("hidden")
})

function showPylons() {
    for (const pylon in ptx) {
        let usrDiv = document.createElement("div")
        usrDiv.classList.add("btn")
        usrDiv.innerHTML = `<span>${pylon}</span>`
        usrDiv.addEventListener('click', () => {
            actual["dom"] && actual["dom"].classList.remove("active")
            actual["dom"] = usrDiv
            actual["id"] = pylon
            usrDiv.classList.add("active")
            console.log(ptx[pylon])
            showPylon(pylon)
        })
        pylonsHTML.appendChild(usrDiv)
    }

    pylonsHTML.firstChild.click()
}

function showPylon(pylonid) {
    let pylon = ptx[pylonid]
    pylon.mq2.forEach((capt, i) => {
        console.log(capt, i);
        captorCursorValue[i].innerText = `${capt.sensibility}%`
        captorCursor[i].value = capt.sensibility
    });
    console.log(`Cet pylon est: ${pylonid}`)

}

locationBTN.addEventListener("click", () => {
    canvas.classList.toggle("hidden")
})

let ptx = {}

function draw() {
    requestAnimationFrame(draw)
    ctx.drawImage(bg, 0, 0)

    if (ptx_selected.show) {
        drawPoint(ptx_selected.x, ptx_selected.y, 11, "white")
    }
    for (const id in ptx) {
        let pt = ptx[id]
        drawPoint(pt.pos.x * 10, pt.pos.y * 10, 10)
    }
}

function drawPoint(x, y, pointSize, color = "red") {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, pointSize, 0, Math.PI * 2)
    ctx.fill()
}
draw()

for (let i = 0; i < captorCursor.length; i++) {
    const captor = captorCursor[i];
    captor.addEventListener("input", () => {
        captorCursorValue[i].innerText = `${captor.value}%`
    })
    captor.addEventListener("mouseup", () => {
        if (actual.id) {
            socket.emit("mq2.sensibility.set", actual.id, i, Number(captor.value), (r, ri) => {
                console.log(r, ri);
            })
        }
    })
}


canvas.addEventListener("mousedown", (ME) => {
    let rct = canvas.getBoundingClientRect()
    let y = ME.clientY - rct.top
    let x = ME.clientX - rct.left
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        console.log(x, y);
        let size = 10
        for (const id in ptx) {
            let pos = ptx[id].pos
            if (y >= pos.y * 10 - size && y <= pos.y * 10 + size && x >= pos.x * 10 - size && x <= pos.x * 10 + size) {
                console.log(id);
                ptx_selected.mousedown = true
            }
        }
    }
})
canvas.addEventListener("mouseup", () => {
    if (ptx_selected.mousedown) {
        ptx_selected.mousedown = false
        socket.emit("pylon.pos.update", ptx_selected.ptx, {x: ptx_selected.x/10, y: ptx_selected.y/10}, (success) => {
            console.log(`Pylon modifié: ${success}`);
            
        })
    }
})
canvas.addEventListener("mouseleave", () => {
    if (ptx_selected.mousedown) {
        ptx_selected.mousedown = false
        socket.emit("pylon.pos.update", ptx_selected.ptx, {x: ptx_selected.x/10, y: ptx_selected.y/10}, (success) => {
            console.log(`Pylon modifié: ${success}`);
            
        })
    }
})

canvas.addEventListener("mousemove", (ME) => {
    let rct = canvas.getBoundingClientRect()
    let y = ME.clientY - rct.top
    let x = ME.clientX - rct.left
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        let size = 10
        let ptx_found
        if (ptx_selected.mousedown) {
            ptx[ptx_selected.ptx].pos.x = x/10
            ptx[ptx_selected.ptx].pos.y = y/10
        }
        for (const id in ptx) {
            let pos = ptx[id].pos
            if (y >= pos.y * 10 - size && y <= pos.y * 10 + size && x >= pos.x * 10 - size && x <= pos.x * 10 + size) {
                ptx_selected.x = pos.x*10
                ptx_selected.y = pos.y*10
                ptx_selected.show = true
                ptx_selected.ptx = id
                ptx_found = true
            } else {
                if (!ptx_found) {
                    ptx_selected.show = false
                }
            }
        }
    }
})