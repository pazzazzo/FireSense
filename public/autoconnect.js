import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
var socket = io("83.195.132.36")
window.socket = socket
socket.on("loc.change", (l) => {location = l});

function getCookie(cname) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCookie("token")) {
    socket.emit("login.auto", getCookie("token"), (res) => {
        if (!res.success) {
            location = "../login"
        } else {
            console.log(res)
        }
    })
}else {
    location = "../login"
}