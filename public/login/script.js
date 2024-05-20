let loginBtn = document.getElementById('login')

socket.on("connect", () => {
    document.getElementById("load").classList.add("hidden")
})

const username = document.getElementById("username")
const password = document.getElementById("password")
const incorrectText = document.getElementById("incorrect")

loginBtn.addEventListener('click', () => {
    login()
})
document.addEventListener("keydown", KE => {
    if (KE.key === "Enter") {
        login()
    }
})

username.addEventListener("input", () => {
    incorrectText.classList.add("hidden")
})

password.addEventListener("input", () => {
    incorrectText.classList.add("hidden")
})

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function login() {
    socket.emit("login.manual", username.value, password.value, (res) => {
        if (res.success) {
            setCookie("token", res.cookie, 365)
            location = "../"
            console.log("Connexion reussie");
        } else {
            incorrectText.classList.remove("hidden")
            password.value = ""
            console.log("Connexion échoué");
        }
        console.log(res)
    })
}